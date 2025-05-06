import React from "react";
import { useQuery } from "@tanstack/react-query";
import NewsForm from "../components/NewsForm";
import NewsItem from "../components/NewsItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeatherIcon } from "lucide-react";
import useUser from "../hooks/useUser";

const News: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  
  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/news"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="news" className="mb-16 scroll-mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-cinzel text-cardinal-red">Sussurri Vaticani</h2>
          
          {user && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="px-4 py-2 bg-vatican-gold hover:bg-yellow-500 text-black rounded-md font-lora flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-feather">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                    <line x1="16" x2="2" y1="8" y2="22"/>
                    <line x1="17.5" x2="9" y1="15" y2="15"/>
                  </svg>
                  <span className="ml-1">Aggiungi Sussurro</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-cinzel text-cardinal-red">
                    Aggiungi Sussurro Vaticano
                  </DialogTitle>
                </DialogHeader>
                <NewsForm 
                  onSuccess={() => {
                    setIsOpen(false);
                    refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src="https://pixabay.com/get/g818045399cd27c9d1e1c9cd54ed295950e6d1d51bb289d468cfdfca28835ac14139c6ab6f528859eb170b38f52f1db15b2f58e17827591daca320f0999da8f76_1280.jpg" 
            alt="Città del Vaticano" 
            className="w-full h-48 object-cover object-center rounded-lg mb-6" 
          />
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Caricamento...</span>
              </div>
              <p className="mt-2 text-lg font-lora">Caricamento notizie...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 font-lora">Impossibile caricare le notizie. Per favore riprova.</p>
            </div>
          ) : (
            <div className="space-y-6" id="newsContainer">
              {news && news.length > 0 ? (
                news.map((item: any) => (
                  <NewsItem key={item.id} news={item} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-lora">Ancora nessuna notizia. Sii il primo a condividere un sussurro Vaticano!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
