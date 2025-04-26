import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { SatisfactionChart } from "@/components/charts/satisfaction-chart";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Sample data for charts
  const performanceData = [
    { name: "Q1", value: 56 },
    { name: "Q2", value: 72 },
    { name: "Q3", value: 64 },
    { name: "Q4", value: 82 },
  ];

  const satisfactionData = [
    { name: "Satisfeitos", value: 32, color: "#3b82f6" },
    { name: "Neutros", value: 56, color: "#8b5cf6" },
    { name: "Insatisfeitos", value: 12, color: "#ef4444" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "create",
      title: "Nova avaliação de desempenho criada",
      time: "Há 2 horas",
      user: "João Silva",
    },
    {
      id: 2,
      type: "complete",
      title: "Pesquisa de clima finalizada",
      time: "Ontem",
      user: "Maria Oliveira",
    },
    {
      id: 3,
      type: "report",
      title: "Relatório de avaliação 360° gerado",
      time: "2 dias atrás",
      user: "Carlos Mendes",
    },
  ];

  const assessmentTypes = [
    {
      id: "performance",
      title: "Avaliação de Desempenho",
      icon: "chart",
      responses: 52,
      lastActivity: "há 5 dias",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "climate",
      title: "Pesquisa de Clima",
      icon: "lightning",
      responses: 38,
      lastActivity: "há 12 dias",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "feedback360",
      title: "Avaliação 360°",
      icon: "users",
      responses: 24,
      lastActivity: "há 3 dias",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo(a) ao IA Avaliações
          </h1>
          <p className="text-gray-400">
            Acompanhe avaliações de desempenho, pesquisas de clima e avaliações 360° em sua empresa.
          </p>
        </div>

        <div className="mb-8">
          <Button 
            onClick={() => navigate("/create-assessment")}
            className="bg-primary hover:bg-secondary text-white rounded-lg px-6 py-3 font-medium transition-all"
          >
            Nova Avaliação
          </Button>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {assessmentTypes.map((type) => (
            <Card key={type.id} className="bg-white hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${type.bgColor} p-2 rounded-lg mr-4`}>
                    {type.icon === "chart" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${type.iconColor}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    )}
                    {type.icon === "lightning" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${type.iconColor}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                    {type.icon === "users" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${type.iconColor}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-gray-800 font-semibold text-lg">{type.title}</h3>
                </div>
                <p className="text-gray-600 mb-2">{type.responses} respostas</p>
                <p className="text-gray-500 text-sm">Última atividade: {type.lastActivity}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Análises e Resultados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-gray-800">Pontuação Geral de Desempenho</h3>
                <div>
                  <PerformanceChart data={performanceData} />
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">52 respostas</p>
                  <p className="text-gray-500 text-sm">Última avaliação: há 5 dias</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-gray-800">Satisfação dos Funcionários</h3>
                <div>
                  <SatisfactionChart data={satisfactionData} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-blue-600 font-semibold">32%</p>
                    <p className="text-gray-500 text-sm">Satisfeitos</p>
                  </div>
                  <div>
                    <p className="text-purple-600 font-semibold">56%</p>
                    <p className="text-gray-500 text-sm">Neutros</p>
                  </div>
                  <div>
                    <p className="text-red-600 font-semibold">12%</p>
                    <p className="text-gray-500 text-sm">Insatisfeitos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-xl font-bold mb-6">Atividades Recentes</h2>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className={`p-2 rounded-full mr-4 ${
                      activity.type === "create" 
                        ? "bg-blue-100" 
                        : activity.type === "complete" 
                        ? "bg-green-100" 
                        : "bg-purple-100"
                    }`}>
                      {activity.type === "create" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                      {activity.type === "complete" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {activity.type === "report" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{activity.title}</p>
                      <p className="text-gray-500 text-sm">{activity.time} por {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
