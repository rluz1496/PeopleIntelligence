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

  // Generate test responses for an assessment
  app.post("/api/assessments/:id/generate-test-responses", isAuthenticated, async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      
      // Check if user is the creator
      if (assessment.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Não autorizado a gerar respostas para esta avaliação" });
      }
      
      // Get the participants for this assessment
      const participants = await storage.getAssessmentParticipants(assessmentId);
      
      if (participants.length === 0) {
        return res.status(400).json({ message: "Não há participantes nesta avaliação" });
      }
      
      const responseCount = req.body.count || 10; // Número de respostas a serem geradas
      const createdResponses = [];
      
      // Determine response format based on assessment type
      let responseTemplate: any = {};
      switch (assessment.typeId) {
        // Performance Assessment
        case 1:
          responseTemplate = {
            performanceScore: { min: 1, max: 10 },
            skillScores: {
              communication: { min: 1, max: 10 },
              leadership: { min: 1, max: 10 },
              technical: { min: 1, max: 10 },
              innovation: { min: 1, max: 10 },
              collaboration: { min: 1, max: 10 }
            },
            strengths: [
              "Comunicação clara e eficaz",
              "Solução criativa de problemas",
              "Conhecimento técnico avançado",
              "Habilidades de liderança",
              "Trabalho em equipe exemplar",
              "Pensamento estratégico",
              "Gerenciamento eficiente de tempo",
              "Adaptabilidade a novas situações",
              "Atenção aos detalhes",
              "Orientação a resultados"
            ],
            improvements: [
              "Melhorar comunicação com outras equipes",
              "Desenvolver habilidades de apresentação",
              "Aprimorar conhecimentos técnicos específicos",
              "Gerenciar melhor o tempo em projetos",
              "Compartilhar mais conhecimento com a equipe",
              "Praticar delegação de tarefas",
              "Melhorar documentação de processos",
              "Desenvolver habilidades de mentoria",
              "Equilibrar melhor qualidade e velocidade",
              "Participar mais ativamente de reuniões"
            ],
            comments: [
              "Tem demonstrado grande progresso nos últimos meses.",
              "Contribui significativamente para o sucesso da equipe.",
              "Ainda precisa melhorar em alguns aspectos para alcançar seu potencial.",
              "Excelente colaborador, sempre disponível para ajudar colegas.",
              "Trabalho consistente e de alta qualidade.",
              "Superou as expectativas neste período de avaliação.",
              "Demonstra iniciativa e pro-atividade em suas atividades.",
              "Bom trabalho técnico, mas pode melhorar em comunicação.",
              "Tem grande potencial para crescimento na organização.",
              "Precisa focar mais nas prioridades estabelecidas."
            ]
          };
          break;
          
        // Climate Survey
        case 2:
          responseTemplate = {
            satisfactionScore: { min: 1, max: 10 },
            categoryScores: {
              workEnvironment: { min: 1, max: 10 },
              leadership: { min: 1, max: 10 },
              benefits: { min: 1, max: 10 },
              workLifeBalance: { min: 1, max: 10 },
              careerOpportunities: { min: 1, max: 10 }
            },
            positiveAspects: [
              "Ambiente de trabalho colaborativo",
              "Lideranças acessíveis e transparentes",
              "Flexibilidade de horário",
              "Benefícios competitivos",
              "Oportunidades de aprendizado",
              "Cultura inclusiva",
              "Programa de reconhecimento",
              "Comunicação clara entre equipes",
              "Infraestrutura adequada",
              "Eventos de integração"
            ],
            improvementAreas: [
              "Comunicação entre departamentos",
              "Plano de carreira mais claro",
              "Mais feedback sobre desempenho",
              "Melhorias no pacote de benefícios",
              "Redução de reuniões desnecessárias",
              "Mais oportunidades de crescimento",
              "Processos internos mais eficientes",
              "Equilíbrio entre vida pessoal e trabalho",
              "Programas de bem-estar",
              "Treinamentos específicos para funções"
            ],
            suggestions: [
              "Implementar programa de mentoria interno",
              "Criar comitê de cultura organizacional",
              "Oferecer mais cursos e treinamentos",
              "Realizar mais eventos de integração entre áreas",
              "Revisar política de promoções",
              "Criar programa de reconhecimento mensal",
              "Melhorar comunicação sobre mudanças organizacionais",
              "Implementar programa de bem-estar",
              "Oferecer feedback mais frequente",
              "Criar espaços para compartilhamento de ideias"
            ]
          };
          break;
        
        // 360 Feedback
        case 3:
          responseTemplate = {
            overallScore: { min: 1, max: 10 },
            dimensionScores: {
              leadership: { min: 1, max: 10 },
              communication: { min: 1, max: 10 },
              teamwork: { min: 1, max: 10 },
              technicalSkills: { min: 1, max: 10 },
              decisionMaking: { min: 1, max: 10 }
            },
            strengths: [
              "Excelente comunicação interpessoal",
              "Habilidade de resolver conflitos",
              "Conhecimento técnico aprofundado",
              "Capacidade de motivar a equipe",
              "Pensamento estratégico",
              "Foco em resultados",
              "Empatia com colegas",
              "Organização e planejamento",
              "Criatividade e inovação",
              "Adaptabilidade a mudanças"
            ],
            developmentAreas: [
              "Delegação de tarefas",
              "Comunicação em momentos de pressão",
              "Gerenciamento do tempo",
              "Equilíbrio entre qualidade e agilidade",
              "Compartilhamento de conhecimento",
              "Lidar com feedbacks negativos",
              "Priorização de atividades",
              "Assertividade em reuniões",
              "Visão de longo prazo",
              "Paciência com processos"
            ],
            feedback: [
              "Demonstra grande potencial de liderança e inspira a equipe.",
              "Comunica-se bem, mas poderia melhorar ao lidar com situações de conflito.",
              "Conhecimento técnico exemplar que beneficia toda a equipe.",
              "Sempre disponível para ajudar colegas, criando um ambiente colaborativo.",
              "Organização e planejamento são pontos fortes notáveis.",
              "Poderia compartilhar mais seu conhecimento com os colegas.",
              "Excelente em lidar com clientes e stakeholders externos.",
              "Precisa desenvolver mais habilidades de delegação.",
              "Contribui significativamente para a inovação na equipe.",
              "Tem melhorado consistentemente nos últimos meses."
            ]
          };
          break;
          
        default:
          responseTemplate = {
            score: { min: 1, max: 10 },
            comment: "Avaliação genérica para teste"
          };
      }
      
      // Função auxiliar para gerar um número aleatório dentro de um intervalo
      const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      
      // Função auxiliar para selecionar um item aleatório de um array
      const randomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];
      
      // Função auxiliar para selecionar múltiplos itens aleatórios de um array
      const randomItems = (array: any[], count: number) => {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      
      // Gerar respostas simuladas baseadas no template e tipo de avaliação
      for (let i = 0; i < Math.min(responseCount, participants.length); i++) {
        const participant = participants[i];
        let responseData: any = {};
        
        switch (assessment.typeId) {
          // Performance Assessment
          case 1:
            responseData = {
              performanceScore: randomInt(responseTemplate.performanceScore.min, responseTemplate.performanceScore.max),
              skillScores: {
                communication: randomInt(responseTemplate.skillScores.communication.min, responseTemplate.skillScores.communication.max),
                leadership: randomInt(responseTemplate.skillScores.leadership.min, responseTemplate.skillScores.leadership.max),
                technical: randomInt(responseTemplate.skillScores.technical.min, responseTemplate.skillScores.technical.max),
                innovation: randomInt(responseTemplate.skillScores.innovation.min, responseTemplate.skillScores.innovation.max),
                collaboration: randomInt(responseTemplate.skillScores.collaboration.min, responseTemplate.skillScores.collaboration.max)
              },
              strengths: randomItems(responseTemplate.strengths, randomInt(1, 3)),
              improvements: randomItems(responseTemplate.improvements, randomInt(1, 3)),
              comment: randomItem(responseTemplate.comments)
            };
            break;
            
          // Climate Survey
          case 2:
            responseData = {
              satisfactionScore: randomInt(responseTemplate.satisfactionScore.min, responseTemplate.satisfactionScore.max),
              categoryScores: {
                workEnvironment: randomInt(responseTemplate.categoryScores.workEnvironment.min, responseTemplate.categoryScores.workEnvironment.max),
                leadership: randomInt(responseTemplate.categoryScores.leadership.min, responseTemplate.categoryScores.leadership.max),
                benefits: randomInt(responseTemplate.categoryScores.benefits.min, responseTemplate.categoryScores.benefits.max),
                workLifeBalance: randomInt(responseTemplate.categoryScores.workLifeBalance.min, responseTemplate.categoryScores.workLifeBalance.max),
                careerOpportunities: randomInt(responseTemplate.categoryScores.careerOpportunities.min, responseTemplate.categoryScores.careerOpportunities.max)
              },
              positiveAspects: randomItems(responseTemplate.positiveAspects, randomInt(1, 3)),
              improvementAreas: randomItems(responseTemplate.improvementAreas, randomInt(1, 3)),
              suggestion: randomItem(responseTemplate.suggestions)
            };
            break;
          
          // 360 Feedback
          case 3:
            responseData = {
              overallScore: randomInt(responseTemplate.overallScore.min, responseTemplate.overallScore.max),
              dimensionScores: {
                leadership: randomInt(responseTemplate.dimensionScores.leadership.min, responseTemplate.dimensionScores.leadership.max),
                communication: randomInt(responseTemplate.dimensionScores.communication.min, responseTemplate.dimensionScores.communication.max),
                teamwork: randomInt(responseTemplate.dimensionScores.teamwork.min, responseTemplate.dimensionScores.teamwork.max),
                technicalSkills: randomInt(responseTemplate.dimensionScores.technicalSkills.min, responseTemplate.dimensionScores.technicalSkills.max),
                decisionMaking: randomInt(responseTemplate.dimensionScores.decisionMaking.min, responseTemplate.dimensionScores.decisionMaking.max)
              },
              strengths: randomItems(responseTemplate.strengths, randomInt(1, 3)),
              developmentAreas: randomItems(responseTemplate.developmentAreas, randomInt(1, 3)),
              feedback: randomItem(responseTemplate.feedback)
            };
            break;
            
          default:
            responseData = {
              score: randomInt(responseTemplate.score.min, responseTemplate.score.max),
              comment: responseTemplate.comment
            };
        }
        
        // Criar a resposta no banco de dados
        const response = await storage.createResponse({
          assessmentId,
          userId: participant.id,
          data: JSON.stringify(responseData)
        });
        
        createdResponses.push(response);
      }
      
      res.status(201).json({
        message: `${createdResponses.length} respostas de teste geradas com sucesso`,
        count: createdResponses.length,
        responses: createdResponses
      });
    } catch (error: any) {
      console.error("Erro ao gerar respostas de teste:", error);
      res.status(500).json({ 
        message: "Erro ao gerar respostas de teste", 
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
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
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
