import { useState } from "react";
import { Link } from "wouter";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CubeIcon, Globe, Sun, Moon } from "lucide-react";
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
    <nav className="bg-secondary-light border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <CubeIcon className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-xl font-bold">3D Ordinal Minter</span>
                  <span className="ml-1 text-xs text-primary font-semibold">BSV</span>
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <Globe className="w-5 h-5 mr-1" />
                    <span className="ml-1 uppercase">{language}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-secondary-light border border-gray-700">
                  <DropdownMenuItem onClick={() => changeLanguage("en")} className="text-gray-300 hover:bg-gray-700">
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("es")} className="text-gray-300 hover:bg-gray-700">
                    Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
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
