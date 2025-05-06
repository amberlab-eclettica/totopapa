import React from "react";
import { useQuery } from "@tanstack/react-query";
import CardinalList from "../components/CardinalList";
import CardinalForm from "../components/CardinalForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useUser from "../hooks/useUser";

const Cardinals: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  
  const { data: cardinals, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/cardinals"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="cardinals" className="mb-16 scroll-mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-cinzel text-cardinal-red">Candidati Cardinali</h2>
          
          {user && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="px-4 py-2 bg-vatican-gold hover:bg-yellow-500 text-black rounded-md font-lora flex items-center gap-2"
                >
                  <Plus size={16} /> Aggiungi Cardinale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-cinzel text-cardinal-red">
                    Aggiungi un Nuovo Cardinale
                  </DialogTitle>
                </DialogHeader>
                <CardinalForm 
                  onSuccess={() => {
                    setIsOpen(false);
                    refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Caricamento...</span>
            </div>
            <p className="mt-2 text-lg font-lora">Caricamento cardinali...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 font-lora">Impossibile caricare i cardinali. Per favore riprova.</p>
          </div>
        ) : (
          <CardinalList cardinals={cardinals || []} refetch={refetch} />
        )}
      </section>
    </div>
  );
};

export default Cardinals;
