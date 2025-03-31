import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import "../styles/DesktopHome.css";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const DetailsCard = ({
  title,
  description1,
  description2,

  minStake = 50,
  maxStake = 5000,
  rewardMultiplier = "2.5x",
}) => {
  const [stakeAmount, setStakeAmount] = useState(minStake);
  const potentialReward = (parseFloat(stakeAmount) * parseFloat(rewardMultiplier.replace('x', ''))).toFixed(2);


  const handleSliderChange = (e) => {
    setStakeAmount(e.target.value);
  };

  return (
    <div className="bg-[#1A0F2B] border-2 border-[#301F4C] rounded-[11px] p-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-white text-2xl font-medium mb-2.5">{title}</h3>
          <p className="text-[#CDCDCD] text-lg">{description1}</p>
          <p className="text-[#CDCDCD] text-lg">{description2}</p>

        </div>
      </div>

      <div className="bg-[#403359] rounded-lg px-4 py-[17px] mb-5">
        <h4 className="text-white text-xl mb-4">Stake Amount</h4>
        
        <div className="mb-2">
          <input
            type="range"
            min={minStake}
            max={maxStake}
            value={stakeAmount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white text-sm">${minStake}</span>
          <span className="text-white text-lg font-medium">${stakeAmount}</span>
          <span className="text-white text-sm">${maxStake}</span>
        </div>
      </div>

      <div className="bg-[#403359] rounded-lg px-4 py-[17px] mb-5">
        <div className="flex justify-between  items-end">
          <div>
            <p className="text-white text-xl mb-4">Potential Reward</p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">${potentialReward}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <p className="text-white text-sm">
          <span className="font-semibold">Note:</span> The challenge will start immediately after staking. Make sure you're ready to begin.
        </p>
      </div>

      <div className="flex justify-between gap-4 mt-[38px]">
        <button 
          
          className="detailss-btn"
        >
          Connect Wallet
        </button>
        
        <button 
          className="detailsss-btn"
        >
          Start Challenge
         
        </button>
      </div>
    </div>
  );
};

export default DetailsCard;
