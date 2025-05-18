import React, { useState, useContext, useEffect } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import "../styles/DesktopHome.css";
import { Button } from "./ui/button";
import { useChallengeContext } from "../context/ChallengeContext";
import Contractcontext from "../context/contractcontext";
import walletcontext from "../context/walletcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFitnessData from "../Utils/useStepCount";
import { toast, ToastContainer } from "react-toastify";

const DetailsCard = ({ challenge }) => {
  // Preserving all the original logic/state
  const { contract } = useContext(Contractcontext);
  const { account, Setbalance } = useContext(walletcontext);
  const ethToInrRate = 157669;
  const minStake = 0.0006342400852418675;
  const maxStake = 50;
  const rewardMultiplier = challenge?.rewardMultiplier?.toString() || "1.3";
  const [ethAmount, setEthAmount] = useState(minStake.toString());
  const [stakeAmount, setStakeAmount] = useState((minStake * ethToInrRate).toFixed(2));
  const [loading, setLoading] = useState(false);
  const { selectedChallenge } = useChallengeContext();
  const navigate = useNavigate();
  const { todaySteps } = useFitnessData();
  const [currentSteps, setCurrentSteps] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  // Handle ETH input
  const handleEthChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setEthAmount(value);
      if (value !== "") {
        setStakeAmount((parseFloat(value || "0") * ethToInrRate).toFixed(2));
      }
    }
  };

  const handleEthBlur = () => {
    let value = parseFloat(ethAmount);
    if (isNaN(value)) value = minStake;
    value = Math.max(minStake, Math.min(maxStake, value));
    setEthAmount(value.toString());
    setStakeAmount((value * ethToInrRate).toFixed(2));
  };

  // Handle INR input
  const handleInrChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setStakeAmount(value);
      if (value !== "") {
        setEthAmount((parseFloat(value || "0") / ethToInrRate).toString());
      }
    }
  };

  const handleInrBlur = () => {
    let value = parseFloat(stakeAmount);
    if (isNaN(value)) value = minStake * ethToInrRate;
    value = Math.max(minStake * ethToInrRate, Math.min(maxStake * ethToInrRate, value));
    setStakeAmount(value.toFixed(2));
    setEthAmount((value / ethToInrRate).toString());
  };

  // Potential reward calculation
  const potentialReward = (
    parseFloat(stakeAmount || "0") * parseFloat(rewardMultiplier.replace("x", "")) +
    parseFloat(stakeAmount || "0")
  ).toFixed(2);

  useEffect(() => {
    if (todaySteps > 0) {
      setCurrentSteps(todaySteps);
    }
  }, [todaySteps]);

  const handleStake = async () => {
    try {
      // Execute the rest of the function
      const stakeData = {
        challengeId: challenge._id,
        ethStaked: "7",
        rewardsEarned: "50",
        isCompleted: false
      };

      const response = await axios.post(
        `http://localhost:3000/ActiveChallenge/create/${localStorage.getItem('JwtToken')}`,
        stakeData
      );

      if (response.status === 201) {
        toast.success("Challenge started successfully!");
        localStorage.setItem("challengeInitialSteps", currentSteps);
        navigate("/");
      } else {
        throw new Error("Failed to create challenge");
      }
    } catch (error) {
      console.error("Staking failed:", error);
      toast.error(`Staking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#1A0F2B]/90 to-[#1A0F2B] border border-[#301F4C] rounded-xl shadow-lg overflow-hidden">
        {/* Collapsible Form Section */}
        <div className={`transition-all duration-300 ${isFormExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="p-4 space-y-4">
            {/* Amount Input Fields */}
            <div className="bg-[#301F4C]/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
              <div className="mb-3">
                <label className="text-white text-sm font-medium block mb-1">ETH Amount</label>
                <input
                  type="text"
                  value={ethAmount}
                  onChange={handleEthChange}
                  onBlur={handleEthBlur}
                  className="w-full bg-[#251838] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 border border-purple-500/30"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-1">Stake Amount (INR)</label>
                <input
                  type="text"
                  value={stakeAmount}
                  onChange={handleInrChange}
                  onBlur={handleInrBlur}
                  className="w-full bg-[#251838] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 border border-purple-500/30"
                />
                <p className="text-purple-300 text-xs mt-1">
                  Min: ₹{(minStake * ethToInrRate).toFixed(2)} | Max: ₹{(maxStake * ethToInrRate).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Reward Display */}
            <div className="bg-[#301F4C]/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm font-medium">Potential Reward</p>
                  <p className="text-purple-300 text-xs">Multiplier: {rewardMultiplier}x</p>
                </div>
                <div className="text-right">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 text-xl font-bold">₹{potentialReward}</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-amber-400/90 p-2 rounded-lg text-xs text-black">
              <span className="font-semibold">Note:</span> Your stake will be refunded if you complete {challenge?.stepGoal?.toLocaleString() || "0"} steps within 24 hours. If you fail, your stake will be distributed to the reward pool.
            </div>
          </div>
        </div>

        {/* Action Button Section - Always Visible */}
        <div className="p-4 flex flex-col gap-3">
          <button
            className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-purple-500/30"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <span className="flex items-center">
              <span className="mr-2  w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                {isFormExpanded ? '-' : '+'}
              </span>
              {isFormExpanded ? 'Hide Details' : 'Show Stake Details'}
            </span>
            <ChevronRight className={`w-4 h-4 transition-transform ${isFormExpanded ? 'rotate-90' : ''}`} />
          </button>
          
          <button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2"
            onClick={handleStake}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Take this Challenge <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-center" theme="dark" />
    </>
  );
};

export default DetailsCard;