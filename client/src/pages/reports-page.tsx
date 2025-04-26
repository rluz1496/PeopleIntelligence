import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export default function ReportsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Dados de exemplo para relatórios
  const reports = [
    {
      id: 1,
      name: "Relatório de Desempenho Anual 2025",
      type: "Desempenho",
      generatedAt: "2025-04-15T14:30:00",
      status: "Completo",
      pages: 12,
      format: "PDF"
    },
    {
      id: 2,
      name: "Análise de Clima Organizacional - Q1 2025",
      type: "Clima",
      generatedAt: "2025-04-10T09:15:00",
      status: "Completo",
      pages: 8,
      format: "PDF"
    },
    {
      id: 3,
      name: "Insights de Feedback 360° - Liderança",
      type: "Feedback 360°",
      generatedAt: "2025-03-25T16:45:00",
      status: "Completo",
      pages: 15,
      format: "PDF"
    },
    {
      id: 4,
      name: "Comparativo de Desempenho Departamental",
      type: "Desempenho",
      generatedAt: "2025-03-20T11:20:00",
      status: "Completo",
      pages: 10,
      format: "PDF"
    },
    {
      id: 5,
      name: "Tendências de Satisfação dos Funcionários",
      type: "Clima",
      generatedAt: "2025-03-15T13:00:00",
      status: "Completo",
      pages: 6,
      format: "PDF"
    }
  ];

  function getReportTypeColor(type: string) {
    switch (type) {
      case "Desempenho":
        return "bg-blue-100 text-blue-800";
      case "Clima":
        return "bg-purple-100 text-purple-800";
      case "Feedback 360°":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
          <p className="text-gray-500">
            Acesse e gerencie todos os relatórios de avaliações
          </p>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Pesquisar relatórios..." 
              className="pl-9"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="performance">Desempenho</SelectItem>
              <SelectItem value="climate">Clima</SelectItem>
              <SelectItem value="feedback360">Feedback 360°</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais Recentes</SelectItem>
              <SelectItem value="oldest">Mais Antigos</SelectItem>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Data de Geração</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Páginas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Formato</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{report.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{formatDate(report.generatedAt)}</td>
                      <td className="py-3 px-4">{report.pages}</td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {report.format}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8 flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8"
                          >
                            Visualizar
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