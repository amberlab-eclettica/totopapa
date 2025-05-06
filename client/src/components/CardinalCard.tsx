import React from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import useUser from "../hooks/useUser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";

interface CardinalCardProps {
  cardinal: {
    id: number;
    name: string;
    title: string;
    age: number;
    description: string;
    imageUrl: string;
    voteCount: number;
  };
  refetch: () => void;
}

const CardinalCard: React.FC<CardinalCardProps> = ({ cardinal, refetch }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [isVoting, setIsVoting] = React.useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  
  const handleVote = async () => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    
    try {
      setIsVoting(true);
      await apiRequest("POST", "/api/votes", {
        userId: user.id,
        cardinalId: cardinal.id
      });
      
      toast({
        title: "Amen, fratello!",
        description: `Hai votato per ${cardinal.name}!`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/cardinals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/votes/stats"] });
      refetch();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Il signore non ha sentito la tua preghiera, fratello. Prega più forte.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-vatican-gold">
      <div className="relative w-full h-48 bg-gray-200">
        <img 
          src={cardinal.imageUrl} 
          alt={cardinal.name} 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback to a default image on error
            e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Coat_of_arms_Holy_See.svg/800px-Coat_of_arms_Holy_See.svg.png";
          }}
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold font-cinzel text-cardinal-red">{cardinal.name}</h3>
            <p className="text-gray-600 italic font-lora">{cardinal.title}</p>
          </div>
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-cardinal-red text-white text-sm font-bold">
            {cardinal.age}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4 font-lora text-sm">{cardinal.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 font-lora">
            <span>Current votes: {cardinal.voteCount || 0}</span>
          </div>
          <Button 
            className="bg-papal-purple hover:bg-purple-800 text-white font-lora flex items-center gap-2"
            disabled={isVoting}
            onClick={handleVote}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08"></path>
              <path d="M18 14v4h4"></path>
              <path d="M18 22v-4h-4"></path>
            </svg>
            <span className="ml-1">Vote</span>
          </Button>
        </div>
      </div>
      
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-cinzel text-cardinal-red">
              Enter the Conclave to Vote
            </DialogTitle>
          </DialogHeader>
          <LoginForm 
            onSuccess={() => {
              setLoginDialogOpen(false);
              handleVote();
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardinalCard;
