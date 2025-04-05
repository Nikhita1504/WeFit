import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import DesktopChatbot from "../components/DesktopChatbot";
import "../styles/DesktopHome.css";
import chatbot from "../assets/chatbot.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { FaHistory } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Community = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { logout, JwtToken } = useAuth();
  const [userData, setUserData] = useState();
  const [userCommunities, setUserCommunities] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityTag, setNewCommunityTag] = useState("");
  const [communitiesRanking, setCommunitiesRanking] = useState([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    reps: 0,
    sets: 0,
    duration: 0,
    description: ""
  });
  const [challengeData, setChallengeData] = useState({
    communityId: "",
    name: "",
    description: "",
    exercises: [],
    stake: {
      amount: 0
    }
  });

  const ChallengeModal = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setChallengeData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleStakeChange = (e) => {
      const { value } = e.target;
      setChallengeData(prev => ({
        ...prev,
        stake: {
          amount: parseFloat(value) || 0
        }
      }));
    };
  
    const handleExerciseChange = (e) => {
      const { name, value } = e.target;
      setCurrentExercise(prev => ({
        ...prev,
        [name]: name === 'name' || name === 'description' ? value : parseInt(value) || 0
      }));
    };
  
    const addExercise = () => {
      if (currentExercise.name.trim()) {
        setChallengeData(prev => ({
          ...prev,
          exercises: [...prev.exercises, currentExercise]
        }));
        setCurrentExercise({
          name: "",
          reps: 0,
          sets: 0,
          duration: 0,
          description: ""
        });
      }
    };
  
    const removeExercise = (index) => {
      setChallengeData(prev => ({
        ...prev,
        exercises: prev.exercises.filter((_, i) => i !== index)
      }));
    };
  
    const handleSubmit = async () => {
      try {
        const payload = {
          ...challengeData,
          communityId: selectedCommunity
        };
  
        await axios.post(
          'http://localhost:3000/communityChallenge/create',
          payload,
          {
            headers: {
              Authorization: `Bearer ${JwtToken}`,
            },
          }
        );
  
        setShowChallengeModal(false);
        setChallengeData({
          communityId: "",
          name: "",
          description: "",
          exercises: [],
          stake: {
            amount: 0
          }
        });
      } catch (error) {
        console.log("Error creating challenge:", error);
        alert(error.response?.data?.message || "Failed to create challenge");
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-[#1A0F2B] border-2 border-[#512E8B] rounded-2xl p-6 w-[600px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-white text-2xl font-medium mb-4">Create New Challenge</h2>
          
          <div className="mb-4">
            <label className="text-white block mb-2">Challenge Name*</label>
            <input
              type="text"
              name="name"
              value={challengeData.name}
              onChange={handleChange}
              className="w-full bg-[#301F4C] text-white p-2 rounded-lg"
              placeholder="Enter challenge name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-white block mb-2">Description*</label>
            <textarea
              name="description"
              value={challengeData.description}
              onChange={handleChange}
              className="w-full bg-[#301F4C] text-white p-2 rounded-lg min-h-[100px]"
              placeholder="Describe the challenge"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="text-white block mb-2">Stake Amount (ETH)*</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={challengeData.stake.amount}
              onChange={handleStakeChange}
              className="w-full bg-[#301F4C] text-white p-2 rounded-lg"
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-white text-xl font-medium mb-3">Exercises</h3>
            
            <div className="bg-[#301F4C] p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-white block mb-1 text-sm">Exercise Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={currentExercise.name}
                    onChange={handleExerciseChange}
                    className="w-full bg-[#1A0F2B] text-white p-2 rounded"
                    placeholder="e.g., Push-ups"
                    required
                  />
                </div>
                <div>
                  <label className="text-white block mb-1 text-sm">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={currentExercise.description}
                    onChange={handleExerciseChange}
                    className="w-full bg-[#1A0F2B] text-white p-2 rounded"
                    placeholder="e.g., Keep back straight"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-white block mb-1 text-sm">Reps</label>
                  <input
                    type="number"
                    min="0"
                    name="reps"
                    value={currentExercise.reps}
                    onChange={handleExerciseChange}
                    className="w-full bg-[#1A0F2B] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-white block mb-1 text-sm">Sets</label>
                  <input
                    type="number"
                    min="0"
                    name="sets"
                    value={currentExercise.sets}
                    onChange={handleExerciseChange}
                    className="w-full bg-[#1A0F2B] text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-white block mb-1 text-sm">Duration (sec)</label>
                  <input
                    type="number"
                    min="0"
                    name="duration"
                    value={currentExercise.duration}
                    onChange={handleExerciseChange}
                    className="w-full bg-[#1A0F2B] text-white p-2 rounded"
                  />
                </div>
              </div>
              
              <button
                onClick={addExercise}
                disabled={!currentExercise.name}
                className={`mt-3 px-3 py-1 rounded text-sm ${
                  !currentExercise.name
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#4CAF50] hover:bg-[#3e8e41]"
                }`}
              >
                Add Exercise
              </button>
            </div>
            
            {challengeData.exercises.length > 0 && (
              <div className="bg-[#301F4C] p-3 rounded-lg">
                <h4 className="text-white text-sm font-medium mb-2">Added Exercises:</h4>
                <div className="space-y-2">
                  {challengeData.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#1A0F2B] p-2 rounded">
                      <div>
                        <span className="text-white font-medium">{exercise.name}</span>
                        {exercise.description && (
                          <p className="text-gray-300 text-xs">{exercise.description}</p>
                        )}
                        <div className="flex gap-2 text-xs text-gray-400 mt-1">
                          {exercise.reps > 0 && <span>{exercise.reps} reps</span>}
                          {exercise.sets > 0 && <span>{exercise.sets} sets</span>}
                          {exercise.duration > 0 && <span>{exercise.duration}s</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-red-400 hover:text-red-300 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowChallengeModal(false)}
              className="px-4 py-2 bg-[#3D2A64] text-white rounded-lg hover:bg-[#4a336e]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!challengeData.name || !challengeData.description || challengeData.exercises.length === 0}
              className={`px-4 py-2 text-white rounded-lg ${
                !challengeData.name || !challengeData.description || challengeData.exercises.length === 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#4CAF50] hover:bg-[#3e8e41]"
              }`}
            >
              Create Challenge
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Fetch user data
  const getUserData = async () => {
    try {
      const payload = jwtDecode(JwtToken);
      const response = await axios.get(
        `http://localhost:3000/api/users/get/${payload.email}`,
      );
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch user communities
  const getUserCommunities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/community/user/${JwtToken}`,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
          },
        }
      );
      setUserCommunities(response.data);
    } catch (error) {
      console.log("Error fetching user communities:", error);
    }
  };

  // Fetch all communities for leaderboard
  const getAllCommunities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/community/all");
      setAllCommunities(response.data); 
      
      const ranked = response.data.map(community => ({
        ...community,
        avgEarnings: calculateMockAvgEarnings(community)
      })).sort((a, b) => b.avgEarnings - a.avgEarnings)
        .slice(0, 10);
      
      setCommunitiesRanking(ranked);
    } catch (error) {
      console.log("Error fetching all communities:", error);
    }
  };

  const calculateMockAvgEarnings = (community) => {
    return parseFloat((Math.random() * 200 + 50).toFixed(2));
  };

  // Join a community
  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/community/join/:token",
        { communityId },
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
          },
        }
      );
      getUserCommunities();
      setShowJoinModal(false);
    } catch (error) {
      console.log("Error joining community:", error);
      alert(error.response?.data?.message || "Failed to join community");
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (JwtToken) {
      getUserData();
      getUserCommunities();
      getAllCommunities();
    }
  }, [JwtToken]);

  const chatMessages = [
    {
      sender: "bot",
      text: "Hi there! I'm your StakeFit assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigateToHistory = () => {
    navigate("/history");
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  // Create Community Modal
  const CreateCommunityModal = () => {
    const [communityData, setCommunityData] = useState({
      name: "",
      description: "",
      tags: [],
      isPrivate: false,
      accessCode: "",
      currentTag: ""
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setCommunityData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    };
  
    const addTag = () => {
      if (communityData.currentTag.trim()) {
        setCommunityData(prev => ({
          ...prev,
          tags: [...prev.tags, prev.currentTag.trim()],
          currentTag: ""
        }));
      }
    };
  
    const removeTag = (indexToRemove) => {
      setCommunityData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, index) => index !== indexToRemove)
      }));
    };
  
    const handleCreateCommunity = async () => {
      try {
        const dataToSubmit = {
          name: communityData.name,
          description: communityData.description,
          tags: communityData.tags,
        };
        console.log(dataToSubmit)
  
        await axios.post(
          `http://localhost:3000/community/create/${JwtToken}`,
          dataToSubmit,
          {
            headers: {
              Authorization: `Bearer ${JwtToken}`,
            },
          }
        );
        setShowCreateModal(false);
        navigate('/community/add-challenge')
        getUserCommunities();
        getAllCommunities();
      } catch (error) {
        console.log("Error creating community:", error);
        alert(error.response?.data?.message || "Failed to create community");
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-[#1A0F2B] border-2 border-[#512E8B] rounded-2xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-white text-2xl font-medium mb-4">Create Community</h2>
          
          <div className="mb-4">
            <label className="text-white block mb-2">Community Name*</label>
            <input
              type="text"
              name="name"
              value={communityData.name}
              onChange={handleChange}
              className="w-full bg-[#301F4C] text-white p-2 rounded-lg"
              placeholder="Enter community name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-white block mb-2">Description*</label>
            <textarea
              name="description"
              value={communityData.description}
              onChange={handleChange}
              className="w-full bg-[#301F4C] text-white p-2 rounded-lg min-h-[100px]"
              placeholder="Describe your community"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="text-white block mb-2">Tags</label>
            <div className="flex">
              <input
                type="text"
                name="currentTag"
                value={communityData.currentTag}
                onChange={handleChange}
                className="flex-1 bg-[#301F4C] text-white p-2 rounded-l-lg"
                placeholder="Add tags (press Add)"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-[#6b44ae] text-white rounded-r-lg hover:bg-[#7b54be]"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {communityData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-[#301F4C] text-white px-2 py-1 rounded-full">
                  <span>#{tag}</span>
                  <button 
                    onClick={() => removeTag(index)}
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={communityData.isPrivate}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="isPrivate" className="text-white">Private Community</label>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-[#3D2A64] text-white rounded-lg hover:bg-[#4a336e]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCommunity}
              disabled={!communityData.name || !communityData.description }
              className={`px-4 py-2 text-white rounded-lg ${
                !communityData.name || !communityData.description 
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#6b44ae] hover:bg-[#7b54be]"
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Join Community Modal
  const JoinCommunityModal = () => {
    const [availableCommunities, setAvailableCommunities] = useState([]);
    
    useEffect(() => {
      const userCommunityIds = userCommunities.map(c => c._id);
      const available = allCommunities.filter(
        c => !userCommunityIds.includes(c._id)
      );
      setAvailableCommunities(available);
    }, [allCommunities, userCommunities]);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-[#1A0F2B] border-2 border-[#512E8B] rounded-2xl p-6 w-[400px]">
          <h2 className="text-white text-2xl font-medium mb-6">Join Community</h2>
          {availableCommunities.length === 0 ? (
            <p className="text-gray-300 mb-6">No communities available to join</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto mb-6">
              {availableCommunities.map((community) => (
                <div 
                  key={community._id} 
                  className="flex justify-between items-center p-3 mb-2 rounded-lg bg-[#301F4C] hover:bg-[#3D2A64] cursor-pointer"
                  onClick={() => handleJoinCommunity(community._id)}
                >
                  <div>
                    <h3 className="text-white font-medium">{community.name}</h3>
                    <p className="text-gray-300 text-sm">#{community.tag}</p>
                  </div>
                  <button className="px-3 py-1 bg-[#6b44ae] text-white rounded-full text-sm">
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => setShowJoinModal(false)}
              className="px-4 py-2 bg-[#3D2A64] text-white rounded-lg hover:bg-[#4a336e]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="desktop-home">
      <div className="desktop-history__container">
        <header className="desktop-home__header">
          <div className="desktop-home__logo-container">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/69e8365158abd202fc7d010edd0471beda6cd6aa?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
              alt="Logo"
              className="desktop-home__logo-image"
            />
            <div className="desktop-home__logo-text">StakeFit</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="overflow-hidden">
              <ConnectWallet />
            </div>
            <button onClick={handleNavigateToHistory} className="rounded-full">
              <Avatar className="h-[63px] p-3.5 w-[63px] border-4 border-[#512E8B] rounded-full bg-[#413359] cursor-pointer hover:opacity-80 transition-opacity">
                <FaHistory color="white" size={30} />
              </Avatar>
            </button>
          </div>
        </header>

        <div className="flex flex-col font-poppins p-6">
          <div className="flex h-[73px] p-3 justify-between items-center rounded-[48px] bg-[#4a336e5c] w-full">
            <div className="flex items-center gap-2">
              <button 
                className="communityjoin px-6 py-2 bg-[#6b44ae] text-white rounded-full hover:bg-[#7b54be]"
                onClick={() => setShowJoinModal(true)}
              >
                Join
              </button>
              <button 
                className="communitycreate px-6 py-2 bg-[#6b44ae] text-white rounded-full hover:bg-[#7b54be]"
                onClick={() => setShowCreateModal(true)}
              >
                Create
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCommunity('67f0bab6f400dc2e0589d700');
                  setShowChallengeModal(true);
                }}
                className="px-3 py-1 bg-[#4CAF50] text-white rounded-full text-sm hover:bg-[#3e8e41]"
              >
                Add Challenge
              </button>
            </div>
            <select 
              className="w-[180px] bg-[#6b44ae] h-10 pl-2 mr-3 pr-4 py-2 rounded-full border-input text-sm text-white"
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
            >
              <option value="" disabled>Select Community</option>
              {userCommunities.map((community) => (
                <option key={community._id} value={community._id}>
                  {community.name}
                </option>
              ))}
            </select>  
          </div>

          <div className="flex gap-10 mt-8">
            <div className="flex-1 p-12 rounded-[19px] bg-[#4a336e5c]">
              <h2 className="text-white text-3xl font-medium mb-10">
                {userCommunities.length > 0 ? "Joined Communities" : "No Communities Joined Yet"}
              </h2>
              <div className="flex flex-col gap-6">
                {userCommunities.length > 0 ? (
                  userCommunities.map((community) => (
                    <div
                      key={community._id}
                      className="flex flex-col justify-center p-4 rounded-[11px] border-2 border-[#301F4C] bg-[#1A0F2B] hover:border-[#512E8B] transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white text-2xl font-medium">
                            {community.name}
                          </h3>
                          <p className="text-[#CDCDCD] text-lg font-medium">
                            #{community.tag}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-[#301F4C] px-3 py-1 rounded-full">
                            <span className="text-white text-sm">
                              {community.users?.length || 0} Members
                            </span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCommunity(community._id);
                              setShowChallengeModal(true);
                            }}
                            className="px-3 py-1 bg-[#4CAF50] text-white rounded-full text-sm hover:bg-[#3e8e41]"
                          >
                            Add Challenge
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-sm text-gray-300">
                          Average Earnings: 
                          <span className="text-green-400 font-medium ml-1">
                            {calculateMockAvgEarnings(community).toFixed(2)} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-300 mb-4">You haven't joined any communities yet.</p>
                    <button 
                      onClick={() => setShowJoinModal(true)}
                      className="px-6 py-2 bg-[#6b44ae] text-white rounded-full hover:bg-[#7b54be]"
                    >
                      Join a Community
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[308px] p-5 rounded-[19px] h-fit bg-[#4a336e5c]">
              <div className="flex flex-col items-center gap-5">
                <h2 className="text-white text-xl font-medium">Leaderboard</h2>
                <img 
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ee0513993b0ba538478b5f1d93cdfa9972dd1ed" 
                  alt="Trophy" 
                  className="rounded-full w-[99px] h-[99px] bg-gradient-to-br from-purple-600 to-red-400" 
                />
                <div className="w-full p-5 rounded-[11px] border-2 border-[#301F4C] bg-[#1A0F2B]">
                  <div className="flex justify-between mb-3">
                    <span className="text-white text-sm font-medium">
                      Rank
                    </span>
                    <span className="text-[#ABABAB] text-sm font-medium">
                      Out of {allCommunities.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {communitiesRanking.slice(0, 5).map((community, index) => (
                      <div
                        key={community._id}
                        className="flex items-center gap-2.5 pb-3 border-b border-[#7E7E7E]"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ 
                            backgroundColor: 
                              index === 0 ? "#FFD700" : 
                              index === 1 ? "#C0C0C0" : 
                              index === 2 ? "#CD7F32" : "#2A9D90" 
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-white text-sm block">
                            {community.name}
                          </span>
                          <span className="text-green-400 text-xs">
                            {community.avgEarnings} ETH
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && <CreateCommunityModal />}
      {showJoinModal && <JoinCommunityModal />}
      {showChallengeModal && <ChallengeModal />}

      <div className="chatbot-bubble" onClick={handleToggleChatbot}>
        <img src={chatbot} alt="Chatbot" />
      </div>

      <DesktopChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        messages={chatMessages}
      />
    </div>
  );
};

export default Community;