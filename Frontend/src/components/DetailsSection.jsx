import React from "react";
import DetailsCard from "./DetailsCard";
import DetailsCardDes from "./DetailsCardDes";
const DetailsSection = () => {
  const challenges = [
    {
      title: "Stake Crypto",
      description1: "1. Complete 5,000 steps in a single day",
      description2: "2. Challenge must be completed within 24 hours",

      rewardMultiplier: "1.5x rewards",
    },
  ];
  const challengesDes = [
    {
      title: "Challenge Requirement",
      description1: "1. Complete 5,000 steps in a single day",
      description2: "2. Steps must be verified through the app",
      description3: "2. Challenge must be completed within 24 hours",

    },
  ];

  return (
    <div className="w-full max-w-[859px] mx-auto rounded-[19px] p-[50px]">
      <div className="mb-10">
        <h2 className="text-white text-3xl font-medium mb-4">
          5K Steps Challenge
        </h2>
        <p className="text-[#CDCDCD] text-xl">
          Complete 5,000 steps in a single day to earn rewards and get your
          stake back
        </p>
      </div>
      <div className="space-y-12">
        {challengesDes.map((challengesDes, index) => (
          <DetailsCardDes
            key={index}
            title={challengesDes.title}
            description1={challengesDes.description1}
            description2={challengesDes.description2}
            description3={challengesDes.description3}
          />
        ))}
      </div>

      <div className="space-y-12">
        {challenges.map((challenge, index) => (
          <DetailsCard
            key={index}
            title={challenge.title}
            description1={challenge.description1}
            description2={challenge.description2}
            rewardMultiplier={challenge.rewardMultiplier}
          />
        ))}
      </div>
    </div>
  );
};

export default DetailsSection;
