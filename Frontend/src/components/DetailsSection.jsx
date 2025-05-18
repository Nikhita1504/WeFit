import React from "react";
import DetailsCard from "./DetailsCard";
import DetailsCardDes from "./DetailsCardDes";
import { useChallengeContext } from "../context/ChallengeContext";

const DetailsSection = ({ challenge }) => {
  const challengesDes = [
    {
      title: "Challenge Requirement",
      description1: `1. Complete ${challenge.name} in a single day`,
      description2: "2. Excersises must be verified through the app",
      description3: "3. Challenge must be completed within 24 hours",
    },
  ];

  // Benefits information for the additional card
  const benefitsInfo = {
    title: "How is it beneficial for you",
    description1: "Increased Calorie Burn & Muscle Engagement: Squats and push-ups engage multiple large muscle groups, increasing the intensity of the workout and leading to higher calorie burn compared to walking alone.",
    description2: "Muscle Building & Metabolism Boost: These exercises help build lean muscle mass, which boosts your metabolism and allows you to burn more calories even at rest, leading to more efficient weight loss over time.",
    description3: "Enhanced Body Composition & Afterburn Effect: Squats and push-ups create an afterburn effect (EPOC), keeping your metabolism elevated after exercise. This helps burn more calories even after the workout ends, while improving body composition."
  };

  return (
    <div className="w-full mx-auto rounded-xl bg-gradient-to-b from-[#1A0F2B] to-[#150A20] border border-[#301F4C] shadow-lg pb-6">
      {/* Challenge Header Section - Mobile Optimized */}
      <div className="relative px-4 pt-5 pb-3">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>
        
        {/* Challenge title and tags - stacked for mobile */}
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 text-2xl font-bold leading-tight">
              {challenge.name}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-purple-300 text-xs font-medium px-2.5 py-1 bg-[#301F4C] rounded-full border border-[#3A2C50]">
                {challenge?.type?.toUpperCase() || "CHALLENGE"}
              </span>
              
              {challenge?.tags?.length > 0 && 
                challenge.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-amber-300 text-xs font-medium px-2 py-0.5 bg-[#3A2C50] rounded-full border border-amber-500/20"
                  >
                    {tag}
                  </span>
                ))
              }
            </div>
          </div>

          {/* Challenge description */}
          <p className="text-gray-300 text-sm">
            Complete this challenge in a single day to earn rewards and get your stake back
          </p>
        </div>
      </div>

      {/* Challenge Stats - Mobile friendly grid */}
      <div className="mx-4 mb-5">
        <div className="grid grid-cols-2 gap-3 p-3 bg-[#251838]/80 backdrop-blur-sm rounded-xl border border-[#362356]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-purple-300">Step Goal</p>
              <p className="text-white text-sm font-medium">{challenge?.stepGoal?.toLocaleString() || "0"} steps</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-amber-300">Difficulty</p>
              <p className="text-white text-sm font-medium capitalize">{challenge?.difficulty || "moderate"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises Section - Mobile optimized */}
      <div className="mx-4 mb-6">
        <div className="bg-[#251838]/60 backdrop-blur-sm rounded-xl p-4 border border-[#362356]">
          <h3 className="text-white text-lg font-bold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
            Exercises
          </h3>
          
          <ul className="space-y-2">
            {challenge?.exercises?.length > 0 ? (
              challenge.exercises.map((exercise, index) => (
                <li key={index} className="text-gray-200 text-sm flex items-center p-2 bg-[#301F4C]/60 rounded-lg">
                  <span className=" w-5 h-5 mr-2 bg-purple-500/20 text-purple-300 rounded-full text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium">{exercise.name}</span>
                  <span className="ml-auto bg-purple-500/20 px-2 py-0.5 rounded text-xs text-purple-300">
                    {exercise.reps} reps
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No exercises available.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Challenge Requirements */}
      <div className="px-4 space-y-4 mb-6">
        {challengesDes.map((challengeDes, index) => (
          <DetailsCardDes
            key={index}
            title={challengeDes.title}
            description1={challengeDes.description1}
            description2={challengeDes.description2}
            description3={challengeDes.description3}
          />
        ))}
        
        {/* Benefits Card */}
        <DetailsCardDes
          title={benefitsInfo.title}
          description1={benefitsInfo.description1}
          description2={benefitsInfo.description2}
          description3={benefitsInfo.description3}
        />
      </div>

      {/* Stake Card Section */}
      <div className="px-4">
        <DetailsCard challenge={challenge} />
      </div>
    </div>
  );
};

export default DetailsSection;