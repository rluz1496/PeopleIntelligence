import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function ClimatePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Dados de exemplo para pesquisas de clima
  const climateAssessments = [
    {
      id: 1,
      name: "Pesquisa de Clima Organizacional 2025",
      participants: 120,
      startDate: "2025-04-10",
      endDate: "2025-04-25",
      status: "Em andamento",
      responses: 85,
      categories: ["Liderança", "Comunicação", "Bem-estar", "Cultura"]
    },
    {
      id: 2,
      name: "Pesquisa de Satisfação dos Funcionários",
      participants: 75,
      startDate: "2024-11-05",
      endDate: "2024-11-20",
      status: "Concluída",
      responses: 72,
      categories: ["Satisfação", "Remuneração", "Benefícios"]
    },
    {
      id: 3,
      name: "Pesquisa de Cultura Corporativa",
      participants: 50,
      startDate: "2025-05-15",
      endDate: "2025-05-30",
      status: "Agendada",
      responses: 0,
      categories: ["Cultura", "Valores", "Missão"]
    }
  ];

  function getStatusColor(status: string) {
    switch (status) {
      case "Em andamento":
        return "bg-blue-100 text-blue-800";
      case "Concluída":
        return "bg-green-100 text-green-800";
      case "Agendada":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pesquisa de Clima</h1>
            <p className="text-gray-500">
              Gerencie as pesquisas de clima organizacional de sua empresa
            </p>
          </div>
          <Button
            onClick={() => navigate("/create-assessment")}
            className="bg-primary hover:bg-secondary text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Pesquisa
          </Button>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Pesquisar por nome ou categoria..." 
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Ordenar
          </Button>
        </div>

        {/* Lista de Pesquisas de Clima */}
        <Card>
          <CardHeader>
            <CardTitle>Pesquisas de Clima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Participantes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Início</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Término</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Respostas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {climateAssessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{assessment.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {assessment.categories.map((category, index) => (
                              <span 
                                key={index} 
                                className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{assessment.participants}</td>
                      <td className="py-3 px-4">{formatDate(assessment.startDate)}</td>
                      <td className="py-3 px-4">{formatDate(assessment.endDate)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${(assessment.responses / assessment.participants) * 100}%` }}
                            ></div>
                          </div>
                          <span>{assessment.responses}/{assessment.participants}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/results/${assessment.id}`)}
                            className="text-xs h-8"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}