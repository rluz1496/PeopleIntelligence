import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AnalysisOptions {
  patterns?: boolean;
  development?: boolean;
  strengths?: boolean;
  suggestions?: boolean;
  comparison?: boolean;
  trends?: boolean;
  customPrompt?: string;
}

export interface AnalysisResults {
  summary: string;
  patterns?: string[];
  developmentAreas?: string[];
  strengths?: string[];
  suggestions?: string[];
  trends?: string[];
  riskAreas?: string[];
  recommendedActions?: string[];
}

/**
 * Analyze assessment responses data using OpenAI
 */
export async function analyzeAssessmentData(
  assessmentType: "performance" | "climate" | "feedback360",
  responseData: any[],
  options: AnalysisOptions
): Promise<AnalysisResults> {
  try {
    // Create the system prompt based on assessment type and options
    let systemPrompt = `Você é um analista especializado em ${
      assessmentType === "performance"
        ? "avaliações de desempenho de colaboradores"
        : assessmentType === "climate"
        ? "pesquisas de clima organizacional"
        : "avaliações de feedback 360°"
    }. Analise os dados a seguir e forneça insights valiosos em Português do Brasil.`;

    // Add instructions based on options
    if (options.patterns) {
      systemPrompt += " Identifique padrões e tendências relevantes nos dados.";
    }
    if (options.development) {
      systemPrompt += " Destaque áreas que precisam de desenvolvimento ou melhorias.";
    }
    if (options.strengths) {
      systemPrompt += " Identifique pontos fortes evidentes na equipe ou organização.";
    }
    if (options.suggestions) {
      systemPrompt += " Forneça sugestões práticas de ações para melhorar os resultados.";
    }
    if (options.comparison) {
      systemPrompt += " Compare com referências do setor quando aplicável.";
    }
    if (options.trends) {
      systemPrompt += " Faça projeções de tendências futuras com base nos dados atuais.";
    }
    
    // Add custom prompt if provided
    if (options.customPrompt) {
      systemPrompt += ` ${options.customPrompt}`;
    }

    // Format the data for analysis
    const dataString = JSON.stringify(responseData, null, 2);
    const userPrompt = `Aqui estão os dados para análise:\n${dataString}\n\nPor favor, forneça sua análise completa no formato JSON com os seguintes campos: "summary" (resumo geral), "patterns" (padrões identificados), "developmentAreas" (áreas a desenvolver), "strengths" (pontos fortes), "suggestions" (sugestões de melhoria), "trends" (tendências identificadas), "riskAreas" (áreas de risco), "recommendedActions" (ações recomendadas).`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    return JSON.parse(content) as AnalysisResults;
  } catch (error: any) {
    console.error("Erro na análise com OpenAI:", error);
    throw new Error(`Falha ao analisar dados: ${error.message || "Erro desconhecido"}`);
  }
}

/**
 * Generate text for a specific aspect of assessment feedback
 */
export async function generateFeedbackText(
  assessmentType: "performance" | "climate" | "feedback360",
  aspect: string,
  data: any
): Promise<string> {
  try {
    const prompt = `
Gere um texto de feedback detalhado em Português do Brasil para um relatório de ${
      assessmentType === "performance"
        ? "avaliação de desempenho"
        : assessmentType === "climate"
        ? "pesquisa de clima organizacional"
        : "avaliação 360°"
    }. 

O texto deve focar especificamente no aspecto "${aspect}" e ser baseado nos seguintes dados:
${JSON.stringify(data, null, 2)}

Forneça um texto profissional, objetivo e construtivo que destaque tendências, insights e recomendações práticas.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    return response.choices[0].message.content || "Não foi possível gerar o feedback.";
  } catch (error) {
    console.error("Erro ao gerar texto de feedback:", error);
    return "Não foi possível gerar o feedback devido a um erro.";
  }
}

/**
 * Generate charts and visualizations recommendations based on data
 */
export async function recommendVisualizations(
  assessmentType: "performance" | "climate" | "feedback360",
  data: any
): Promise<any> {
  try {
    const prompt = `
Como especialista em visualização de dados para recursos humanos, recomende as melhores visualizações para os dados abaixo de uma ${
      assessmentType === "performance"
        ? "avaliação de desempenho"
        : assessmentType === "climate"
        ? "pesquisa de clima organizacional"
        : "avaliação 360°"
    }.

Dados:
${JSON.stringify(data, null, 2)}

Forneça suas recomendações no formato JSON com a seguinte estrutura:
{
  "recommendations": [
    {
      "chartType": "bar|pie|line|radar|heat",
      "title": "Título sugerido para o gráfico",
      "description": "Por que este tipo de gráfico é adequado para estes dados",
      "dataFields": ["campos", "a", "utilizar"],
      "config": {}
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("Erro ao recomendar visualizações:", error);
    throw new Error(`Falha ao gerar recomendações: ${error.message || "Erro desconhecido"}`);
  }
}