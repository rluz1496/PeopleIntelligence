import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

// Assessment types
export const assessmentTypes = pgTable("assessment_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Assessments table
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  typeId: integer("type_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  aiPrompt: text("ai_prompt"),
});

// Modificamos o schema para aceitar strings para as datas
export const insertAssessmentSchema = createInsertSchema(assessments)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    // Aceitamos strings de data ISO, já que é isso que o input type="date" envia
    startDate: z.string(),
    endDate: z.string(),
  });

// Departments table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// Assessment Departments (many-to-many)
export const assessmentDepartments = pgTable("assessment_departments", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  departmentId: integer("department_id").notNull(),
});

// Assessment Participants (many-to-many)
export const assessmentParticipants = pgTable("assessment_participants", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  userId: integer("user_id").notNull(),
});

// AI Analysis Options for Assessments (many-to-many)
export const assessmentAiOptions = pgTable("assessment_ai_options", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  optionId: integer("option_id").notNull(),
});

// AI Analysis Options
export const aiOptions = pgTable("ai_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Responses to assessments
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  userId: integer("user_id").notNull(),
  data: text("data").notNull(), // JSON data with responses
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  submittedAt: true,
});

// AI Analysis Results
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  analysis: text("analysis").notNull(), // JSON data with analysis
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  generatedAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AssessmentType = typeof assessmentTypes.$inferSelect;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Department = typeof departments.$inferSelect;

export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
