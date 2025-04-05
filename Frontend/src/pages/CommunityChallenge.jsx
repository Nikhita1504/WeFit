import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CommunityChallenge = () => {
  const location = useLocation(); 
  const communityId = location.state?.communityId;
  // Get community ID from URL params
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeType, setChallengeType] = useState("combo");
  const [stepGoal, setStepGoal] = useState("");
  const [exercises, setExercises] = useState([
    { 
      name: "", 
      reps: "", 
      isVideoRequired: false, 
      videoUrl: ""
    },
  ]);
  const [minStake, setMinStake] = useState("0.00001");
  const [maxStake, setMaxStake] = useState("21");
  const [rewardMultiplier, setRewardMultiplier] = useState("1.2");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState(["fitness", "daily"]);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ethStaked, setEthStaked] = useState("");
  const { logout, JwtToken } = useAuth();
  
  // New state variables
  const [communityInfo, setCommunityInfo] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [isUserLeader, setIsUserLeader] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch community data, challenge, and users on component mount
  useEffect(() => {
    console.log(communityId);
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCommunityInfo(),
          fetchTodayChallenge(),
          fetchCurrentUser(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (communityId) {
      console.log("enter");
      fetchAllData();
    }
  }, [communityId]);

  // Fetch additional data once we have the user and community info
  useEffect(() => {
    if (communityInfo && currentUser) {
      fetchCommunityMembers();
      checkIfUserIsLeader();
      fetchLeaderboard();
    }
  }, [communityInfo, currentUser]);

  const fetchCurrentUser = async () => {
    try {
     
      // Replace with your actual API endpoint
      const response = await axios.get(`http://localhost:3000/community/users/${JwtToken}`);
      console.log(response.data);
      setCurrentUser(response.data);
      return response.data.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  const fetchCommunityInfo = async () => {
    try {
      console.log("enter");
      const response = await axios.get(`http://localhost:3000/community/${communityId}`);
      console.log(response.data);
      setCommunityInfo(response.data);
      return response.data.community;
    } catch (error) {
      console.error("Error fetching community info:", error);
      return null;
    }
  };

  const fetchCommunityMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/community/${communityId}/members`);
      // Filter out the leader from the members list
      console.log(  "members", response.data)
      
      setCommunityMembers(response.data);
    } catch (error) {
      console.error("Error fetching community members:", error);
    }
  };

  const fetchLeaderboard = async () => {
    // try {
    //   const response = await axios.get(`http://localhost:3000/community/${communityId}/leaderboard`);
    //   setLeaderboard(response.data.leaderboard);
    // } catch (error) {
    //   console.error("Error fetching leaderboard:", error);
    // }
  };

  const checkIfUserIsLeader = () => {
    if (currentUser && communityInfo) {
      setIsUserLeader(currentUser._id === communityInfo.leaderId);
    }
  };

  const fetchTodayChallenge = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/todaychallenge/${communityId}`);
      console.log("Hyyyyyyyy")
      console.log(response.data)
      if (response.data) {
        setTodayChallenge(response.data);
      } else {
        setTodayChallenge(null);
      }
    } catch (error) {
      console.error("Error fetching today's challenge:", error);
      setTodayChallenge(null);
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", reps: "", isVideoRequired: false, videoUrl: "" },
    ]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const toggleVideoRequired = (index) => {
    const updated = [...exercises];
    updated[index].isVideoRequired = !updated[index].isVideoRequired;
    setExercises(updated);
  };

  const handleTagChange = (e) => {
    const tagValue = e.target.value;
    setTags(tagValue.split(',').map(tag => tag.trim()));
  };

  const handleCreateChallenge = async () => {
    try {
      // Create the challenge object matching the schema
      const newChallenge = {
        communityId: communityId,
        name: challengeName,
        type: challengeType,
        stepGoal: parseInt(stepGoal) || 0,
        exercises: exercises.filter(ex => ex.name).map(exercise => ({
          name: exercise.name,
          reps: parseInt(exercise.reps) || 0,
          isVideoRequired: exercise.isVideoRequired,
          videoUrl: exercise.videoUrl || ""
        })),
        ethStaked: parseFloat(ethStaked) || 0,
        minStake: minStake.toString(),
        maxStake: maxStake.toString(),
        rewardMultiplier: parseFloat(rewardMultiplier),
        difficulty: difficulty,
        tags: tags
      };

      console.log("Submitting challenge:", newChallenge);

      const response = await axios.post(
        "http://localhost:3000/communityChallenge/create", 
        newChallenge
      );

      if (response.status === 200) {
        alert("Challenge created successfully!");
        setShowModal(false);
        // Reset form
        resetForm();
        // Fetch the newly created challenge
        fetchTodayChallenge();
      } else {
        alert("Failed to create challenge.");
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("An error occurred while creating the challenge.");
    }
  };

  const handletakeonchallange = async (challangeid) => {
   
      try {
      
  
          const stakeData = {
              challengeId: challangeid,
              ethStaked: 5,
              rewardsEarned: 5,
              isCompleted: false
          };
  
          const response = await axios.post(
             `http://localhost:3000/ActiveChallenge/create/${localStorage.getItem('JwtToken')}`,
              stakeData
          );
  
          if (response.status === 201) {
           
              navigate("/");
          } else {
              throw new Error("Failed to create challenge");
          }
      } catch (error) {
          console.error("Staking failed:", error);
          
      } finally {
          setLoading(false);
      }
  };
  

  const resetForm = () => {
    setChallengeName("");
    setChallengeType("combo");
    setStepGoal("");
    setExercises([{ name: "", reps: "", isVideoRequired: false, videoUrl: "" }]);
    setMinStake("0.00001");
    setMaxStake("21");
    setRewardMultiplier("1.2");
    setDifficulty("medium");
    setTags(["fitness", "daily"]);
    setEthStaked("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-gray-200"></div>
          <p className="mt-4 text-lg">Loading community data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Community Name */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl mb-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{communityInfo?.name || "Community"}</h1>
            <p className="text-indigo-100 mt-1">{communityInfo?.description || ""}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Challenge Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Today's Challenge</h2>
            
            {todayChallenge ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">{todayChallenge.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{todayChallenge.type}</p>
                  </div>
                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-medium capitalize">{todayChallenge.difficulty}</p>
                  </div>
                </div>
                
                {todayChallenge.stepGoal > 0 && (
                  <div className="bg-white bg-opacity-70 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-500">Step Goal</p>
                    <p className="font-medium">{todayChallenge.stepGoal.toLocaleString()} steps</p>
                  </div>
                )}
                
                {todayChallenge.exercises && todayChallenge.exercises.length > 0 && (
                  <div className="bg-white bg-opacity-70 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-500 mb-2">Exercises</p>
                    <ul className="space-y-2">
                      {todayChallenge.exercises.map((ex, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{ex.name}</span>
                          <span className="font-medium">{ex.reps} reps</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Min Stake</p>
                    <p className="font-medium">{todayChallenge.minStake} ETH</p>
                  </div>
                  <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Max Stake</p>
                    <p className="font-medium">{todayChallenge.maxStake} ETH</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-5 rounded-lg text-center">
                <p className="text-gray-600 mb-4">No challenge exists for today.</p>
                
                {isUserLeader && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
                  >
                    + Create Today's Challenge
                  </button>
                )}
              </div>
            )}
            <button onClick={()=>{
              handletakeonchallange(todayChallenge._id)}}>Take on Challange</button>
          </div>
          
          {/* Community Members Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Community Members</h2>
            
            {/* {communityMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityMembers.map(member => (
                  <div key={member._id} className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="bg-gradient-to-r from-indigo-400 to-purple-400 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3">
                      {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-medium">{member.username || "User"}</p>
                      <p className="text-sm text-gray-500 truncate">{member.walletAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No members found in this community.</p>
            )} */}
            {communityMembers.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {communityMembers.map((member, index) => (
      <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3">
          {member.userId?.name ? member.userId.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <p className="font-medium">{member.userId?.name || "User"}</p>
          <p className="text-sm text-gray-500 truncate">{member.userId?.walletAddress || "No Wallet"}</p>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-600 text-center py-4">No members found in this community.</p>
)}

          </div>
        </div>
        
        {/* Leaderboard Section */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Leaderboard</h2>
          
          {leaderboard.length > 0 ? (
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div 
                  key={user._id} 
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' :
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200' :
                    index === 2 ? 'bg-gradient-to-r from-amber-100 to-amber-200' :
                    'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-500' :
                      index === 2 ? 'bg-amber-700' :
                      'bg-indigo-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.username || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.walletAddress}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.points || 0}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <p className="text-gray-600">No leaderboard data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Create Today's Challenge
            </h2>

            {/* Challenge Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Challenge Name*
              </label>
              <input
                type="text"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Challenge Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Challenge Type*
              </label>
              <select
                value={challengeType}
                onChange={(e) => setChallengeType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="steps">Steps Only</option>
                <option value="exercise">Exercise Only</option>
                <option value="combo">Combo (Steps + Exercise)</option>
              </select>
            </div>

            {/* Step Goal */}
            {(challengeType === "steps" || challengeType === "combo") && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Step Goal
                </label>
                <input
                  type="number"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  placeholder="e.g., 6000"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
              {/* Always show exercises for debugging */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Exercises*</label>
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex flex-col gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, "name", e.target.value)}
                      placeholder="Exercise Name*"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, "reps", e.target.value)}
                      placeholder="Required Reps*"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exercise.isVideoRequired}
                          onChange={() => toggleVideoRequired(index)}
                          className="form-checkbox h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2 text-sm">Video Required for Verification</span>
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExercise}
                  className="text-indigo-500 hover:text-indigo-700 text-sm mt-1"
                >
                  + Add Exercise
                </button>
              </div>
            {/* Stake Amount - Matches ethStaked in schema */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                ETH Stake Amount*
              </label>
              <input
                type="text"
                value={ethStaked}
                onChange={(e) => setEthStaked(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Amount to stake (ETH)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                pattern="^\d*\.?\d*$"
                required
              />
            </div>

            {/* Stake Range */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Min Stake (ETH)*
                </label>
                <input
                  type="text"
                  value={minStake}
                  onChange={(e) => setMinStake(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00001"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  pattern="^\d*\.?\d*$"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Max Stake (ETH)*
                </label>
                <input
                  type="text"
                  value={maxStake}
                  onChange={(e) => setMaxStake(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="21"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  pattern="^\d*\.?\d*$"
                  required
                />
              </div>
            </div>

            {/* Reward Multiplier */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Reward Multiplier*
              </label>
              <input
                type="text"
                value={rewardMultiplier}
                onChange={(e) => setRewardMultiplier(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="1.2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                pattern="^\d*\.?\d*$"
                required
              />
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags.join(', ')}
                onChange={handleTagChange}
                placeholder="fitness, daily"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateChallenge}
                className={`px-4 py-2 rounded-lg transition ${
                  !challengeName || (challengeType !== "steps" && exercises.every(ex => !ex.name))
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                disabled={!challengeName || (challengeType !== "steps" && exercises.every(ex => !ex.name))}
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityChallenge;