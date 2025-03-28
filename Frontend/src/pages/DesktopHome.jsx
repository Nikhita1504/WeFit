import React, { useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import DesktopChatbot from "../components/DesktopChatbot";
import "../styles/DesktopHome.css";
import image from "../assets/image.png";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const DesktopHome = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const chatMessages = [
    {
      sender: "bot",
      text: "Hi there! I'm your StakeFit assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="desktop-home">
      <div className="desktop-home__container">
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
            <ConnectWallet />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-[63px] w-[63px] cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="desktop-home__content">
          <div className="desktop-home__left-section">
            <div className="desktop-home__welcome">
              <div className="desktop-home__title">Welcome To StakeFit</div>
              <div className="desktop-home__subtitle">
                Sweat, hustle, and earn
              </div>
            </div>

            <div className="desktop-home__stake-form">
              <div className="desktop-home__stake-label">Stake ETH</div>
              <div className="desktop-home__input-container">
                <input
                  type="text"
                  placeholder="Value"
                  className="desktop-home__input"
                />
              </div>
              <button className="desktop-home__stake-button">
                Collect Wallet
              </button>
            </div>
          </div>

          <div className="desktop-home__right-section">
            <img
              src={image}
              alt="Dashboard illustration"
              className="desktop-home__hero-image"
            />
          </div>
        </div>

        <div className="desktop-home__stats">
          <div className="desktop-home__stats-card">
            <div className="desktop-home__stats-icon-container">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/67f672afe80cde17968bfb27e247f0f43d22657f?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                alt="Steps icon"
                className="desktop-home__stats-icon"
              />
            </div>
            <div className="desktop-home__stats-content">
              <div className="desktop-home__stats-label">Steps</div>
              <div className="desktop-home__stats-value-container">
                <div className="desktop-home__stats-value">1980</div>
                <div className="desktop-home__stats-suffix">/3k</div>
              </div>
              <div className="desktop-home__progress-bar">
                <div className="desktop-home__progress-fill"></div>
              </div>
            </div>
          </div>

          <div className="desktop-home__stats-card">
            <div className="desktop-home__stats-icon-container">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd2685e51dde4835462a564a0304a75fb03bb686?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                alt="Time icon"
                className="desktop-home__stats-icon"
              />
            </div>
            <div className="desktop-home__stats-content">
              <div className="desktop-home__stats-label">Time</div>
              <div className="desktop-home__stats-value-container">
                <div className="desktop-home__stats-value">7</div>
                <div className="desktop-home__stats-suffix">hr</div>
              </div>
            </div>
          </div>

          <div className="desktop-home__stats-card">
            <div className="desktop-home__stats-icon-container">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3aba6ae72bc3a8a05ac48bd5020179403ebfe4bc?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                alt="Calories icon"
                className="desktop-home__stats-icon"
              />
            </div>
            <div className="desktop-home__stats-content">
              <div className="desktop-home__stats-label">Calories</div>
              <div className="desktop-home__stats-value">1200</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Bubble */}
      <div className="chatbot-bubble" onClick={handleToggleChatbot}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0cafdee42b20fc91416cd612ede1a22e067e02da?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71" 
          alt="Chatbot" 
        />
      </div>

      {/* Chatbot Component */}
      <DesktopChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)}
        messages={chatMessages}
      />
    </div>
  );
};

export default DesktopHome;
