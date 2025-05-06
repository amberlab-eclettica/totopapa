import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cardinalValidationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CardinalFormProps {
  onSuccess: () => void;
}

const cardinalImages = [
  // Luis Antonio Tagle
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Cardinal_Luis_Antonio_Tagle_speaking_from_the_podium_%28cropped%29.jpg/800px-Cardinal_Luis_Antonio_Tagle_speaking_from_the_podium_%28cropped%29.jpg",
  // José Tolentino de Mendonça
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/TOL.jpg/800px-TOL.jpg",
  // Matteo Zuppi
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Matteo_Maria_Zuppi%2C_presidente_CEI.jpg/800px-Matteo_Maria_Zuppi%2C_presidente_CEI.jpg",
  // Pietro Parolin
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Secretary_Blinken_Meets_with_Cardinal_Parolin_%2851800106773%29.jpg/800px-Secretary_Blinken_Meets_with_Cardinal_Parolin_%2851800106773%29.jpg",
  // Jean-Claude Hollerich
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Hollerich_Jean-Claude_2015_%28cropped%29.jpg/800px-Hollerich_Jean-Claude_2015_%28cropped%29.jpg",
  // Robert Prevost
  "https://upload.wikimedia.org/wikipedia/commons/c/c8/MeetingPPrevost.jpg"
];

const CardinalForm: React.FC<CardinalFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm({
    resolver: zodResolver(cardinalValidationSchema),
    defaultValues: {
      name: "",
      title: "",
      age: 70,
      description: "",
      imageUrl: cardinalImages[Math.floor(Math.random() * cardinalImages.length)]
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/cardinals", values);
      toast({
        title: "Cardinale Aggiunto",
        description: `${values.name} è stato aggiunto al Sacro Collegio!`,
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere il cardinale. Per favore riprova.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Nome del Cardinale
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="es. Cardinale Benedetto Veloce" 
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Titolo/Soprannome
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="es. Il Cardinale Velocista di Monaco" 
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Età
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={50} 
                  max={120} 
                  placeholder="65" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Descrizione
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Scrivi una descrizione divertente..." 
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                URL Immagine
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input 
                    type="text"
                    placeholder="Inserisci l'URL di un'immagine" 
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                  />
                  <div className="flex flex-wrap gap-2">
                    {cardinalImages.map((url, index) => (
                      <img 
                        key={index} 
                        src={url} 
                        alt={`Cardinal option ${index + 1}`}
                        className={`w-12 h-12 object-cover cursor-pointer border-2 ${field.value === url ? 'border-cardinal-red' : 'border-transparent'}`}
                        onClick={() => form.setValue('imageUrl', url)}
                      />
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full py-3 bg-vatican-gold hover:bg-yellow-500 text-black rounded-md font-cinzel"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aggiungendo..." : "Aggiungi al Sacro Collegio"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CardinalForm;
