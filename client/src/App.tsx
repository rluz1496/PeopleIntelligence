import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CreateAssessmentPage from "@/pages/create-assessment-page";
import ResultsPage from "@/pages/results-page";
import LandingPage from "@/pages/landing-page";
import PerformancePage from "@/pages/performance-page";
import ClimatePage from "@/pages/climate-page";
import Feedback360Page from "@/pages/feedback360-page";
import ReportsPage from "@/pages/reports-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/create-assessment" component={CreateAssessmentPage} />
      <ProtectedRoute path="/results/:id" component={ResultsPage} />
      <ProtectedRoute path="/performance" component={PerformancePage} />
      <ProtectedRoute path="/climate" component={ClimatePage} />
      <ProtectedRoute path="/feedback360" component={Feedback360Page} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/landing" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
