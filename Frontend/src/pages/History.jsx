
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import DesktopChatbot from "../components/DesktopChatbot";
import "../styles/history.css";
import StatisticCard from "../components/StatisticCard";
import ChallengeCard from "../components/HistoryChallengeCard";
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


const History = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { logout, JwtToken } = useAuth();
  const [userData, setuserData] = useState();
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

  
  
  const fetchUserHistory = async () => {
    try {
      console.log(JwtToken);
      
      const response = await axios.get(
        `http://localhost:3000/history/user/${JwtToken}`
      );
      setHistoryData(response.data);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    fetchUserHistory()
  }, []);

  // Handle filtering and sorting
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
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
    }
    // Default is "newest" which is already sorted from the API
    
    return filtered;
  };

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
    return date.toISOString().split('T')[0];
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-[63px] w-[63px] cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-col gap-10 mx-auto w-full ">
          <header className="flex justify-between items-center w-full max-md:flex-col max-md:gap-5">
            <h1 className="text-3xl font-medium text-white">
              Challenge History
            </h1>
            <div className="flex gap-6 items-center">
              <select 
                className="w-[180px] bg-[#413359] h-10 pl-2 pr-2 py-2 rounded-md border-input text-sm text-white"
                value={filterType}
                onChange={handleFilterChange}
              >
                <option value="all">All Challenges</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>              
              <select 
                className="w-[180px] bg-[#413359] h-10 pl-2 pr-2 py-2 rounded-md border-input text-sm text-white"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest-stake">Highest Stake</option>
                <option value="lowest-stake">Lowest Stake</option>
              </select>
            </div>
          </header>

          <section className="flex flex-col gap-11">
            <div className="flex gap-8 items-center w-full max-md:flex-wrap max-md:justify-center max-sm:flex-col">
              <StatisticCard
                title="Total Challenges"
                value={historyData.stats.totalChallenges.toString()}
                textColor="text-white"
              />
              <StatisticCard
                title="Success Rate"
                value={historyData.stats.successRate}
                textColor="text-white"
              />
              <StatisticCard
                title="ETH Earned"
                value={`+ ${historyData.stats.ethEarned.toFixed(2)} ETH`}
                textColor="text-green-500"
              />
              <StatisticCard
                title="ETH Lost"
                value={`- ${historyData.stats.ethLost.toFixed(2)} ETH`}
                textColor="text-red-600"
              />
            </div>

            <section className="flex flex-wrap gap-9 justify-center">
              {getFilteredAndSortedEntries().length > 0 ? (
                getFilteredAndSortedEntries().map((entry, index) => (
                  <ChallengeCard
                    key={index}
                    title={entry.challengeId?.title || "Challenge"}
                    date={formatDate(entry.createdAt)}
                    amount={entry.isCompleted 
                      ? `+ ${entry.rewardsEarned.toFixed(2)} ETH` 
                      : `- ${entry.ethStaked.toFixed(2)} ETH`}
                    status={entry.isCompleted ? "Completed" : "Incomplete"}
                    progress={calculateProgress(entry.exercises)}
                    isSuccess={entry.isCompleted}
                  />
                ))
              ) : (
                <div className="text-white text-center w-full py-8">
                  No challenge history found. Start a challenge to see your progress!
                </div>
              )}
            </section>
          </section>
        </main>
      </div>

      {/* Floating Chatbot Bubble */}
      <div className="chatbot-bubble" onClick={handleToggleChatbot}>
        <img src={chatbot} alt="Chatbot" />
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

export default History;