import React from "react";
import { ArrowRight } from "lucide-react";
import "../styles/DesktopHome.css";
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({
  title,
  description,
  difficulty,
  stakeRangemin,
  stakeRangemax,
  rewardMultiplier,
}) => {
  const navigate = useNavigate();
  const getDifficultyStyles = (difficulty) => {
    const baseStyles = "text-white text-xs px-1 py-0.5 rounded-full";
    switch (difficulty.toLowerCase()) {
      case "easy":
        return `${baseStyles} bg-[#00FF84] border border-[#1AFF00]`;
      case "medium":
        return `${baseStyles} bg-[#F37500] border border-[#FFC084]`;
      default:
        return `${baseStyles} bg-gray-500 border border-gray-400`;
    }
  };

  return (
    <div className="bg-[#1A0F2B] border-2 border-[#301F4C] rounded-[11px] p-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-white text-2xl font-medium mb-2.5">{title}</h3>
          <p className="text-[#CDCDCD] text-lg">{description}</p>
        </div>
        <span className={getDifficultyStyles(difficulty)}>{difficulty}</span>
      </div>

      <div className="bg-[#403359] rounded-lg px-4 py-[17px]">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white text-xl mb-4">Stake Range</p>
            <p className="text-white text-lg">Reward Multiplier:</p>
          </div>
          <div className="text-right">
            <p className="text-white text-lg mb-[15px]">{stakeRangemin} {stakeRangemax}</p>
            <p className="text-white text-lg">{rewardMultiplier}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-[38px]">
        <button className="details-btn" onClick={() => navigate("/details")}>
          Details
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
