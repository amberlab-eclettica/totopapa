import React from "react";
import Hero from "../components/Hero";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-16 parchment-bg p-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-cinzel text-cardinal-red text-center mb-6">How TOTOPAPA Works</h2>
            <div className="font-lora space-y-4 text-gray-800">
              <p>Welcome to the irreverent yet respectful fantasy conclave game, where you can predict who will next wear the papal tiara!</p>
              <ol className="list-decimal pl-8 space-y-2">
                <li>Register with a creative name and ecclesiastical title</li>
                <li>Browse our esteemed (fictional) cardinal candidates</li>
                <li>Cast your vote for who you think will emerge as the next Pope</li>
                <li>Add new cardinal candidates or anonymous Vatican gossip</li>
                <li>Track voting statistics and see who's leading the divine race</li>
              </ol>
              <p className="italic text-sm text-gray-600 mt-4">Remember: This game is purely fictional and meant for entertainment among friends. No cardinals were harmed in the making of this website.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
