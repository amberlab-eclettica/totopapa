import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import useUser from "../hooks/useUser";

const Hero: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [, navigate] = useLocation();
  const { user } = useUser();

  return (
    <section
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1537799943037-f5da89a88ee7?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000&h=800')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-4xl md:text-6xl font-cinzel text-vatican-gold mb-4">
            Selezione Divina
          </h2>
          <p className="text-xl md:text-2xl font-lora text-white max-w-2xl mx-auto mb-8">
            Piazza le tue scommesse sul prossimo Sommo Pontefice.
          </p>

          {!user ? (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="px-8 py-3 text-lg bg-cardinal-red hover:bg-red-700 text-white rounded-md shadow-lg font-cinzel transform transition hover:scale-105 glow-on-hover">
                  Unisciti al Sacro Conclave
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
          ) : (
            <Button
              className="px-8 py-3 text-lg bg-cardinal-red hover:bg-red-700 text-white rounded-md shadow-lg font-cinzel transform transition hover:scale-105 glow-on-hover"
              onClick={() => navigate("/cardinals")}
            >
              Vedi i Candidati Cardinali
            </Button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black opacity-80"></div>
    </section>
  );
};

export default Hero;
