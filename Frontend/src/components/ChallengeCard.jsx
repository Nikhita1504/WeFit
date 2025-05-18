import React from "react";
import { ArrowRight, Star, Award, Clock, ChevronRight } from "lucide-react";
import "../styles/DesktopHome.css";
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({ challenge, isRecommended, onClick }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || "").toLowerCase()) {
      case "easy":
        return "#00FF84";
      case "medium":
        return "#F37500";
      case "hard":
        return "#FF0000";
      default:
        return "#AAAAAA";
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate("/details", { state: { challenge } });
  };

  return (
    <div
      className="w-full cursor-pointer overflow-hidden mb-4"
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="relative">
        {/* Top gradient banner */}
        <div 
          className="h-3 w-full" 
          style={{ 
            background: `linear-gradient(90deg, ${getDifficultyColor(challenge.difficulty)} 0%, #333333 100%)` 
          }}
        ></div>
        
        {/* Main card body */}
        <div className="bg-gradient-to-b from-[#292929] to-[#1A1A1A] rounded-b-xl shadow-lg border-x border-b border-[#333333]">
          
          {/* Recommended badge */}
          {isRecommended && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center bg-[#1E1E5A] text-[#8A8AFF] rounded-full py-1 px-3 text-xs">
                <Star className="mr-1 w-3 h-3 fill-[#8A8AFF] stroke-[#8A8AFF]" />
                <span>AI Pick</span>
                {challenge.rawData?.RecommendationScore && (
                  <span className="ml-1 font-bold">
                    {challenge.rawData.RecommendationScore.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Challenge name & description */}
          <div className="p-4">
            <h3 className="text-white text-lg font-bold">{challenge.name}</h3>
            <p className="text-[#ADADAD] text-sm mt-1">
              {challenge.description ||
                `Complete ${challenge.stepGoal || 0} steps${
                  challenge.exercises?.length
                    ? ` + ${challenge.exercises.length} exercises`
                    : ""
                }`
              }
            </p>
            
            {/* Difficulty indicator */}
            <div className="flex items-center mt-3">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
              ></div>
              <span className="text-white text-xs uppercase tracking-wider font-medium">
                {challenge.difficulty || "Medium"} difficulty
              </span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#444444] to-transparent"></div>
          
          {/* Stats section */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Award className="text-[#FFD700] w-5 h-5 mr-2" />
              <div>
                <p className="text-[#ADADAD] text-xs">Reward</p>
                <p className="text-white text-base font-bold">+50</p>
              </div>
            </div>
            
            <div>
              <button
                onClick={handleDetailsClick}
                className="flex items-center bg-gradient-to-r from-[#444444] to-[#333333] hover:from-[#555555] hover:to-[#444444] text-white text-sm rounded-full py-2 px-4 transition-all duration-300"
              >
                View Details
                <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Exercises section - only shown for recommended challenges */}
          {isRecommended && challenge.rawData?.Exercises && challenge.rawData.Exercises.length > 0 && (
            <div className="px-4 pb-4">
              <div className="bg-[#222222] rounded-lg p-3">
                <span className="text-[#ADADAD] text-xs uppercase tracking-wider font-medium mb-2 block">
                  Included Exercises
                </span>
                <div className="flex flex-wrap gap-2">
                  {challenge.rawData.Exercises.map((exercise, index) => (
                    <span
                      key={index}
                      className="text-white text-xs bg-[#333333] rounded-full py-1 px-3"
                    >
                      {exercise}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;