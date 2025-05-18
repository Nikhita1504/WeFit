import React, { useState, useContext, useEffect } from "react";
import { Plus, Bot, Trophy, User, MapPin, Flame, LogOut, History, Footprints } from "lucide-react";
import "../styles/MobileHome.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Contractcontext from "../context/contractcontext";
import { connectMetaMask } from "../Utils/ConnectWallet";
import walletcontext from "../context/walletcontext";
import { connectContract } from "../Utils/ConnectContract";
import ActiveChallengeCard from "../components/ActiveChallengeCard";
import useFitnessData from "../Utils/useStepCount";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import HealthOverview from "../components/HealthOverview";


const MobileHome = () => {
  const { logout, JwtToken } = useAuth();
  const navigate = useNavigate();
  const { contract, Setcontract } = useContext(Contractcontext);
  const { account, Setaccount, balance, Setbalance } = useContext(walletcontext);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("stats");
  const [userData, setUserData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const{todaySteps,todayCalories}=useFitnessData();
  // Chatbot functionality
  // console.log(todaySteps)
  // console.log(todayCalories)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! I'm your WeFit assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const truncateAddress = (address) => {
    if (!address || address === "Connect Wallet") return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 6
    )}`;
  };

  const handleConnectWallet = async () => {
    try {
      const { account, Balance } = await connectMetaMask();
      Setaccount(account);
      Setbalance(Balance);
      setIsConnected(true);

      const contractInstance = await connectContract();
      Setcontract(contractInstance);

      // Update wallet address in backend
      if (JwtToken) {
        const payload = jwtDecode(JwtToken);
        await axios.put(
          `http://localhost:3000/api/users/updateWallet/${payload.email}`,
          { walletAddress: account },
          { headers: { Authorization: `Bearer ${JwtToken}` } }
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const getUserData = async () => {
    try {
      const payload = jwtDecode(JwtToken);
      const response = await axios.get(`http://localhost:3000/api/users/get/${payload.email}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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

  const handleShowRecommendations = () => {
    navigate("/challenge");
  };

  const handleOpenLeaderboard = () => {
    navigate("/community");
  };

  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleViewHistory = () => {
    navigate("/history");
    setIsProfileOpen(false);
  };

  const handleDecreasePoints = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        toast.error("Please log in to update points");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/users/resetPoints/${token}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error("Error resetting points:", error);
      toast.error(error.response?.data?.message || "Error resetting points");
    }
  };

  const handleClaimReward = async () => {
    try {
      setIsClaiming(true);

      if (!userData || userData.points === undefined || userData.points === null) {
        alert("User points not available. Please refresh the page.");
        return;
      }

      if (!contract) {
        alert("Contract not connected.");
        return;
      }

      const points = Number(userData.points);
      const ethAmount = points * 0.1;
      const ethReward = ethAmount / 157669;

      if (isNaN(ethReward)) {
        alert("Invalid reward calculation. Cannot claim rewards.");
        return;
      }

      const ethValue = parseFloat(ethReward).toFixed(18);
      const weiAmount = ethers.parseEther(ethValue);

      const tx = await contract.claimReward({ value: weiAmount });
      await tx.wait();

      toast.success("Rewards claimed successfully!");
      handleDecreasePoints();

    } catch (error) {
      console.error("Error claiming reward:", error);
      alert(`Failed to claim rewards: ${error.message}`);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="mobile-home">
      <header className="mobile-home__header">
        <div className="mobile-home__logo">
          <div className="logo-circle">W</div>
          <div className="logo-text">We<span>Fit</span></div>
        </div>

        <div className="currency-indicators">
          <div className="currency-pill">
            <Flame size={20} color="#ff6b6b" />
            {userData?.points || 0}
          </div>
          {isConnected ? (
            <div className="currency-pill balance-pill" title={account}>
              ₹{Math.floor(balance * 156697).toLocaleString()}
            </div>
          ) : null}
          <div className="user-avatar" onClick={handleToggleProfile}>
            <User size={24} color="#171926" />
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <button onClick={handleViewHistory} className="profile-option">
                <History size={18} />
                <span>History</span>
              </button>
              <button onClick={handleLogout} className="profile-option">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <button
                onClick={handleClaimReward}
                className="profile-option claim-button"
                disabled={isClaiming}
              >
                {isClaiming ? "Claiming..." : "Claim Reward"}
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        <section className="welcome-section">
          <h1>Welcome</h1>
          <p>Sweat, hustle, and earn</p>
        </section>

        <div className="action-buttons">
          {!isConnected ? (
            <button className="action-button connect-button" onClick={handleConnectWallet}>
              Connect Wallet
            </button>
          ) : (
            <button className="action-button recommend-button" onClick={handleShowRecommendations}>
              Show Recommendations
            </button>
          )}
        </div>

        <div className="section-toggle">
          <button
            className={`toggle-button ${activeSection === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveSection('stats')}
          >
            Stats
          </button>
          <button
            className={`toggle-button ${activeSection === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveSection('challenges')}
          >
            Active Challenge
          </button>
        </div>

        {activeSection === 'stats' && (
          <section className="stats-section">
            <div className="progress-card">


              <HealthOverview className="h-full" /> 


            </div>

            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon steps-icon">
                <Footprints size={24} color="#171926" />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Steps</div>
                  <div className="stat-value"><AnimatedNumber value={todaySteps}/></div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon calories-icon">
                  <Flame size={24} color="#171926" />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Calories</div>
                  <div className="stat-value"><AnimatedNumber value={todayCalories}/></div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon distance-icon">
                  <MapPin size={24} color="#171926" />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Distance (km)</div>
                  <div className="stat-value">3</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'challenges' && (
          <section className="challenge-section">
            <ActiveChallengeCard getUserData={getUserData} />
          </section>
        )}
      </main>

      <div className="floating-actions">
        <button
          className="floating-button leaderboard-button"
          onClick={handleOpenLeaderboard}
        >
          <Trophy size={24} />
        </button>
      </div>

      <div className="chat-input-container" onClick={handleToggleChatbot}>
        <div className="chat-input-placeholder">
          <Bot size={20} />
          <span>Ask your WeFit assistant...</span>
        </div>
      </div>

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

export default MobileHome;