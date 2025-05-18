import React, { useEffect, useState } from "react";
import ChallengeCard from "./ChallengeCard";
import "../styles/TabSelector.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChallengeSection = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [challenges, setChallenges] = useState([]);
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch regular challenges
  const fetchChallenges = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/challenges/get");
      setChallenges(response.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  // Fetch personalized recommendations
  const fetchRecommendations = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/flask/recommendations", 
        {
          height: userData.height,
          weight: userData.weight,
          age: userData.age,
          gender: userData.gender,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setRecommendationData(response.data);
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    if (userData) {
      fetchRecommendations();
    }
  },[userData]);

  // Combine all challenges with AI recommendations marked
  const getAllChallenges = () => {
    const regularChallenges = challenges.map(c => ({
      ...c,
      isRecommended: false,
      rawData: null
    }));

    if (!recommendationData) return regularChallenges;

    const aiChallenges = recommendationData.recommendations.map(rec => ({
      _id: `rec-${rec.ChallengeName.toLowerCase().replace(/\s+/g, '-')}`,
      name: rec.ChallengeName,
      type: rec.type === 'cardio' ? 'steps' : 
            rec.type === 'strength' ? 'strength' : 'combo',
      description: rec.desc,
      difficulty: rec.Intensity === 'high' ? 'Hard' : 
                 rec.Intensity === 'medium' ? 'Medium' : 'Easy',
      stepGoal: rec.type === 'cardio' ? 10000 : 5000,
      exercises: rec.Exercises,
      minStake: 0.01,
      maxStake: 0.1,
      rewardMultiplier: rec.Intensity === 'high' ? 2.5 : 
                      rec.Intensity === 'medium' ? 2.0 : 1.5,
      isRecommended: true,
      rawData: rec
    }));

    return [...aiChallenges, ...regularChallenges];
  };

  // Filter challenges based on active tab
  const getFilteredChallenges = () => {
    const allChallenges = getAllChallenges();
    if (activeTab === 'all') return allChallenges;
    return allChallenges.filter(c => c.type === activeTab);
  };

  const handleChallengeSelect = (challenge) => {
    navigate('/details', { state: { challenge } });
  };

  return (
    <div className="w-full  sm:px-6 md:px-8 max-w-[859px] mx-auto rounded-lg sm:rounded-xl md:rounded-[19px]  sm:p-6 md:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-medium mb-2 sm:mb-3">
          {userData ? "Recommended For You" : "All Challenges"}
        </h2>
        <p className="text-[#CDCDCD] text-sm sm:text-base md:text-lg">
          {userData ? "Based on your profile" : "Choose a challenge to stake on ETH"}
        </p>
      </div>

      <div className="mb-6">
        <div className="tab-container">
          <div className="tab-nav flex overflow-x-auto hide-scrollbar">
            <button
              className={`tab-button text-xs sm:text-sm whitespace-nowrap ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`tab-button text-xs sm:text-sm whitespace-nowrap ${activeTab === 'steps' ? 'active' : ''}`}
              onClick={() => setActiveTab('steps')}
            >
              Steps
            </button>
            <button
              className={`tab-button text-xs sm:text-sm whitespace-nowrap ${activeTab === 'strength' ? 'active' : ''}`}
              onClick={() => setActiveTab('strength')}
            >
              Strength
            </button>
            <button
              className={`tab-button text-xs sm:text-sm whitespace-nowrap ${activeTab === 'combo' ? 'active' : ''}`}
              onClick={() => setActiveTab('combo')}
            >
              Combo
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-white text-center py-4 text-sm sm:text-base">Loading recommendations...</div>
      )}

      <div className="grid gap-4 sm:gap-6 md:gap-8">
        {getFilteredChallenges().map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            isRecommended={challenge.isRecommended}
            onClick={() => handleChallengeSelect(challenge)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeSection;