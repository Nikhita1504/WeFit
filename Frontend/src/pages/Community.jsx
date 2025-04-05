import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import DesktopChatbot from "../components/DesktopChatbot";
import "../styles/DesktopHome.css";
import chatbot from "../assets/chatbot.png";
import { Avatar } from "../components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { FaHistory, FaCrown, FaUsers } from "react-icons/fa";
import axios from "axios";

const Community = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { logout, JwtToken } = useAuth();
  const [leaderCommunities, setLeaderCommunities] = useState([]);
  const [memberCommunities, setMemberCommunities] = useState([]);
  const [otherCommunities, setOtherCommunities] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [allCommunities, setAllCommunities] = useState([]);

  // Function to navigate to community challenge page
  const navigateToCommunity = (communityId) => {
    console.log(communityId);
    navigate(`/community/add-challenge`, { state: {communityId} });
  };

  // Fetch all communities from server
  const getAllCommunities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/community/new`
      );
      setAllCommunities(response.data);
    } catch (error) {
      console.log("Error fetching all communities:", error);
    }
  };

  // Fetch user communities and separate them into leader and member communities
  const getUserCommunities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/community/all/${JwtToken}`,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
          },
        }
      );
      
      // Get user ID from auth context or JWT token payload
      const userId = getUserIdFromToken(JwtToken);
      
      // Split communities based on role
      const leaderComms = [];
      const memberComms = [];
      
      response.data.forEach(community => {
        // Find the user's member record in the community
        const userMember = community.members.find(member => 
          member.userId.toString() === userId.toString() || 
          member.userId === userId
        );
        
        if (userMember && userMember.role === 'leader') {
          leaderComms.push(community);
        } else {
          memberComms.push(community);
        }
      });
      
      setLeaderCommunities(leaderComms);
      setMemberCommunities(memberComms);
    } catch (error) {
      console.log("Error fetching user communities:", error);
    }
  };
  
  // Helper function to extract user ID from JWT token
  const getUserIdFromToken = (token) => {
    // Simple implementation - in a real app, you'd decode the token properly
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload).userId;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(
        `http://localhost:3000/community/join/${JwtToken}`,
        { communityId }, // send it in the body
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
          },
        }
      );
  
      // Refresh community lists
      await getUserCommunities();
      updateOtherCommunities();
  
    } catch (error) {
      console.log("Error joining community:", error);
      alert(error.response?.data?.message || "Failed to join community");
    }
  };
  
  // Filter out communities that user is already part of
  const updateOtherCommunities = () => {
    const userCommunityIds = [...leaderCommunities, ...memberCommunities].map(c => c._id);
    const others = allCommunities.filter(comm => !userCommunityIds.includes(comm._id));
    setOtherCommunities(others);
  };

  // Load data on component mount
  useEffect(() => {
    if (JwtToken) {
      getAllCommunities();
      getUserCommunities();
    }
  }, [JwtToken]);

  // Update other communities whenever user or all communities change
  useEffect(() => {
    updateOtherCommunities();
  }, [allCommunities, leaderCommunities, memberCommunities]);

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

  const handleNavigateToHistory = () => {
    navigate("/history");
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  // Community Card Component
  const CommunityCard = ({ community, isLeader, showJoinButton = false }) => {
    return (
      <div
        className={`flex flex-col p-6 rounded-[15px] border-2 border-[#301F4C] bg-[#1A0F2B] hover:border-[#512E8B] transition-colors ${showJoinButton ? '' : 'cursor-pointer'}`}
        onClick={() => !showJoinButton && navigateToCommunity(community._id)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white text-2xl font-medium">
            {community.name}
          </h3>
          {isLeader && (
            <div className="flex items-center bg-[#6b44ae] px-2 py-1 rounded-full">
              <FaCrown className="text-yellow-300 mr-1" />
              <span className="text-white text-xs">Leader</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {community.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {community.tags && community.tags.map((tag, index) => (
            <span key={index} className="text-[#CDCDCD] text-sm bg-[#301F4C] px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="bg-[#301F4C] px-3 py-1 rounded-full flex items-center">
            <FaUsers className="text-white mr-1" />
            <span className="text-white text-sm">
              {community.members?.length || 0} Members
            </span>
          </div>
          
          {community.completionPercentage > 0 && (
            <div className="bg-[#301F4C] px-3 py-1 rounded-full">
              <span className="text-white text-sm">
                {community.completionPercentage}% Complete
              </span>
            </div>
          )}
          
          {showJoinButton ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleJoinCommunity(community._id);
              }}
              className="px-4 py-2 bg-[#6b44ae] text-white rounded-full hover:bg-[#7b54be]"
            >
              Join
            </button>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6b44ae]">
              <span className="text-white font-bold">→</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Community Section Component
  const CommunitySection = ({ title, communities, isLeader, showJoinButton = false }) => {
    return (
      <div className="p-8 rounded-[19px] bg-[#4a336e5c] mb-8">
        <h2 className="text-white text-3xl font-medium mb-6">
          {title} ({communities.length})
        </h2>
        
        {communities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard 
                key={community._id} 
                community={community} 
                isLeader={isLeader}
                showJoinButton={showJoinButton}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-300 mb-4">
              {isLeader ? "You haven't created any communities yet." : 
               showJoinButton ? "No communities available to join." : "You haven't joined any communities yet."}
            </p>
            {!showJoinButton && (
              <button 
                onClick={() => isLeader ? setShowCreateModal(true) : setShowJoinModal(true)}
                className="px-6 py-2 bg-[#6b44ae] text-white rounded-full hover:bg-[#7b54be]"
              >
                {isLeader ? "Create a Community" : "Join a Community"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Create Community Modal
  const CreateCommunityModal = () => {
    const [communityData, setCommunityData] = useState({
      name: "",
      description: "",
      tags: [],
      isPrivate: false,
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
        navigate('/community/add-challenge');
        getUserCommunities();
        
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
              disabled={!communityData.name || !communityData.description}
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
      const userCommunityIds = [...leaderCommunities, ...memberCommunities].map(c => c._id);
      const available = allCommunities.filter(
        c => !userCommunityIds.includes(c._id)
      );
      setAvailableCommunities(available);
    }, [allCommunities, leaderCommunities, memberCommunities]);
    
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
                    {community.tags && community.tags.length > 0 && (
                      <p className="text-gray-300 text-sm">#{community.tags[0]}</p>
                    )}
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
            </div>
            <div className="text-white font-medium text-lg">
              Communities ({leaderCommunities.length + memberCommunities.length})
            </div>
          </div>

          <div className="mt-8">
            {/* Your Communities (Leader) Section */}
            <CommunitySection 
              title="Your Communities" 
              communities={leaderCommunities} 
              isLeader={true} 
            />
            
            {/* Joined Communities (Member) Section */}
            <CommunitySection 
              title="Joined Communities" 
              communities={memberCommunities} 
              isLeader={false} 
            />
            
            {/* Other Communities (Available to Join) Section */}
            <CommunitySection 
              title="Discover Communities" 
              communities={otherCommunities} 
              isLeader={false}
              showJoinButton={true}
            />
          </div>
        </div>
      </div>

      {showCreateModal && <CreateCommunityModal />}
      {showJoinModal && <JoinCommunityModal />}

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