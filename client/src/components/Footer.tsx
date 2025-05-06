import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-papal-purple text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-cinzel text-vatican-gold">TOTOPAPA</h2>
            <p className="font-lora text-sm mt-2 opacity-80">
              The Irreverent Vatican League
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-lora text-sm opacity-80">
              Creato par goderse.
            </p>
            <p className="font-lora text-sm opacity-80 mt-1">
              No cardinals were harmed in the making of this website.
            </p>
            <p className="font-tangerine text-xl mt-3 text-vatican-gold">
              Amberlab
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
