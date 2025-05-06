import React from "react";
import { useLocation } from "wouter";
import useUser from "../hooks/useUser";
import LoginForm from "./LoginForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogIn, Menu } from "lucide-react";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [, navigate] = useLocation();
  const { user, logout } = useUser();

  return (
    <>
      <header className="bg-gradient-to-r from-cardinal-red to-papal-purple relative overflow-hidden pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1
                onClick={() => navigate("/")}
                className="text-4xl md:text-5xl font-bold text-vatican-gold font-cinzel tracking-wide cursor-pointer drop-shadow-lg"
              >
                TOTOPAPA
              </h1>
              <span className="ml-4 text-xl text-white italic font-lora hidden sm:inline">
                La Lega del Vaticano
              </span>
            </div>

            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-4 ml-auto">
                  <div className="text-white font-lora">
                    <span className="block text-sm">Loggato come:</span>
                    <span className="font-semibold">
                      {user.username}, {user.title}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    className="bg-cardinal-red hover:bg-red-800 text-white font-lora"
                    onClick={logout}
                  >
                    Esci
                  </Button>
                </div>
              ) : (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-vatican-gold hover:bg-yellow-500 text-black font-lora ml-8">
                      Entra nel Conclave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-cinzel text-cardinal-red">
                        Entra nel Conclave
                      </DialogTitle>
                    </DialogHeader>
                    <LoginForm onSuccess={() => setIsOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Button
              variant="ghost"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {/* Removed the black bar that was here */}
        <div className="absolute top-2 right-17 text-vatican-gold opacity-30 text-4xl hidden md:block">
          ✝
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cardinal-red text-white">
          <div className="px-4 py-3">
            <div className="py-2 border-b border-red-800">
              {user ? (
                <>
                  <span className="block text-sm">Loggato come:</span>
                  <span className="font-semibold">
                    {user.username}, {user.title}
                  </span>
                </>
              ) : (
                <span className="block text-sm">Benvenuto, pellegrino</span>
              )}
            </div>
            <nav className="py-2">
              <a
                href="/cardinals"
                className="block py-2 font-lora"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/cardinals");
                  setIsMenuOpen(false);
                }}
              >
                Candidati Cardinali
              </a>
              <a
                href="/statistics"
                className="block py-2 font-lora"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/statistics");
                  setIsMenuOpen(false);
                }}
              >
                Statistiche Elezioni
              </a>
              <a
                href="/news"
                className="block py-2 font-lora"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/news");
                  setIsMenuOpen(false);
                }}
              >
                Sussurri Vaticani
              </a>
            </nav>
            <div className="pt-2 border-t border-red-800">
              {user ? (
                <Button
                  className="w-full mt-2 py-2 bg-red-800 hover:bg-red-900 text-white font-lora"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Esci
                </Button>
              ) : (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full py-2 bg-vatican-gold hover:bg-yellow-500 text-black font-lora"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Entra nel Conclave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-cinzel text-cardinal-red">
                        Entra nel Conclave
                      </DialogTitle>
                    </DialogHeader>
                    <LoginForm onSuccess={() => setIsOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
