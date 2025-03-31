import { useState } from "react";
import { Link } from "wouter";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Box, Globe, Sun, Moon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState(i18n.language || "en");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black bg-opacity-60 backdrop-blur-md border-b border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative bg-black rounded-full p-1.5">
                    <Box className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  </div>
                </div>
                <span className="ml-3 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">3D Ordinal Minter</span>
                <span className="ml-1 text-xs bg-indigo-600 px-1.5 py-0.5 rounded-sm font-bold text-white">BSV</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-indigo-200 hover:text-white hover:bg-indigo-900/40 transition-colors">
                    <Globe className="w-5 h-5" />
                    <span className="ml-1.5 uppercase font-medium">{language}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#121212] border border-indigo-900/50 rounded-md overflow-hidden">
                  <DropdownMenuItem onClick={() => changeLanguage("en")} className="text-indigo-200 hover:bg-indigo-900/40">
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("es")} className="text-indigo-200 hover:bg-indigo-900/40">
                    Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-full text-indigo-200 hover:text-white hover:bg-indigo-900/40"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Connect Wallet Button */}
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
