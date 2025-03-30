import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary text-white">
      <Navbar />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

export default App;
