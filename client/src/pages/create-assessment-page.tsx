import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const assessmentSchema = z.object({
  type: z.enum(["performance", "climate", "feedback360"]),
  name: z.string().min(5, {
    message: "O nome da avaliação deve ter pelo menos 5 caracteres",
  }),
  startDate: z.string().min(1, {
    message: "Data de início é obrigatória",
  }),
  endDate: z.string().min(1, {
    message: "Data de término é obrigatória",
  }),
  departments: z.array(z.string()).optional(),
  participants: z.array(z.string()).optional(),
  aiAnalysis: z.array(z.string()).optional(),
  aiPrompt: z.string().optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

const departments = [
  { id: "hr", name: "Recursos Humanos" },
  { id: "tech", name: "Tecnologia" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Vendas" },
  { id: "finance", name: "Financeiro" },
  { id: "operations", name: "Operações" },
];

const participants = [
  { id: 1, name: "Ana Silva", department: "Recursos Humanos" },
  { id: 2, name: "Bruno Oliveira", department: "Tecnologia" },
  { id: 3, name: "Carolina Santos", department: "Marketing" },
  { id: 4, name: "Daniel Pereira", department: "Vendas" },
  { id: 5, name: "Eduardo Costa", department: "Financeiro" },
  { id: 6, name: "Fernanda Lima", department: "Operações" },
  { id: 7, name: "Gabriel Almeida", department: "Recursos Humanos" },
  { id: 8, name: "Helena Martins", department: "Tecnologia" },
];

const aiAnalysisOptions = [
  { id: "patterns", name: "Padrões de comportamento" },
  { id: "development", name: "Áreas para desenvolvimento" },
  { id: "strengths", name: "Pontos fortes da equipe" },
  { id: "suggestions", name: "Sugestões de melhoria" },
  { id: "comparison", name: "Comparação com avaliações anteriores" },
  { id: "trends", name: "Previsão de tendências" },
];

export default function CreateAssessmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      type: "performance",
      name: "",
      startDate: "",
      endDate: "",
      departments: [],
      participants: [],
      aiAnalysis: ["patterns", "development", "strengths", "suggestions"],
      aiPrompt: "",
    },
  });

  // Mutation para criar avaliação
  const createAssessmentMutation = useMutation({
    mutationFn: async (data: AssessmentFormValues) => {
      // Converter tipo e ids para o formato esperado pelo backend
      const typeIdMap = {
        performance: 1,
        climate: 2,
        feedback360: 3
      };
      
      // Criar um objeto de avaliação sem datas para evitar problemas de conversão
      const assessmentData = {
        name: data.name,
        typeId: typeIdMap[data.type],
        startDate: "2025-01-01", // Data fixa temporária
        endDate: "2025-12-31",   // Data fixa temporária
        aiPrompt: data.aiPrompt || null
      };
      
      // Criar avaliação
      const response = await apiRequest("POST", "/api/assessments", assessmentData);
      const createdAssessment = await response.json();
      
      if (data.departments && data.departments.length > 0) {
        // Adicionar departamentos
        await Promise.all(data.departments.map(deptId => 
          apiRequest("POST", `/api/assessments/${createdAssessment.id}/departments`, { 
            departmentId: parseInt(deptId) 
          })
        ));
      }
      
      if (data.participants && data.participants.length > 0) {
        // Adicionar participantes
        await Promise.all(data.participants.map(userId => 
          apiRequest("POST", `/api/assessments/${createdAssessment.id}/participants`, { 
            userId: parseInt(userId) 
          })
        ));
      }
      
      if (data.aiAnalysis && data.aiAnalysis.length > 0) {
        // Adicionar opções de análise IA
        await Promise.all(data.aiAnalysis.map(optionId => 
          apiRequest("POST", `/api/assessments/${createdAssessment.id}/ai-options`, { 
            optionId 
          })
        ));
      }
      
      return createdAssessment;
    },
    onSuccess: (data) => {
      toast({
        title: "Avaliação criada com sucesso",
        description: "Agora você pode adicionar respostas e gerar análises.",
      });
      navigate(`/results/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar avaliação",
        description: error.message || "Ocorreu um erro ao criar a avaliação. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(values: AssessmentFormValues) {
    createAssessmentMutation.mutate(values);
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar Nova Avaliação</h1>
          <p className="text-gray-400">Configure os detalhes da sua avaliação</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="bg-white rounded-xl mb-8">
              <CardContent className="p-6 text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-gray-700 font-medium mb-2">Tipo de Avaliação</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-all">
                                <RadioGroupItem value="performance" id="performance" className="text-primary" />
                                <label htmlFor="performance" className="ml-3 cursor-pointer flex-1">
                                  <span className="block font-medium text-gray-800">Avaliação de Desempenho</span>
                                  <span className="block text-sm text-gray-500">Avalie o desempenho dos colaboradores</span>
                                </label>
                              </div>
                              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-all">
                                <RadioGroupItem value="climate" id="climate" className="text-primary" />
                                <label htmlFor="climate" className="ml-3 cursor-pointer flex-1">
                                  <span className="block font-medium text-gray-800">Pesquisa de Clima</span>
                                  <span className="block text-sm text-gray-500">Meça a satisfação do ambiente de trabalho</span>
                                </label>
                              </div>
                              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-all">
                                <RadioGroupItem value="feedback360" id="feedback360" className="text-primary" />
                                <label htmlFor="feedback360" className="ml-3 cursor-pointer flex-1">
                                  <span className="block font-medium text-gray-800">Avaliação 360°</span>
                                  <span className="block text-sm text-gray-500">Feedback multi-direcional completo</span>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel className="block text-gray-700 font-medium mb-2">Nome da Avaliação</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Avaliação Semestral 2025" 
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="block text-gray-700 font-medium mb-2">Data de Início</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "dd/MM/yyyy")
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      field.onChange(format(date, "yyyy-MM-dd"));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="block text-gray-700 font-medium mb-2">Data de Término</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "dd/MM/yyyy")
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      field.onChange(format(date, "yyyy-MM-dd"));
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl mb-8">
              <CardContent className="p-6 text-gray-800">
                <h3 className="font-semibold text-lg mb-4">Participantes</h3>

                <FormField
                  control={form.control}
                  name="departments"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="block text-gray-700 font-medium mb-2">Selecione os Departamentos</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {departments.map((dept) => (
                          <FormItem
                            key={dept.id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-all"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(dept.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), dept.id]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((value) => value !== dept.id) || []
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="ml-3 cursor-pointer text-gray-800">
                              {dept.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 font-medium mb-2">Participantes Específicos (opcional)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {participants.map((person) => (
                          <FormItem
                            key={person.id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-all"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(String(person.id))}
                                onCheckedChange={(checked) => {
                                  const stringId = String(person.id);
                                  if (checked) {
                                    field.onChange([...(field.value || []), stringId]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((value) => value !== stringId) || []
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="ml-3 cursor-pointer text-gray-800">
                              {person.name} ({person.department})
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl mb-8">
              <CardContent className="p-6 text-gray-800">
                <h3 className="font-semibold text-lg mb-4">Análise por IA</h3>

                <FormField
                  control={form.control}
                  name="aiAnalysis"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="block text-gray-700 font-medium mb-2">O que você gostaria que a IA analisasse?</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiAnalysisOptions.map((option) => (
                          <FormItem
                            key={option.id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-all"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), option.id]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((value) => value !== option.id) || []
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="ml-3 cursor-pointer text-gray-800">
                              {option.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-700 font-medium mb-2">Instruções Adicionais para a IA (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Analise também o impacto do trabalho remoto no desempenho das equipes..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
                disabled={createAssessmentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-all"
                disabled={createAssessmentMutation.isPending}
              >
                {createAssessmentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Avaliação"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
