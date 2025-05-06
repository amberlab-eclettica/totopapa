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
import { userValidationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import useUser from "../hooks/useUser";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      username: "",
      title: "",
      password: ""
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/users", values);
      const userData = await response.json();
      
      // Set user in state
      setUser(userData);
      
      // Check if it was a new user or existing user based on status
      const isNewUser = response.status === 201;
      
      toast({
        title: isNewUser ? "Benvenuto al Conclave!" : "Bentornato al Conclave!",
        description: `${isNewUser ? "Registrato" : "Loggato"} come ${userData.username}, ${userData.title}`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/votes/stats"] });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      // Check if it's a 401 error (wrong password)
      if (error.response?.status === 401) {
        toast({
          title: "Errore di Autenticazione",
          description: error.response.data?.message || "Password non corretta",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Errore",
          description: "Operazione fallita. Per favore riprova.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Il tuo Nome
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="es. Giovanni" 
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
                Il tuo Titolo
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="es. Cardinale del Male" 
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 font-lora">
                Password
              </FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="La tua password segreta" 
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cardinal-red focus:border-transparent font-lora"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full py-3 bg-cardinal-red hover:bg-red-700 text-white rounded-md font-cinzel"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Invio in corso..." : "Sottomettiti alla Volontà Divina"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
