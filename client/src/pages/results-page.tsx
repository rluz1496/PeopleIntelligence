import { useParams, useLocation } from "wouter";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PrintIcon } from "@/components/ui/icons";
import { AIAnalysisSection } from "@/components/analysis/ai-analysis-section";
import { GenerateTestData } from "@/components/analysis/generate-test-data";
import { useQuery } from "@tanstack/react-query";
import { Assessment, Response, AnalysisResult, Department, User } from "@shared/schema";

// Interface para os dados retornados pela API de avaliação com campos extras
interface AssessmentWithDetails extends Assessment {
  departments: Department[];
  participants: User[];
  aiOptions: string[];
}

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const assessmentId = params.id ? parseInt(params.id) : 0;
  
  // Buscar dados da avaliação
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery<AssessmentWithDetails>({
    queryKey: [`/api/assessments/${assessmentId}`],
    enabled: !!assessmentId && !isNaN(assessmentId),
  });
  
  // Buscar respostas da avaliação
  const { data: responses, isLoading: isLoadingResponses } = useQuery<Response[]>({
    queryKey: [`/api/assessments/${assessmentId}/responses`],
    enabled: !!assessmentId && !isNaN(assessmentId),
  });
  
  // Buscar análises existentes
  const { data: existingAnalyses, isLoading: isLoadingAnalyses } = useQuery<AnalysisResult[]>({
    queryKey: [`/api/assessments/${assessmentId}/analysis`],
    enabled: !!assessmentId && !isNaN(assessmentId),
  });
  
  // Determinar o tipo de avaliação
  const getAssessmentType = () => {
    if (!assessment) return "performance";
    
    switch (assessment.typeId) {
      case 1:
        return "performance";
      case 2:
        return "climate";
      case 3:
        return "feedback360";
      default:
        return "performance";
    }
  };

  // Sample data for charts
  const departmentData = [
    { name: "RH", value: 7.5 },
    { name: "Tecnologia", value: 8.2 },
    { name: "Marketing", value: 8.4 },
    { name: "Vendas", value: 6.8 },
    { name: "Financeiro", value: 7.3 },
  ];

  const skillsData = [
    { name: "Comunicação", value: 7.2 },
    { name: "Liderança", value: 6.5 },
    { name: "Técnico", value: 8.1 },
    { name: "Inovação", value: 7.4 },
    { name: "Colaboração", value: 7.8 },
  ];

  const trendData = [
    { month: "Jan", "2025": 6.8, "2024": 6.2 },
    { month: "Fev", "2025": 6.9, "2024": 6.3 },
    { month: "Mar", "2025": 7.2, "2024": 6.4 },
    { month: "Abr", "2025": 7.4, "2024": 6.6 },
    { month: "Mai", "2025": 7.5, "2024": 6.7 },
    { month: "Jun", "2025": 7.8, "2024": 6.9 },
    { month: "Jul", "2025": null, "2024": 7.0 },
    { month: "Ago", "2025": null, "2024": 7.1 },
    { month: "Set", "2025": null, "2024": 7.2 },
    { month: "Out", "2025": null, "2024": 7.4 },
    { month: "Nov", "2025": null, "2024": 7.5 },
    { month: "Dez", "2025": null, "2024": 7.6 },
  ];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resultados da Avaliação</h1>
          <p className="text-gray-400">Avaliação de Desempenho - 1° Semestre 2025</p>
        </div>

        <Card className="bg-white rounded-xl mb-8">
          <CardContent className="p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Resumo da Avaliação</h3>
              <div className="flex items-center">
                <span className="text-gray-500 mr-3">Exportar:</span>
                <Button variant="outline" size="icon" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                  <DownloadIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all ml-2">
                  <PrintIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-blue-800 text-sm font-medium mb-2">Total de Participantes</h4>
                <p className="text-blue-900 text-2xl font-bold">
                  {responses ? responses.length : 0}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-800 text-sm font-medium mb-2">Taxa de Conclusão</h4>
                <p className="text-green-900 text-2xl font-bold">
                  {assessment && assessment.participants ? 
                    `${Math.round((responses?.length || 0) / assessment.participants.length * 100)}%` : 
                    "0%"
                  }
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-purple-800 text-sm font-medium mb-2">Pontuação Média</h4>
                <p className="text-purple-900 text-2xl font-bold">7.8/10</p>
              </div>
            </div>

            {/* Nome dinâmico da avaliação */}
            {assessment && (
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-2">
                  {assessment.name}
                </h4>
                <p className="text-gray-600">
                  {new Date(assessment.startDate).toLocaleDateString('pt-BR')} a {new Date(assessment.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Seção de Análise IA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="bg-white rounded-xl h-full">
              <CardContent className="p-6">
                <AIAnalysisSection 
                  assessmentId={assessmentId}
                  assessmentType={getAssessmentType() as "performance" | "climate" | "feedback360"}
                  hasResponses={!!(responses && responses.length > 0)}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-white rounded-xl h-full">
              <CardContent className="p-6">
                <GenerateTestData 
                  assessmentId={assessmentId} 
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white rounded-xl">
            <CardContent className="p-6 text-gray-800">
              <h3 className="font-semibold text-lg mb-4">Desempenho por Departamento</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    domain={[0, 10]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: "rgba(124, 125, 243, 0.1)" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--secondary))"
                    radius={4}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl">
            <CardContent className="p-6 text-gray-800">
              <h3 className="font-semibold text-lg mb-4">Principais Competências</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsData} layout="vertical">
                  <XAxis
                    type="number"
                    domain={[0, 10]}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: "rgba(124, 125, 243, 0.1)" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={4}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white rounded-xl mb-8">
          <CardContent className="p-6 text-gray-800">
            <h3 className="font-semibold text-lg mb-4">Comparação com Avaliações Anteriores</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[5, 10]}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="2025"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="2024"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-all"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
