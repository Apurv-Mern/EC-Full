import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Calculator } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Portfolio", href: "#portfolio" },
    { name: "Pricing", href: "#pricing" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  // Theme hook
  const [theme, , toggleTheme] = useTheme();

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "backdrop-gaming border-b border-border/20"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" >
            <a href="#software-estimation" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span  >
                Estimator Calculator
              </span>
            </a>
          </div>
          {/* Theme Toggle Button (always visible on right) */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;