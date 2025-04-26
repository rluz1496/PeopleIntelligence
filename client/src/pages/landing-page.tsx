import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-white py-6 px-8 flex justify-between items-center rounded-xl mb-8 container mx-auto mt-8">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
            <span className="text-white font-bold">IA</span>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-800">AVALIAÇÕES</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-primary font-medium">Funcionalidades</a>
          <a href="#pricing" className="text-gray-700 hover:text-primary font-medium">Preços</a>
          <a href="#ai" className="text-gray-700 hover:text-primary font-medium">Recursos</a>
          <a href="#contact" className="text-gray-700 hover:text-primary font-medium">Contato</a>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth")}
            className="px-5 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
          >
            Entrar
          </Button>
          <Button 
            onClick={() => navigate("/auth")}
            className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-all"
          >
            Teste Grátis
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto mb-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Avaliações empresariais potencializadas por IA</h1>
            <p className="text-xl text-gray-400 mb-8">
              Transforme a maneira como sua empresa avalia desempenho, clima organizacional e realiza avaliações 360° com análises profundas geradas por inteligência artificial.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-all"
              >
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-4 border border-gray-300 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Agendar Demo
              </Button>
            </div>
          </div>

          <div className="bg-[#1a1f46] p-6 rounded-2xl">
            <svg className="w-full h-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="600" height="400" fill="#1a1f46" rx="10" ry="10" />
              <text x="300" y="200" fill="#5046e5" fontSize="24" textAnchor="middle">Dashboard Analytics</text>
              <circle cx="150" cy="150" r="50" fill="#5046e5" opacity="0.2" />
              <circle cx="450" cy="150" r="70" fill="#5046e5" opacity="0.1" />
              <circle cx="300" cy="250" r="100" fill="#5046e5" opacity="0.05" />
              <rect x="100" y="300" width="400" height="30" fill="#5046e5" opacity="0.1" rx="5" ry="5" />
              <rect x="150" y="350" width="300" height="20" fill="#5046e5" opacity="0.2" rx="5" ry="5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="text-center mb-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Funcionalidades Principais</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 text-gray-800">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
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
            </div>
            <h3 className="text-xl font-semibold mb-3">Avaliação de Desempenho</h3>
            <p className="text-gray-600">
              Crie e gerencie avaliações de desempenho personalizadas para sua equipe com análise inteligente de resultados.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-gray-800">
            <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600"
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
            </div>
            <h3 className="text-xl font-semibold mb-3">Pesquisa de Clima</h3>
            <p className="text-gray-600">
              Entenda o ambiente de trabalho da sua empresa através de pesquisas anônimas com insights gerados por IA.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-gray-800">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
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
            </div>
            <h3 className="text-xl font-semibold mb-3">Avaliação 360°</h3>
            <p className="text-gray-600">
              Colete feedback multidirecional completo para desenvolvimento profissional e organizacional.
            </p>
          </div>
        </div>
      </div>

      {/* AI Section */}
      <div id="ai" className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-xl p-12 text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Inteligência Artificial a serviço do RH</h2>
              <p className="text-gray-600 mb-6">
                Nossa plataforma utiliza algoritmos avançados de IA para analisar os dados das suas avaliações e gerar insights valiosos para tomada de decisão.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Identificação de Padrões</h4>
                    <p className="text-gray-600">Descubra tendências e padrões ocultos nos dados de avaliação</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Recomendações Personalizadas</h4>
                    <p className="text-gray-600">Receba sugestões de ação baseadas nos resultados</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Previsões e Projeções</h4>
                    <p className="text-gray-600">Antecipe tendências futuras com base em dados históricos</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <svg className="w-full h-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="600" height="400" fill="#f8f9fa" rx="10" ry="10" />
                <circle cx="300" cy="150" r="100" fill="#5046e5" opacity="0.1" />
                <path d="M200,200 C250,100 350,100 400,200" stroke="#5046e5" strokeWidth="4" fill="none" />
                <circle cx="200" cy="200" r="10" fill="#5046e5" />
                <circle cx="250" cy="150" r="10" fill="#5046e5" />
                <circle cx="300" cy="120" r="10" fill="#5046e5" />
                <circle cx="350" cy="150" r="10" fill="#5046e5" />
                <circle cx="400" cy="200" r="10" fill="#5046e5" />
                <rect x="150" y="250" width="300" height="20" fill="#5046e5" opacity="0.2" rx="5" ry="5" />
                <rect x="200" y="280" width="200" height="20" fill="#5046e5" opacity="0.2" rx="5" ry="5" />
                <rect x="250" y="310" width="100" height="20" fill="#5046e5" opacity="0.2" rx="5" ry="5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="text-center mb-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Planos e Preços</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Para pequenas empresas</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">R$199</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Até 50 funcionários</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">2 tipos de avaliação</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Relatórios básicos</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Suporte por email</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
              >
                Começar Trial
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-primary relative">
            <div className="absolute top-0 inset-x-0 bg-primary text-white text-center py-1 text-sm font-medium">
              MAIS POPULAR
            </div>
            <div className="p-6 pt-10">
              <h3 className="text-xl font-semibold mb-2">Business</h3>
              <p className="text-gray-600 mb-6">Para empresas em crescimento</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">R$499</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Até 200 funcionários</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Todos os tipos de avaliação</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Análise avançada de IA</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-all">
                Começar Trial
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Para grandes organizações</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">R$999</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Funcionários ilimitados</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Avaliações personalizadas</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">API e integrações</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Gerente de conta dedicado</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
              >
                Falar com Vendas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mb-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Pronto para transformar suas avaliações?</h2>
        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Junte-se a centenas de empresas que já estão utilizando IA para aprimorar seus processos de avaliação.
        </p>
        <Button className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-all">
          Comece seu Trial Gratuito
        </Button>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-[#1a1f46] rounded-xl p-12 container mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
                <span className="text-white font-bold">IA</span>
              </div>
              <span className="ml-2 text-xl font-bold">AVALIAÇÕES</span>
            </div>
            <p className="text-gray-400">
              Transformando avaliações empresariais com o poder da inteligência artificial.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Funcionalidades</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Preços</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Casos de Uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Integrações</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Guias</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Webinars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Suporte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Carreiras</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Contato</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Parceiros</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2025 IA Avaliações. Todos os direitos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-all">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
