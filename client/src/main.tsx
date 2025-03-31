import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from "./context/wallet-context";
import { MintProvider } from "./context/mint-context";
import "./lib/i18n";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="3d-ordinal-theme">
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <MintProvider>
          <App />
          <Toaster />
        </MintProvider>
      </WalletProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
