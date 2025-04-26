import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "O nome de usuário deve ter pelo menos 3 caracteres",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres",
  }),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [authTab, setAuthTab] = useState<string>("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-12">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
            <span className="text-white font-bold">IA</span>
          </div>
          <span className="ml-2 text-xl font-bold">AVALIAÇÕES</span>
        </div>

        <Card className="bg-white rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Faça Login</h1>
                <p className="text-gray-600 mb-8">Entre na sua conta para continuar.</p>

                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="nome@empresa.com"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-lg transition-all"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </Form>

                <div className="text-center mt-6">
                  <a href="#" className="text-primary hover:text-secondary font-medium">
                    Esqueceu sua senha?
                  </a>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Registrar</h1>
                <p className="text-gray-600 mb-8">Crie sua conta para começar.</p>

                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="nome@empresa.com"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-lg transition-all"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrando..." : "Registrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
