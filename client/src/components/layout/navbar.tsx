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
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-md">
                  <Box className="h-6 w-6 text-primary" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">3D Ordinal Minter</span>
                <span className="ml-1 text-xs bg-primary/20 text-primary font-bold px-2 py-1 rounded">BSV</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white border border-gray-800 bg-gray-800/50">
                    <Globe className="w-4 h-4 mr-1" />
                    <span className="ml-1 uppercase">{language}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border border-gray-800">
                  <DropdownMenuItem onClick={() => changeLanguage("en")} className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800">
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("es")} className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800">
                    Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-1 rounded-md text-gray-400 hover:text-white border border-gray-800 bg-gray-800/50"
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
