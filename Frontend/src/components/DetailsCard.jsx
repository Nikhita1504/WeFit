import React, { useState, useEffect, useContext } from "react";
import { ArrowRight } from "lucide-react";
import "../styles/DesktopHome.css";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import Contractcontext from "../context/contractcontext";

const DetailsCard = ({
  title,
  description1,
  description2,
  minStake = 0.0006342400852418675,
  maxStake = 0.003,
  rewardMultiplier,
}) => {
  const {contract} = useContext(Contractcontext);
  const ethToInrRate = 157669;
  const [ethAmount, setEthAmount] = useState(minStake.toString());
  const [stakeAmount, setStakeAmount] = useState(minStake * ethToInrRate);
  console.log(rewardMultiplier);
  const potentialReward = (parseFloat(ethAmount)*ethToInrRate * parseFloat(rewardMultiplier.replace('x', '')))+stakeAmount;

  // Sync ETH input with INR amount
  useEffect(() => {
    const inrValue = parseFloat(ethAmount) * ethToInrRate;
    if (!isNaN(inrValue)) {
      setStakeAmount(inrValue);
    }
  }, [ethAmount]);

  const handleEthChange = (e) => {
    const value = e.target.value;
    // Allow empty input or valid numbers
    if (value === '' || /^[0-9]\.?[0-9]$/.test(value)) {
      setEthAmount(value);
    }
  };

  const handleEthBlur = () => {
    let value = parseFloat(ethAmount);
    if (isNaN(value)) {
      value = minStake;
    }
    value = Math.max(minStake, Math.min(maxStake, value));
    setEthAmount(value.toString());
  };

  const handleInrChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]\.?[0-9]$/.test(value)) {
      const inrValue = value === '' ? 0 : parseFloat(value);
      const ethValue = inrValue / ethToInrRate;
      setStakeAmount(inrValue);
      setEthAmount(ethValue.toString());
    }
  };

  const handleInrBlur = () => {
    let value = parseFloat(stakeAmount);
    if (isNaN(value)) {
      value = minStake * ethToInrRate;
    }
    value = Math.max(minStake * ethToInrRate, Math.min(maxStake * ethToInrRate, value));
    setStakeAmount(value);
    setEthAmount((value / ethToInrRate).toString());
  };
  
  const handleStake = async () => {
    if (!contract) return alert("Connect to wallet first!");
  
    const stakeAmount = ethAmount;
    const rewardmultiplier = rewardMultiplier; // Ensure this is correctly set
    console.log("stake amount " , stakeAmount);
  
    try {
      // Convert stakeAmount to ethers
      const parsedAmount = ethers.parseEther(stakeAmount);
  
      // Call the setGoal function
      const tx = await contract.setGoal(parsedAmount, rewardmultiplier, {
        value: parsedAmount,
      });
  
      console.log("Transaction sent: ", tx);
  
      // Wait for transaction to be confirmed
      const receipt = await tx.wait();
      console.log("Transaction confirmed: ", receipt);
      
      alert("Goal set successfully!");
    } catch (error) {
      console.error("Error setting goal:", error);
      alert("Failed to set goal. Please try again.");
    }
  };

    

  

  return (
    <div className="bg-[#1A0F2B] border-2 border-[#301F4C] rounded-[11px] p-6">
      <div className="flex justify-between  items-start mb-5">
        <div>
          <h3 className="text-white text-2xl font-medium mb-2.5">{title}</h3>
          <p className="text-[#CDCDCD] text-lg">{description1}</p>
          <p className="text-[#CDCDCD] text-lg">{description2}</p>
        </div>
      </div>

      <div className="bg-[#403359] rounded-lg px-4 py-[17px] mb-5">
        <div className="mb-4">
          <label className="text-white text-xl block mb-2">Enter Amount (ETH)</label>
          <input
            type="text"
            value={ethAmount}
            onChange={handleEthChange}
            onBlur={handleEthBlur}
            className="w-full bg-[#301F4C] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label className="text-white text-xl block mb-2">Stake Amount (INR)</label>
          <input
            type="text"
            value={stakeAmount}
            onChange={handleInrChange}
            onBlur={handleInrBlur}
            className="w-full bg-[#301F4C] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-white text-sm mt-1">Minimum amount: ₹{(minStake * ethToInrRate).toFixed(2)} (~{minStake} ETH)</p>
        </div>
      </div>

      <div className="bg-[#403359] rounded-lg px-4 py-[17px] mb-5">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white text-xl mb-4">Potential Reward</p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">${potentialReward}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <p className="text-black text-sm bg-amber-400 p-2 rounded-lg">
          <span className="font-semibold">Note:</span> Your stake will be refunded successfully if you complete the challenge within the given time frame. If you fail your stake will be distributed to the reward pool.
        </p>
      </div>

      <div className="flex justify-between gap-4 mt-[38px]">
        <button onClick={handleStake} className="detailsss-btn">
          Stake amount
        </button>
      </div>
    </div>
  );
};


export default DetailsCard;