import React from "react";
import CardinalCard from "./CardinalCard";

interface CardinalListProps {
  cardinals: any[];
  refetch: () => void;
}

const CardinalList: React.FC<CardinalListProps> = ({ cardinals, refetch }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardinals.length > 0 ? (
        cardinals.map((cardinal) => (
          <CardinalCard key={cardinal.id} cardinal={cardinal} refetch={refetch} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 font-lora">No cardinals found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default CardinalList;
