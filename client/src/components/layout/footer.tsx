import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CubeIcon } from "lucide-react";
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary-light mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <CubeIcon className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">3D Ordinal Minter</span>
                <span className="ml-1 text-xs text-primary font-semibold">BSV</span>
              </a>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="flex space-x-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Discord</span>
                <FaDiscord className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link href="/terms">
              <a className="text-sm text-gray-400 hover:text-white">{t("footer.terms")}</a>
            </Link>
            <Link href="/privacy">
              <a className="text-sm text-gray-400 hover:text-white">{t("footer.privacy")}</a>
            </Link>
            <Link href="/contact">
              <a className="text-sm text-gray-400 hover:text-white">{t("footer.contact")}</a>
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} 3D Ordinal Minter. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
