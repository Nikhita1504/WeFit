import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import ConnectWallet from "../components/ConnectWallet";
import DesktopChatbot from "../components/DesktopChatbot";
import "../styles/history.css";
import "../styles/MobileHome.css"; // Added for header styles
import { FaHome, FaHistory, FaFilter, FaSort, FaTrophy, FaChartLine, FaChevronDown, FaChevronUp, FaTimes, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { Trophy, Bot, User, Flame, LogOut, History as HistoryIcon, FilterIcon, Filter } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import walletcontext from "../context/walletcontext";

const History = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { logout, JwtToken } = useAuth();
  const [historyData, setHistoryData] = useState({
    stats: {
      totalChallenges: 0,
      successRate: "0%",
      ethEarned: 0,
      ethLost: 0
    },
    historyEntries: []
  });
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { account, balance } = useContext(walletcontext);
  const [isConnected, setIsConnected] = useState(false);
  const [points, setPoints] = useState(0);
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! I'm your WeFit assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const fetchUserHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/history/user/${JwtToken}`
      );
      console.log("history", response.data);
      setHistoryData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching history data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
    // Check if wallet is connected
    if (account && account !== "Connect Wallet") {
      setIsConnected(true);
    }
  }, [account]);

  // Handle filtering and sorting
  const handleFilterChange = (type) => {
    setFilterType(type);
    setIsFilterMenuOpen(false);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsFilterMenuOpen(false);
  };

  // Filter and sort the history entries
  const getFilteredAndSortedEntries = () => {
    let filtered = [...historyData.historyEntries];
    
    // Apply filters
    if (filterType !== "all") {
      filtered = filtered.filter(entry => {
        if (filterType === "completed") return entry.isCompleted;
        if (filterType === "incomplete") return !entry.isCompleted;
        return true;
      });
    }
    
    // Apply sorting
    if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "highest-stake") {
      filtered.sort((a, b) => b.ethStaked - a.ethStaked);
    } else if (sortOrder === "lowest-stake") {
      filtered.sort((a, b) => a.ethStaked - b.ethStaked);
    } else {
      // Default: newest first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const handleNavigateToHome = () => {
    navigate("/");
  };

  const handleOpenLeaderboard = () => {
    navigate("/community");
  };
  
  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  
  const handleViewHistory = () => {
    navigate("/history");
    setIsProfileOpen(false);
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isChatbotOpen) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage = {
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botResponses = [
        "I can help you track your daily steps and rewards!",
        "Would you like to know more about the challenges?",
        "Remember, completing your daily step goal helps you earn more!",
        "You're doing great with your fitness goals!",
        "Your current activity is generating rewards based on your performance."
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const newBotMessage = {
        sender: "bot",
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 1000);
  };

  // Calculate progress for each challenge
  const calculateProgress = (exercises) => {
    if (!exercises || exercises.length === 0) return "0/0";
    const total = exercises.length;
    const completed = exercises.filter(ex => ex.isCompleted).length;
    return `${completed}/${total}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate progress percentage
  const calculateProgressPercentage = (exercises) => {
    if (!exercises || exercises.length === 0) return 0;
    return (exercises.filter(ex => ex.isCompleted).length / exercises.length) * 100;
  };

  return (
    <div className="mobile-home" style={{ backgroundColor: "#171926", margin: "0 auto", width: "100%", minHeight: "100vh", padding: "16px 16px 80px", overflow: "hidden", position: "relative", color: "#ffffff", fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
      {/* Header - Matching Challenge.jsx */}
      <header className="mobile-home__header">
        <div className="mobile-home__logo" onClick={handleNavigateToHome}>
          <div className="logo-circle">W</div>
          <div className="logo-text">We<span>Fit</span></div>
        </div>

        <div className="currency-indicators">
          <div className="currency-pill">
            <Flame size={20} color="#ff6b6b" />
            {points || 0}
          </div>
          {isConnected ? (
            <div className="currency-pill balance-pill" title={account}>
              ₹{Math.floor((balance || 0) * 156697).toLocaleString()}
            </div>
          ) : null}
          <div className="user-avatar" onClick={handleToggleProfile}>
            <User size={24} color="#171926" />
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <button onClick={handleViewHistory} className="profile-option">
                <HistoryIcon size={18} />
                <span>History</span>
              </button>
              <button onClick={handleLogout} className="profile-option">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="px-3 py-4">
        {/* Mobile Page Header */}
        <div className="bg-gradient-to-r from-[#372163] to-[#2A1A47] rounded-xl p-4 shadow-lg border border-purple-800/50 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-800/40 flex items-center justify-center">
                <FaHistory className="text-purple-400 text-sm" />
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-center text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Challenge History
              </h3>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="h-8 w-8 rounded-full bg-purple-800/40 flex items-center justify-center border border-purple-600/50"
              >
                <FaFilter className="text-purple-400 text-sm" />
              </button>
              
              {/* Floating Filter Menu */}
              {isFilterMenuOpen && (
                <div className="absolute right-0 top-10 bg-[#2D1B4F] border border-purple-600 rounded-lg shadow-lg p-3 w-64 z-50">
                  <div className="flex justify-between items-center mb-3 border-b border-purple-700 pb-2">
                    <span className="text-sm font-medium">Filters & Sorting</span>
                    <button 
                      onClick={() => setIsFilterMenuOpen(false)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label className="text-xs text-purple-300 mb-1 block">Status</label>
                    <div className="grid grid-cols-2 ">
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleFilterChange('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${filterType === 'completed' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleFilterChange('completed')}
                      >
                        Completed
                      </button>
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${filterType === 'incomplete' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleFilterChange('incomplete')}
                      >
                        Incomplete
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-purple-300 mb-1 block">Sort By</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${sortOrder === 'newest' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleSortChange('newest')}
                      >
                        Newest First
                      </button>
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${sortOrder === 'oldest' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleSortChange('oldest')}
                      >
                        Oldest First
                      </button>
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${sortOrder === 'highest-stake' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleSortChange('highest-stake')}
                      >
                        Highest Stake
                      </button>
                      <button 
                        className={`text-xs py-1 px-2 rounded-md ${sortOrder === 'lowest-stake' ? 'bg-purple-600 text-white' : 'bg-[#413359]/70 text-gray-300'}`}
                        onClick={() => handleSortChange('lowest-stake')}
                      >
                        Lowest Stake
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Collapsible */}
        <div className="bg-gradient-to-r from-[#372163] to-[#2A1A47] rounded-xl shadow-lg border border-purple-800/50 mb-4 overflow-hidden">
          <div 
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-purple-800/40 flex items-center justify-center">
                <FaChartLine className="text-purple-400 text-xs" />
              </div>
              <h2 className="text-sm font-semibold text-purple-200">Performance Stats</h2>
            </div>
            {isStatsExpanded ? (
              <FaChevronUp className="text-purple-400 text-xs" />
            ) : (
              <FaChevronDown className="text-purple-400 text-xs" />
            )}
          </div>
          
          {isStatsExpanded && (
            <div className="px-3 pb-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-[#3D2963] to-[#2D1B4F] p-3 rounded-lg border border-purple-700/70 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <FaTrophy className="text-yellow-400 text-xs" />
                    <h3 className="text-xs font-medium text-gray-200">Total Challenges</h3>
                  </div>
                  <p className="text-lg font-bold text-white">{historyData.stats.totalChallenges.toString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#3D2963] to-[#2D1B4F] p-3 rounded-lg border border-purple-700/70 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <FaChartLine className="text-blue-400 text-xs" />
                    <h3 className="text-xs font-medium text-gray-200">Success Rate</h3>
                  </div>
                  <p className="text-lg font-bold text-white">{historyData.stats.successRate}</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#3D2963] to-[#2D1B4F] p-3 rounded-lg border border-purple-700/70 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>
                    </svg>
                    <h3 className="text-xs font-medium text-gray-200">Earned</h3>
                  </div>
                  <p className="text-lg font-bold text-green-400">+{historyData.stats.ethEarned.toFixed(2)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#3D2963] to-[#2D1B4F] p-3 rounded-lg border border-purple-700/70 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>
                    </svg>
                    <h3 className="text-xs font-medium text-gray-200">Lost</h3>
                  </div>
                  <p className="text-lg font-bold text-red-400">-{historyData.stats.ethLost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Challenges */}
        <div className="bg-gradient-to-r from-[#372163] to-[#2A1A47] rounded-xl p-4 shadow-lg border border-purple-800/50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-purple-100">Your Challenges</h2>
            <div className="flex items-center gap-1 text-xs text-purple-300">
              <span className="text-xs">Showing:</span>
              <span className="font-medium text-white px-1.5 py-0.5 bg-purple-800/50 rounded-full">
                {getFilteredAndSortedEntries().length}
              </span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : getFilteredAndSortedEntries().length > 0 ? (
            <div className="space-y-3">
              {getFilteredAndSortedEntries().map((entry, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg overflow-hidden shadow-lg border ${entry.isCompleted ? 'border-green-700/50 bg-gradient-to-br from-[#1A272A] to-[#162023]' : 'border-red-700/50 bg-gradient-to-br from-[#2A1515] to-[#1F1010]'} transform transition-all hover:scale-[1.01]`}
                >
                  <div className={`p-3 flex flex-col`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-sm truncate max-w-[180px]">{entry.challengeId?.name || "Challenge"}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          <span className="text-xs text-gray-300">{formatDate(entry.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${entry.isCompleted ? 'bg-green-700/60 text-green-100' : 'bg-red-700/60 text-red-100'}`}>
                        {entry.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-between gap-y-1 mb-2 text-xs">
                      <div className="flex items-center gap-1 w-1/2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-gray-300">Category:</span>
                        <span className="font-medium text-white">{entry.challengeId?.category || "Fitness"}</span>
                      </div>
                      <div className="flex items-center gap-1 w-1/2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-gray-300">Duration:</span>
                        <span className="font-medium text-white">{entry.challengeId?.duration || "1"} days</span>
                      </div>
                      <div className="flex items-center gap-1 w-1/2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <span className="text-gray-300">Progress:</span>
                        <span className="font-medium text-white">{calculateProgress(entry.exercises)}</span>
                      </div>
                    </div>
                    
                    {/* Animated Progress bar */}
                    <div className="w-full bg-gray-700/60 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${entry.isCompleted ? 'bg-gradient-to-r from-green-500 to-green-300' : 'bg-gradient-to-r from-red-500 to-red-300'} relative`}
                        style={{ 
                          width: `${calculateProgressPercentage(entry.exercises)}%`,
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg mt-1 ${entry.isCompleted ? 'bg-green-900/20 border border-green-700/50' : 'bg-red-900/20 border border-red-700/50'}`}>
                      <span className="font-medium text-xs">{entry.isCompleted ? "Rewards:" : "Stake:"}</span>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-1 ${entry.isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>
                        </svg>
                        <span className={`text-sm font-bold ${entry.isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                          {entry.isCompleted ? `+${entry.rewardsEarned.toFixed(2)}` : `${entry.ethStaked.toFixed(2)}`} 
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#3D2963]/50 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-base font-medium mb-2">No challenges found</h3>
              <p className="text-xs text-gray-400 mb-3">Start a challenge to see your progress here!</p>
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs"
              >
                <span>Find Challenges</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated Leaderboard Button */}
      <div className="floating-actions">
        <button
          className="floating-button leaderboard-button"
          onClick={handleOpenLeaderboard}
        >
          <Trophy size={24} />
        </button>
      </div>

      {/* Fixed Chat Input Container - Matching Challenge.jsx */}
      <div className="chat-input-container" onClick={handleToggleChatbot}>
        <div className="chat-input-placeholder">
          <Bot size={20} />
          <span>Ask your WeFit assistant...</span>
        </div>
      </div>

      {/* Chatbot Component - Matching Challenge.jsx */}
      {isChatbotOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <span>Chat Assistant</span>
            <button onClick={() => setIsChatbotOpen(false)}>X</button>
          </div>
          <div className="chatbot-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}
              >
                {msg.text}
                <div className="message-timestamp">{msg.timestamp}</div>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;