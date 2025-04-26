import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database } from "lucide-react";

interface GenerateTestDataProps {
  assessmentId: number;
  onSuccess?: () => void;
}

export function GenerateTestData({ assessmentId, onSuccess }: GenerateTestDataProps) {
  const [responseCount, setResponseCount] = useState<number>(5);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateResponsesMutation = useMutation({
    mutationFn: async (count: number) => {
      const response = await apiRequest("POST", `/api/assessments/${assessmentId}/generate-test-responses`, { count });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Dados de teste gerados",
        description: `${data.count} respostas foram criadas com sucesso.`,
      });
      
      // Invalidar cache para forçar recarga dos dados
      queryClient.invalidateQueries({queryKey: [`/api/assessments/${assessmentId}/responses`]});
      
      // Chamar callback se fornecido
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao gerar dados de teste",
        description: error.message || "Ocorreu um erro ao gerar dados de teste para esta avaliação.",
        variant: "destructive",
      });
    }
  });

  const generateAiAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/assessments/${assessmentId}/ai-analysis`, {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Análise de IA gerada",
        description: "Análise foi gerada com sucesso e está disponível para visualização.",
      });
      
      // Invalidar cache para forçar recarga dos dados
      queryClient.invalidateQueries({queryKey: [`/api/assessments/${assessmentId}/analysis`]});
      
      // Chamar callback se fornecido
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao gerar análise de IA",
        description: error.message || "Ocorreu um erro ao gerar a análise de IA para esta avaliação.",
        variant: "destructive",
      });
    }
  });

  const generateTestResponses = () => {
    generateResponsesMutation.mutate(responseCount);
  };

  const generateAiAnalysis = () => {
    generateAiAnalysisMutation.mutate();
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium text-lg mb-4">Ferramentas de Teste</h3>
      
      <div className="mb-4">
        <Label htmlFor="response-count" className="block text-sm font-medium text-gray-700 mb-1">
          Número de respostas a gerar
        </Label>
        <div className="flex gap-3">
          <Input
            id="response-count"
            type="number"
            min={1}
            max={20}
            value={responseCount}
            onChange={(e) => setResponseCount(parseInt(e.target.value))}
            className="max-w-[100px]"
          />
          <Button 
            onClick={generateTestResponses}
            disabled={generateResponsesMutation.isPending}
            className="flex items-center gap-2"
          >
            {generateResponsesMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Gerar Respostas
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <Button 
          onClick={generateAiAnalysis}
          disabled={generateAiAnalysisMutation.isPending}
          variant="secondary"
          className="flex items-center gap-2"
        >
          {generateAiAnalysisMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <svg 
                className="h-4 w-4"
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L4.5 8V16L12 22L19.5 16V8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.5 8L12 16L4.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.5 16L12 8L19.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Gerar Análise de IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
}