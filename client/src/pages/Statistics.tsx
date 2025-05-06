import React from "react";
import { useQuery } from "@tanstack/react-query";
import StatisticsDisplay from "../components/StatisticsDisplay";

const Statistics: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/votes/stats"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="statistics" className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-cinzel text-cardinal-red mb-8">Statistiche dell'Elezione Divina</h2>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Caricamento...</span>
            </div>
            <p className="mt-2 text-lg font-lora">Caricamento statistiche...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 font-lora">Impossibile caricare le statistiche. Per favore riprova.</p>
          </div>
        ) : (
          <StatisticsDisplay stats={stats} />
        )}
      </section>
    </div>
  );
};

export default Statistics;
