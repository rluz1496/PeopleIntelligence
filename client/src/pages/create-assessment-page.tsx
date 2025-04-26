import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";

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
  const [, navigate] = useLocation();
  
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

  function onSubmit(values: AssessmentFormValues) {
    console.log(values);
    // Here you would normally save the assessment and navigate to the appropriate page
    navigate("/");
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
                          <FormItem>
                            <FormLabel className="block text-gray-700 font-medium mb-2">Data de Início</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-gray-700 font-medium mb-2">Data de Término</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                {...field} 
                              />
                            </FormControl>
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
                      <Select
                        multiple
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-32 align-top px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            <SelectValue placeholder="Selecione os participantes" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {participants.map((person) => (
                            <SelectItem key={person.id} value={String(person.id)}>
                              {person.name} ({person.department})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">Segure CTRL para selecionar múltiplos participantes</p>
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
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-all"
              >
                Criar Avaliação
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
