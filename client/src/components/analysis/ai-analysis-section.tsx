import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysisSectionProps {
  assessmentId: number;
  assessmentType: "performance" | "climate" | "feedback360";
  hasResponses: boolean;
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

export function AIAnalysisSection({ 
  assessmentId, 
  assessmentType,
  hasResponses 
}: AIAnalysisSectionProps) {
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateAnalysisMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST", 
        `/api/assessments/${assessmentId}/ai-analysis`
      );
      return await res.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.results);
      queryClient.invalidateQueries({
        queryKey: [`/api/assessments/${assessmentId}/analysis`]
      });
      toast({
        title: "Análise gerada com sucesso",
        description: "A análise de IA foi gerada e está pronta para revisão.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao gerar análise:", error);
      toast({
        title: "Erro ao gerar análise",
        description: error.message || "Ocorreu um erro ao gerar a análise de IA.",
        variant: "destructive",
      });
    },
  });

  const generateVisualizationsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST", 
        `/api/assessments/${assessmentId}/visualization-recommendations`
      );
      return await res.json();
    },
    onSuccess: (data) => {
      console.log("Recomendações de visualização:", data);
      toast({
        title: "Recomendações geradas",
        description: "As recomendações de visualização foram geradas com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao gerar recomendações:", error);
      toast({
        title: "Erro ao gerar recomendações",
        description: error.message || "Ocorreu um erro ao gerar as recomendações de visualização.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateAnalysis = () => {
    if (!hasResponses) {
      toast({
        title: "Sem respostas",
        description: "É necessário ter respostas para gerar uma análise.",
        variant: "destructive",
      });
      return;
    }
    
    generateAnalysisMutation.mutate();
  };

  const handleGenerateVisualizations = () => {
    if (!hasResponses) {
      toast({
        title: "Sem respostas",
        description: "É necessário ter respostas para gerar recomendações de visualização.",
        variant: "destructive",
      });
      return;
    }
    
    generateVisualizationsMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Análise de IA</h3>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleGenerateVisualizations}
            disabled={generateVisualizationsMutation.isPending || !hasResponses}
            className="bg-white text-primary hover:bg-gray-100"
          >
            {generateVisualizationsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>Recomendar Visualizações</>
            )}
          </Button>
          <Button
            onClick={handleGenerateAnalysis}
            disabled={generateAnalysisMutation.isPending || !hasResponses}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {generateAnalysisMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Análise de IA
              </>
            )}
          </Button>
        </div>
      </div>

      {!analysis && !generateAnalysisMutation.isPending && (
        <Card className="bg-gray-50 border border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Ainda não há análise de IA
            </h4>
            <p className="text-gray-500 mb-4">
              {hasResponses
                ? "Clique no botão 'Gerar Análise de IA' para criar uma análise detalhada baseada nas respostas."
                : "É necessário ter respostas para gerar uma análise de IA."}
            </p>
          </CardContent>
        </Card>
      )}

      {generateAnalysisMutation.isPending && (
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Gerando análise...
            </h4>
            <p className="text-gray-500">
              A IA está analisando os dados. Isso pode levar alguns instantes.
            </p>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Resumo</h4>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-gray-700">{analysis.summary}</p>
              </div>
            </div>

            {analysis.patterns && analysis.patterns.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Padrões Identificados</h4>
                <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                  {analysis.patterns.map((pattern, index) => (
                    <li key={index} className="ml-2">{pattern}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Pontos Fortes</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="ml-2">{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.developmentAreas && analysis.developmentAreas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Áreas para Desenvolvimento</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                    {analysis.developmentAreas.map((area, index) => (
                      <li key={index} className="ml-2">{area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Sugestões</h4>
                <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="ml-2">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.recommendedActions && analysis.recommendedActions.length > 0 && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Ações Recomendadas</h4>
                <ol className="list-decimal list-inside pl-2 space-y-2 text-gray-700">
                  {analysis.recommendedActions.map((action, index) => (
                    <li key={index} className="ml-2">{action}</li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}