import React, { useState } from "react";
import ChallengeCard from "./ChallengeCard";
import "../styles/TabSelector.css";

const ChallengeSection = () => {
  const [activeTab, setActiveTab] = useState('steps');
  const challenges = [
    {
      title: "5K Steps Challenge",
      description: "Complete 5,000 steps in a single day",
      difficulty: "Easy",
      stakeRangemin: "Rs 50",
      stakeRangemax: "- 500 in ETH",
      rewardMultiplier: "1.5x rewards",
    },
    {
      title: "5K Steps Challenge",
      description: "Complete 5,000 steps in a single day",
      difficulty: "Medium",
      stakeRangemin: "Rs 50",
      stakeRangemax: "- 500 in ETH",
      rewardMultiplier: "1.5x rewards",
    },
    {
      title: "5K Steps Challenge",
      description: "Complete 5,000 steps in a single day",
      difficulty: "Medium",
      stakeRangemin: "Rs 50",
      stakeRangemax: "- 500 in ETH",
      rewardMultiplier: "1.5x rewards",
    },
  ];

  return (
    <div className="w-full max-w-[859px] mx-auto rounded-[19px] p-[50px]">
      <div className="mb-10">
        <h2 className="text-white text-3xl font-medium mb-4">
          Challenge Selection
        </h2>
        <p className="text-[#CDCDCD] text-xl">
          Choose a challenge to stake on ETH
        </p>
      </div>
      <div className="StepsStrengthCombo mb-8">
        <div className="tab-container">
          <div className="tab-nav">
            <button 
              className={`tab-button ${activeTab === 'steps' ? 'active' : ''}`}
              onClick={() => setActiveTab('steps')}
            >
              Steps
            </button>
            <button 
              className={`tab-button ${activeTab === 'strength' ? 'active' : ''}`}
              onClick={() => setActiveTab('strength')}
            >
              Strength
            </button>
            <button 
              className={`tab-button ${activeTab === 'combo' ? 'active' : ''}`}
              onClick={() => setActiveTab('combo')}
            >
              Combo
            </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'steps' && (
        <div className="space-y-12">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
              title={challenge.title}
              description={challenge.description}
              difficulty={challenge.difficulty}
              stakeRangemin={challenge.stakeRangemin}
              stakeRangemax={challenge.stakeRangemax}
              rewardMultiplier={challenge.rewardMultiplier}
            />
          ))}
        </div>
      )}
      
      {activeTab === 'strength' && (
        <div className="space-y-12">
          {/* Strength content will go here */}
        </div>
      )}
      
      {activeTab === 'combo' && (
        <div className="space-y-12">
          {/* Combo content will go here */}
        </div>
      )}
    </div>
  );
};

export default ChallengeSection;
