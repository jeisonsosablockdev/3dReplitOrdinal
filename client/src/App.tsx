import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Mint from "@/pages/Mint";
import Preview from "@/pages/Preview";
import MintConfirm from "@/pages/MintConfirm";
import MintSuccess from "@/pages/MintSuccess";
import Explorer from "@/pages/Explorer";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NavigationBar from "@/components/layout/NavigationBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mint" component={Mint} />
      <Route path="/preview/:id" component={Preview} />
      <Route path="/mint-confirm/:id" component={MintConfirm} />
      <Route path="/mint-success/:id" component={MintSuccess} />
      <Route path="/explorer" component={Explorer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Use a default theme value until the useTheme hook is properly initialized
  // This avoids the need for useTheme() which is causing the error
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-dark text-white">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
