import React from "react";
import { useLocation } from "wouter";

const Navbar: React.FC = () => {
  const [location, navigate] = useLocation();

  return (
    <nav className="bg-papal-purple text-vatican-gold sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-start space-x-10">
          <a
            href="/cardinals"
            className={`py-4 px-2 font-lora hover:text-vatican-gold border-b-2 ${
              location === "/cardinals"
                ? "border-vatican-gold text-vatican-gold"
                : "border-transparent hover:border-vatican-gold"
            } transition duration-300`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/cardinals");
            }}
          >
            Candidati Cardinali
          </a>
          <a
            href="/statistics"
            className={`py-4 px-2 font-lora hover:text-vatican-gold border-b-2 ${
              location === "/statistics" || location === "/"
                ? "border-vatican-gold text-vatican-gold"
                : "border-transparent hover:border-vatican-gold"
            } transition duration-300`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Statistiche Elezioni
          </a>
          <a
            href="/news"
            className={`py-4 px-2 font-lora hover:text-vatican-gold border-b-2 ${
              location === "/news"
                ? "border-vatican-gold text-vatican-gold"
                : "border-transparent hover:border-vatican-gold"
            } transition duration-300`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/news");
            }}
          >
            Voci dal Vaticano
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
