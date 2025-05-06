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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { newsValidationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewsFormProps {
  onSuccess: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm({
    resolver: zodResolver(newsValidationSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "hot-gossip"
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/news", values);
      toast({
        title: "Notizia Aggiunta",
        description: "Il tuo sussurro è stato condiviso in forma anonima!",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere la notizia. Per favore riprova.",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Titolo della Notizia
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Inserisci un titolo accattivante..." 
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Categoria
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora">
                    <SelectValue placeholder="Seleziona una categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hot-gossip">Gossip Piccante</SelectItem>
                  <SelectItem value="innovation">Innovazione</SelectItem>
                  <SelectItem value="entertainment">Intrattenimento</SelectItem>
                  <SelectItem value="controversy">Controversia</SelectItem>
                  <SelectItem value="miracle">Miracolo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Contenuto della Notizia
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Condividi il tuo gossip Vaticano anonimo..." 
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                  rows={4}
                />
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
            {isSubmitting ? "Diffondendo..." : "Diffondi la Parola"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsForm;
