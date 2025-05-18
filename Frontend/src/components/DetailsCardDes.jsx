import React from "react";
import { cn } from "../lib/utils";

const DetailsCardDes = ({
  title,
  description1,
  description2,
  description3,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2A1B3D] to-[#231634] border border-[#3A2C50] p-4 shadow-lg transition-all hover:shadow-purple-500/10">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-xl -ml-6 -mb-6"></div>
      
      {/* Title section with accent */}
      <div className="relative mb-3 pb-2 border-b border-purple-500/30">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
          {title}
        </h3>
        <div className="absolute bottom-0 left-0 h-[2px] w-16 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      </div>
      
      {/* Descriptions with improved visual hierarchy */}
      <div className="space-y-2.5 text-sm">
        <p className="text-gray-200 flex items-start">
          <span className=" w-5 h-5 mr-2 flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full text-xs flex items-center justify-center">1</span>
          <span>{description1}</span>
        </p>
        
        <p className="text-gray-200 flex items-start">
          <span className=" w-5 h-5 mr-2 flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full text-xs flex items-center justify-center">2</span>
          <span>{description2}</span>
        </p>
        
        <p className="text-gray-200 flex items-start">
          <span className=" w-5 h-5 mr-2 flex-shrink-0 bg-purple-500/20 text-purple-300 rounded-full text-xs flex items-center justify-center">3</span>
          <span>{description3}</span>
        </p>
      </div>
    </div>
  );
};

export default DetailsCardDes;