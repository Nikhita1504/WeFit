import React, { useState } from "react";
import ChallengeCard from "./ChallengeCard";
import "../styles/TabSelector.css";

const ChallengeSection = ({ challenge, challenges, onChallengeSelect }) => {
  const [activeTab, setActiveTab] = useState('steps');
  
  // Filter challenges based on type (steps, strength, combo)
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'steps') return challenge.type === 'steps';
    if (activeTab === 'strength') return challenge.type === 'strength';
    if (activeTab === 'combo') return challenge.type === 'combo';
    return true;
  });

  // Format challenge data for display
  const formatChallengeData = (challenge) => ({
    title: challenge.name,
    description: `Complete ${challenge.stepGoal} steps` + 
                (challenge.exercises?.length ? ` + ${challenge.exercises.length} exercises` : ''),
    difficulty: challenge.difficulty,
    stakeRangemin: `${challenge.minStake} ETH`,
    stakeRangemax: `- ${challenge.maxStake} ETH`,
    rewardMultiplier: `${challenge.rewardMultiplier}x rewards`,
    originalData: challenge // Pass through original data for details
  });

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
      
      <div className="space-y-12">
        {filteredChallenges.map((challenge, index) => {
          const formattedChallenge = formatChallengeData(challenge);
          return (
            <ChallengeCard
              key={challenge._id || index}
              {...formattedChallenge}
              onClick={() => onChallengeSelect(challenge)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeSection;