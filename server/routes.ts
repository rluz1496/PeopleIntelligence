import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertAssessmentSchema, insertResponseSchema, insertAnalysisResultSchema } from "@shared/schema";
import { analyzeAssessmentData, generateFeedbackText, recommendVisualizations } from "./services/openai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Não autenticado" });
  };

  // Get all departments
  app.get("/api/departments", isAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar departamentos" });
    }
  });

  // Assessments routes
  app.post("/api/assessments", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse({
        ...req.body,
        createdBy: req.user.id
      });
      
      const assessment = await storage.createAssessment(validatedData);
      
      // Add departments to assessment if provided
      if (req.body.departments && Array.isArray(req.body.departments)) {
        for (const departmentId of req.body.departments) {
          await storage.addDepartmentToAssessment(assessment.id, departmentId);
        }
      }
      
      // Add participants to assessment if provided
      if (req.body.participants && Array.isArray(req.body.participants)) {
        for (const userId of req.body.participants) {
          await storage.addParticipantToAssessment(assessment.id, userId);
        }
      }
      
      // Add AI options to assessment if provided
      if (req.body.aiAnalysis && Array.isArray(req.body.aiAnalysis)) {
        for (const optionId of req.body.aiAnalysis) {
          await storage.addAiOptionToAssessment(assessment.id, optionId);
        }
      }
      
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de avaliação inválidos", errors: error.format() });
      }
      res.status(500).json({ message: "Erro ao criar avaliação" });
    }
  });

  // Get assessments for the current user
  app.get("/api/assessments", isAuthenticated, async (req, res) => {
    try {
      const assessments = await storage.getAssessmentsByUser(req.user.id);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar avaliações" });
    }
  });

  // Get specific assessment by ID
  app.get("/api/assessments/:id", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      const departments = await storage.getDepartmentsByAssessment(assessmentId);
      const participants = await storage.getAssessmentParticipants(assessmentId);
      const aiOptions = await storage.getAiOptionsByAssessment(assessmentId);
      
      res.json({
        ...assessment,
        departments,
        participants,
        aiOptions
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar avaliação" });
    }
  });

  // Update assessment
  app.put("/api/assessments/:id", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a modificar esta avaliação" });
      }
      
      const updatedAssessment = await storage.updateAssessment(assessmentId, req.body);
      res.json(updatedAssessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de avaliação inválidos", errors: error.format() });
      }
      res.status(500).json({ message: "Erro ao atualizar avaliação" });
    }
  });

  // Delete assessment
  app.delete("/api/assessments/:id", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a excluir esta avaliação" });
      }
      
      await storage.deleteAssessment(assessmentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir avaliação" });
    }
  });

  // Response routes
  app.post("/api/responses", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const response = await storage.createResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de resposta inválidos", errors: error.format() });
      }
      res.status(500).json({ message: "Erro ao salvar resposta" });
    }
  });

  // Get responses for a specific assessment
  app.get("/api/assessments/:id/responses", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a visualizar as respostas desta avaliação" });
      }
      
      const responses = await storage.getResponsesByAssessment(assessmentId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar respostas" });
    }
  });

  // Analysis results routes
  app.post("/api/analysis", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAnalysisResultSchema.parse(req.body);
      
      const assessment = await storage.getAssessment(validatedData.assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a criar análise para esta avaliação" });
      }
      
      const analysisResult = await storage.createAnalysisResult(validatedData);
      res.status(201).json(analysisResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados de análise inválidos", errors: error.format() });
      }
      res.status(500).json({ message: "Erro ao criar análise" });
    }
  });

  // Get analysis results for a specific assessment
  app.get("/api/assessments/:id/analysis", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      const analysisResults = await storage.getAnalysisResultsByAssessment(assessmentId);
      res.json(analysisResults);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar análises" });
    }
  });
  
  // Generate AI analysis for an assessment
  app.post("/api/assessments/:id/ai-analysis", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a gerar análise para esta avaliação" });
      }
      
      // Get the responses for this assessment
      const responses = await storage.getResponsesByAssessment(assessmentId);
      
      if (responses.length === 0) {
        return res.status(400).json({ message: "Não há respostas para analisar nesta avaliação" });
      }
      
      // Get the AI options for this assessment
      const aiOptions = await storage.getAiOptionsByAssessment(assessmentId);
      
      // Determine assessment type
      let assessmentType: "performance" | "climate" | "feedback360";
      switch (assessment.typeId) {
        case 1:
          assessmentType = "performance";
          break;
        case 2:
          assessmentType = "climate";
          break;
        case 3:
          assessmentType = "feedback360";
          break;
        default:
          assessmentType = "performance";
      }
      
      // Parse response data (assuming it's stored as JSON string)
      const parsedResponses = responses.map(response => {
        try {
          return {
            ...response,
            parsedData: JSON.parse(response.data)
          };
        } catch (e) {
          return {
            ...response,
            parsedData: {}
          };
        }
      });
      
      // Configure analysis options based on AI options
      const analysisOptions = {
        patterns: aiOptions.includes("patterns"),
        development: aiOptions.includes("development"),
        strengths: aiOptions.includes("strengths"),
        suggestions: aiOptions.includes("suggestions"),
        comparison: aiOptions.includes("comparison"),
        trends: aiOptions.includes("trends"),
        customPrompt: assessment.aiPrompt || undefined
      };
      
      // Generate AI analysis
      const analysisResults = await analyzeAssessmentData(
        assessmentType,
        parsedResponses.map(r => r.parsedData),
        analysisOptions
      );
      
      // Save analysis to database
      const savedAnalysis = await storage.createAnalysisResult({
        assessmentId,
        analysis: JSON.stringify(analysisResults)
      });
      
      res.status(201).json({
        id: savedAnalysis.id,
        assessmentId,
        results: analysisResults,
        generatedAt: savedAnalysis.generatedAt
      });
    } catch (error: any) {
      console.error("Erro ao gerar análise com IA:", error);
      res.status(500).json({ 
        message: "Erro ao gerar análise com IA", 
        error: error.message || "Erro desconhecido"
      });
    }
  });
  
  // Generate visualization recommendations
  app.post("/api/assessments/:id/visualization-recommendations", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a gerar recomendações para esta avaliação" });
      }
      
      // Get the responses for this assessment
      const responses = await storage.getResponsesByAssessment(assessmentId);
      
      if (responses.length === 0) {
        return res.status(400).json({ message: "Não há respostas para analisar nesta avaliação" });
      }
      
      // Determine assessment type
      let assessmentType: "performance" | "climate" | "feedback360";
      switch (assessment.typeId) {
        case 1:
          assessmentType = "performance";
          break;
        case 2:
          assessmentType = "climate";
          break;
        case 3:
          assessmentType = "feedback360";
          break;
        default:
          assessmentType = "performance";
      }
      
      // Parse response data
      const parsedResponses = responses.map(response => {
        try {
          return JSON.parse(response.data);
        } catch (e) {
          return {};
        }
      });
      
      // Generate visualization recommendations
      const recommendations = await recommendVisualizations(
        assessmentType,
        parsedResponses
      );
      
      res.json(recommendations);
    } catch (error: any) {
      console.error("Erro ao gerar recomendações de visualização:", error);
      res.status(500).json({ 
        message: "Erro ao gerar recomendações de visualização", 
        error: error.message || "Erro desconhecido"
      });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const userAssessments = await storage.getAssessmentsByUser(req.user.id);
      
      // Performance evaluations count
      const performanceCount = userAssessments.filter(a => a.typeId === 1).length;
      
      // Climate surveys count
      const climateCount = userAssessments.filter(a => a.typeId === 2).length;
      
      // 360 evaluations count
      const feedback360Count = userAssessments.filter(a => a.typeId === 3).length;
      
      // Recent activities (last 5 assessments)
      const recentAssessments = userAssessments
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);
      
      res.json({
        assessmentCounts: {
          performance: performanceCount,
          climate: climateCount,
          feedback360: feedback360Count,
          total: userAssessments.length
        },
        recentAssessments
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar estatísticas do dashboard" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
