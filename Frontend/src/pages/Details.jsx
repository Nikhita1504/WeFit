import React, { useContext, useState, useEffect } from "react";
import "../styles/MobileHome.css";
import DetailsSection from "../components/DetailsSection";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Bot, User, Flame, LogOut, History } from "lucide-react";
import walletcontext from "../context/walletcontext";

const Details = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { account, balance } = useContext(walletcontext);
  const [isConnected, setIsConnected] = useState(false);
  const [points, setPoints] = useState(null);
  
  const location = useLocation();
  const challenge = location.state?.challenge;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! I'm your WeFit assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
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
  
  const handleGoBack = () => {
    navigate("/challenge");
  };
  
  useEffect(() => {
    // Check if wallet is connected
    if (account && account !== "Connect Wallet") {
      setIsConnected(true);
    }
  }, [account]);

  return (
    <div className="desktop-home" style={{ backgroundColor: "#171926", margin: "0 auto", width: "100%", minHeight: "100vh", padding: "16px 16px 80px", overflow: "hidden", position: "relative", color: "#ffffff", fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
      {/* Mobile-style header with exact MobileHome CSS */}
      <header className="mobile-home__header">
        <div className="mobile-home__logo">
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
                <History size={18} />
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

      <div className="desktop-home__container" style={{padding: 0, marginTop: "30px"}}>
        {/* Back button */}
        <button 
          onClick={handleGoBack}
          className="back-button mb-4 flex items-center text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg px-4 py-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2">Back to Challenges</span>
        </button>
        
        {/* Detail Section Component */}
        <DetailsSection challenge={challenge} />
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

      {/* Fixed Chatbot Button */}
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

export default Details;