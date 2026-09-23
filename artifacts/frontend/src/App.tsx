import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { queryClient, setupFetchInterceptor } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PfDashboardPage from "@/pages/pf/PfDashboardPage";
import PfClientsPage from "@/pages/pf/PfClientsPage";
import PfProposalsPage from "@/pages/pf/PfProposalsPage";
import PfContractsPage from "@/pages/pf/PfContractsPage";
import PfDepositsPage from "@/pages/pf/PfDepositsPage";
import AlDashboardPage from "@/pages/al/AlDashboardPage";
import AlPropertiesPage from "@/pages/al/AlPropertiesPage";
import AlLeadsPage from "@/pages/al/AlLeadsPage";
import AlDealsPage from "@/pages/al/AlDealsPage";
import AlRemindersPage from "@/pages/al/AlRemindersPage";

setupFetchInterceptor();

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/">
        {isAuthenticated ? <Redirect to="/pf" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/pf">
        <PrivateRoute component={PfDashboardPage} />
      </Route>
      <Route path="/pf/clients">
        <PrivateRoute component={PfClientsPage} />
      </Route>
      <Route path="/pf/proposals">
        <PrivateRoute component={PfProposalsPage} />
      </Route>
      <Route path="/pf/contracts">
        <PrivateRoute component={PfContractsPage} />
      </Route>
      <Route path="/pf/deposits">
        <PrivateRoute component={PfDepositsPage} />
      </Route>
      <Route path="/al">
        <PrivateRoute component={AlDashboardPage} />
      </Route>
      <Route path="/al/properties">
        <PrivateRoute component={AlPropertiesPage} />
      </Route>
      <Route path="/al/leads">
        <PrivateRoute component={AlLeadsPage} />
      </Route>
      <Route path="/al/deals">
        <PrivateRoute component={AlDealsPage} />
      </Route>
      <Route path="/al/reminders">
        <PrivateRoute component={AlRemindersPage} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
