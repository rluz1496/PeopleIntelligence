import { 
  users, 
  assessments, 
  departments, 
  assessmentDepartments, 
  assessmentParticipants, 
  assessmentAiOptions, 
  responses, 
  analysisResults,
  type User, 
  type InsertUser, 
  type Assessment, 
  type InsertAssessment,
  type Department,
  type Response,
  type InsertResponse,
  type AnalysisResult,
  type InsertAnalysisResult
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// CRUD interface for storage
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentsByUser(userId: number): Promise<Assessment[]>;
  getAssessmentsByType(typeId: number): Promise<Assessment[]>;
  updateAssessment(id: number, data: Partial<Assessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<boolean>;
  
  // Department operations
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartmentsByAssessment(assessmentId: number): Promise<Department[]>;
  addDepartmentToAssessment(assessmentId: number, departmentId: number): Promise<boolean>;
  
  // Participant operations
  getAssessmentParticipants(assessmentId: number): Promise<User[]>;
  addParticipantToAssessment(assessmentId: number, userId: number): Promise<boolean>;
  removeParticipantFromAssessment(assessmentId: number, userId: number): Promise<boolean>;
  
  // AI options operations
  addAiOptionToAssessment(assessmentId: number, optionId: number): Promise<boolean>;
  getAiOptionsByAssessment(assessmentId: number): Promise<string[]>;
  
  // Response operations
  createResponse(response: InsertResponse): Promise<Response>;
  getResponsesByAssessment(assessmentId: number): Promise<Response[]>;
  getResponsesByUser(userId: number): Promise<Response[]>;
  
  // Analysis results operations
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(id: number): Promise<AnalysisResult | undefined>;
  getAnalysisResultsByAssessment(assessmentId: number): Promise<AnalysisResult[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  // Usando a interface Assessment (já adaptada para usar string em vez de Date)
  private assessments: Map<number, Assessment>;
  private departments: Map<number, Department>;
  private assessmentDepartments: Map<string, boolean>; // composite key: assessmentId-departmentId
  private assessmentParticipants: Map<string, boolean>; // composite key: assessmentId-userId
  private assessmentAiOptions: Map<string, boolean>; // composite key: assessmentId-optionId
  private responses: Map<number, Response>;
  private analysisResults: Map<number, AnalysisResult>;
  
  private userIdCounter: number = 1;
  private assessmentIdCounter: number = 1;
  private departmentIdCounter: number = 1;
  private responseIdCounter: number = 1;
  private analysisResultIdCounter: number = 1;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.departments = new Map();
    this.assessmentDepartments = new Map();
    this.assessmentParticipants = new Map();
    this.assessmentAiOptions = new Map();
    this.responses = new Map();
    this.analysisResults = new Map();
    
    // Create initial departments
    this.createInitialDepartments();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }
  
  private createInitialDepartments() {
    const departmentNames = [
      "Recursos Humanos",
      "Tecnologia",
      "Marketing",
      "Vendas",
      "Financeiro",
      "Operações"
    ];
    
    departmentNames.forEach(name => {
      const id = this.departmentIdCounter++;
      this.departments.set(id, {
        id,
        name
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    
    // Garantir que name e role são sempre string ou null (nunca undefined)
    const name = userData.name || null;
    const role = userData.role || null;
    
    const user: User = { 
      id,
      username: userData.username,
      password: userData.password,
      name,
      role,
      createdAt
    };
    
    this.users.set(id, user);
    return user;
  }
  
  // Assessment operations
  async createAssessment(assessmentData: InsertAssessment): Promise<Assessment> {
    const id = this.assessmentIdCounter++;
    const createdAt = new Date();
    
    // Agora não precisamos mais converter as datas, pois estamos armazenando como strings
    // Garantir que o aiPrompt é sempre string ou null (nunca undefined)
    const aiPrompt = assessmentData.aiPrompt || null;
    
    const assessment: Assessment = { 
      id,
      name: assessmentData.name,
      typeId: assessmentData.typeId,
      startDate: assessmentData.startDate, // Agora é string
      endDate: assessmentData.endDate,     // Agora é string
      createdBy: assessmentData.createdBy,
      createdAt,
      aiPrompt
    };
    
    this.assessments.set(id, assessment);
    return assessment;
  }
  
  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }
  
  async getAssessmentsByUser(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      (assessment) => assessment.createdBy === userId
    );
  }
  
  async getAssessmentsByType(typeId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      (assessment) => assessment.typeId === typeId
    );
  }
  
  async updateAssessment(id: number, data: Partial<Assessment>): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;
    
    const updatedAssessment = { ...assessment, ...data };
    this.assessments.set(id, updatedAssessment);
    return updatedAssessment;
  }
  
  async deleteAssessment(id: number): Promise<boolean> {
    return this.assessments.delete(id);
  }
  
  // Department operations
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }
  
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }
  
  async getDepartmentsByAssessment(assessmentId: number): Promise<Department[]> {
    const departmentIds = Array.from(this.assessmentDepartments.keys())
      .filter(key => key.startsWith(`${assessmentId}-`))
      .map(key => parseInt(key.split('-')[1]));
    
    return departmentIds.map(id => this.departments.get(id)).filter(Boolean) as Department[];
  }
  
  async addDepartmentToAssessment(assessmentId: number, departmentId: number): Promise<boolean> {
    const key = `${assessmentId}-${departmentId}`;
    this.assessmentDepartments.set(key, true);
    return true;
  }
  
  // Participant operations
  async getAssessmentParticipants(assessmentId: number): Promise<User[]> {
    const userIds = Array.from(this.assessmentParticipants.keys())
      .filter(key => key.startsWith(`${assessmentId}-`))
      .map(key => parseInt(key.split('-')[1]));
    
    return userIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }
  
  async addParticipantToAssessment(assessmentId: number, userId: number): Promise<boolean> {
    const key = `${assessmentId}-${userId}`;
    this.assessmentParticipants.set(key, true);
    return true;
  }
  
  async removeParticipantFromAssessment(assessmentId: number, userId: number): Promise<boolean> {
    const key = `${assessmentId}-${userId}`;
    return this.assessmentParticipants.delete(key);
  }
  
  // AI options operations
  async addAiOptionToAssessment(assessmentId: number, optionId: number): Promise<boolean> {
    const key = `${assessmentId}-${optionId}`;
    this.assessmentAiOptions.set(key, true);
    return true;
  }
  
  async getAiOptionsByAssessment(assessmentId: number): Promise<string[]> {
    return Array.from(this.assessmentAiOptions.keys())
      .filter(key => key.startsWith(`${assessmentId}-`))
      .map(key => key.split('-')[1]);
  }
  
  // Response operations
  async createResponse(responseData: InsertResponse): Promise<Response> {
    const id = this.responseIdCounter++;
    const submittedAt = new Date();
    const response: Response = { ...responseData, id, submittedAt };
    this.responses.set(id, response);
    return response;
  }
  
  async getResponsesByAssessment(assessmentId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      (response) => response.assessmentId === assessmentId
    );
  }
  
  async getResponsesByUser(userId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      (response) => response.userId === userId
    );
  }
  
  // Analysis results operations
  async createAnalysisResult(resultData: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = this.analysisResultIdCounter++;
    const generatedAt = new Date();
    const result: AnalysisResult = { ...resultData, id, generatedAt };
    this.analysisResults.set(id, result);
    return result;
  }
  
  async getAnalysisResult(id: number): Promise<AnalysisResult | undefined> {
    return this.analysisResults.get(id);
  }
  
  async getAnalysisResultsByAssessment(assessmentId: number): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values()).filter(
      (result) => result.assessmentId === assessmentId
    );
  }
}

export const storage = new MemStorage();
