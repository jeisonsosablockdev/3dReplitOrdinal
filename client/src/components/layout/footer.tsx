import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Box } from "lucide-react";
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-primary/20 p-2 rounded-md">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">3D Ordinal Minter</span>
              <span className="ml-1 text-xs bg-primary/20 text-primary font-bold px-2 py-1 rounded">BSV</span>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:bg-primary/20 hover:text-primary transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:bg-primary/20 hover:text-primary transition-colors duration-200"
              >
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-5 w-5" />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:bg-primary/20 hover:text-primary transition-colors duration-200"
              >
                <span className="sr-only">Discord</span>
                <FaDiscord className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-primary transition-colors duration-200">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-primary transition-colors duration-200">
              {t("footer.privacy")}
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors duration-200">
              {t("footer.contact")}
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} 3D Ordinal Minter. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
