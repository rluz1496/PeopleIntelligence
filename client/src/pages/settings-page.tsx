import { useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.username || "",
    jobTitle: "Gerente de RH",
    department: "Recursos Humanos",
    phone: "(21) 99999-9999"
  });

  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    newAssessment: true,
    completedAssessment: true,
    reports: true,
    reminders: true
  });

  const [apiSettings, setApiSettings] = useState({
    openaiApiKey: "****************************",
    enableAnalysis: true,
    analysisLanguage: "pt-BR",
    includeSummary: true,
    includeRecommendations: true
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    });
  };

  const handleApiSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiSettings({
      ...apiSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleChange = (key: string) => {
    setApiSettings({
      ...apiSettings,
      [key]: !apiSettings[key as keyof typeof apiSettings]
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  const handleApiSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações de API atualizadas",
      description: "Suas configurações de API foram atualizadas com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-gray-500">
            Gerencie as configurações da sua conta e do sistema
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="api">Configurações de API</TabsTrigger>
          </TabsList>

          {/* Perfil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e configurações de conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={profileForm.name} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={profileForm.email} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Cargo</Label>
                      <Input 
                        id="jobTitle" 
                        name="jobTitle" 
                        value={profileForm.jobTitle} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Input 
                        id="department" 
                        name="department" 
                        value={profileForm.department} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={profileForm.phone} 
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Salvar Alterações</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canais de Notificação</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-500">Receber notificações por email</p>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={() => handleNotificationChange('email')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Navegador</p>
                        <p className="text-sm text-gray-500">Receber notificações no navegador</p>
                      </div>
                      <Switch 
                        checked={notifications.browser} 
                        onCheckedChange={() => handleNotificationChange('browser')}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novas Avaliações</p>
                        <p className="text-sm text-gray-500">Quando uma nova avaliação for criada</p>
                      </div>
                      <Switch 
                        checked={notifications.newAssessment} 
                        onCheckedChange={() => handleNotificationChange('newAssessment')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Avaliações Concluídas</p>
                        <p className="text-sm text-gray-500">Quando uma avaliação for concluída</p>
                      </div>
                      <Switch 
                        checked={notifications.completedAssessment} 
                        onCheckedChange={() => handleNotificationChange('completedAssessment')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatórios</p>
                        <p className="text-sm text-gray-500">Quando novos relatórios estiverem disponíveis</p>
                      </div>
                      <Switch 
                        checked={notifications.reports} 
                        onCheckedChange={() => handleNotificationChange('reports')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lembretes</p>
                        <p className="text-sm text-gray-500">Lembretes para avaliações em andamento</p>
                      </div>
                      <Switch 
                        checked={notifications.reminders} 
                        onCheckedChange={() => handleNotificationChange('reminders')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Salvar Preferências</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações de API */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de API e Inteligência Artificial</CardTitle>
                <CardDescription>
                  Configure integrações com serviços de IA e processamento avançado de dados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApiSettingsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                      <Input 
                        id="openaiApiKey" 
                        name="openaiApiKey" 
                        type="password" 
                        value={apiSettings.openaiApiKey} 
                        onChange={handleApiSettingChange}
                      />
                      <p className="text-xs text-gray-500">Utilizada para geração de análises e insights.</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Análise Automática</p>
                        <p className="text-sm text-gray-500">Gerar análise automaticamente após coleta de respostas</p>
                      </div>
                      <Switch 
                        checked={apiSettings.enableAnalysis} 
                        onCheckedChange={() => handleToggleChange('enableAnalysis')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="analysisLanguage">Idioma das Análises</Label>
                      <Input 
                        id="analysisLanguage" 
                        name="analysisLanguage" 
                        value={apiSettings.analysisLanguage} 
                        onChange={handleApiSettingChange}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Incluir Resumo Executivo</p>
                        <p className="text-sm text-gray-500">Adicionar resumo executivo nos relatórios</p>
                      </div>
                      <Switch 
                        checked={apiSettings.includeSummary} 
                        onCheckedChange={() => handleToggleChange('includeSummary')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Incluir Recomendações</p>
                        <p className="text-sm text-gray-500">Adicionar recomendações baseadas em IA nos relatórios</p>
                      </div>
                      <Switch 
                        checked={apiSettings.includeRecommendations} 
                        onCheckedChange={() => handleToggleChange('includeRecommendations')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Salvar Configurações</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}