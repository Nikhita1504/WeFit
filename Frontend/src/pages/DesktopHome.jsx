
import { useLocation, useNavigate } from "react-router-dom";


import React, { useEffect, useRef, useState } from "react";

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
import ActiveChallengeCard
  from "../components/ActiveChallengeCard";





import { FaHistory } from "react-icons/fa";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useFitnessData from "../Utils/useStepCount";
import HealthOverview from "../components/HealthOverview";
import Leaderboard from "../components/LeaderBoard";
import { ethers } from "ethers";

const DesktopHome = () => {
  const navigate = useNavigate();
  const [isClaiming, setIsClaiming] = useState(false);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { logout, JwtToken } = useAuth();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { todaySteps } = useFitnessData();
  useEffect(() => {
    console.log(todaySteps);
  })

  const [userData, setuserData] = useState();


  const getUserData = async () => {
    try {
      const payload = jwtDecode(JwtToken);
      // console.log("Decoded JWT:", payload);
      const response = await axios.get(`http://localhost:3000/api/users/get/${payload.email}`)
      // console.log(response.data);
      setuserData(response.data);
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    if (JwtToken) {
      getUserData();
    }
  }, [JwtToken]);

  // useEffect(() => {
  //   console.log('Step Data:', { todaySteps, 
  //     weeklySteps, 
  //     todayCalories, 
  //     weeklyCalories, });
  // }, [todaySteps, 
  //   weeklySteps, 
  //   todayCalories, 
  //   weeklyCalories,]);
  const handleNavigateToCommunity = () => {
    navigate("/community");
  };

  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  const handleCameraClick = async () => {
    try {
      if (!isCameraOn) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" } // Front camera
        });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        // Turn off camera
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      }
      setIsCameraOn(!isCameraOn);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please enable permissions.");
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

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
    navigate("/login")
  };
  const handleNavigateToHistory = () => {
    navigate("/history");
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleAddRewardsEarned = async (ethReward) => {
    try {
      const token = localStorage.getItem("JwtToken");

      if (!token) {
        console.error("No JWT token found in localStorage");
        return;
      }

      // Make a PUT request to update challengeWon field
      await axios.put(
        `http://localhost:3000/api/users/updateRewardsEarned/${token}`, {
          rewardAmount:ethReward
        }, // Assuming this is the route to increment challengeWon

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.log(error);

    }
  }
  
  


  const handleClaimReward = async () => {
    // handleDeleteChallenge();
    try {
      const ethAmount = userData?.points*1/10;
      const weiAmount = ethers.parseEther(parseFloat(ethAmount/157669).toFixed(18));
      const ethReward=ethAmount/157669
      setIsClaiming(true);

      if (!contract) {
        alert("Contract not connected.");
        return;
      }

      // Get the contract balance
      // const contractBalance = await contract.getContractBalance();
      // const formattedContractBalance = ethers.formatEther(contractBalance);

      // Get the user's reward amount safely
      // const userGoal = await contract.getUserGoal(account);
      // if (!userGoal || userGoal.length < 2) {
      //   alert("Failed to fetch user goal.");
      //   return;
      // }

      // const [stake, reward] = userGoal;

      // const formattedReward = ethers.formatEther(reward);

      // Check if the contract has enough balance to pay the reward
      // if (parseFloat(formattedContractBalance) < parseFloat(formattedReward)) {
      //   alert("Insufficient contract balance to claim rewards.");
      //   return;
      // }

      // Proceed with claiming reward
      const tx = await contract.claimReward();
      await tx.wait(); // Wait for transaction confirmation



      toast.success("Rewards claimed successfully!");


      handleAddRewardsEarned(ethReward);

      handleAddtohistory();



      // Optionally refresh the challenge data
      // fetchActiveChallenge();

    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Failed to claim rewards");
    } finally {
      setIsClaiming(false);
    }
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
            <div className="desktop-home__logo-text">Stake2Fit</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="overflow-hidden">
              <ConnectWallet />
            </div>
            <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="connect-wallet px-4 py-2 bg-[#512E8B] text-white rounded-full hover:bg-[#3a1d66] transition-colors max-w-[180px] truncate font-mono">
          🔥 {userData?.points}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-[#1A0F2B] border border-[#301F4C] rounded-lg shadow-lg z-50">
        <DropdownMenuItem className="cursor-pointer flex flex-col gap-2 p-2">
          {/* Points Display */}
          <div className="flex items-center justify-between w-full px-2 py-1 rounded bg-[#2B1748]">
            <span className="font-medium text-sm">Your Points:</span>
            <span className="font-mono text-sm text-purple-300">🔥 0</span>
          </div>

          {/* Claim Reward Button */}
          <button
            className="w-full px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors"
            onClick={handleClaimReward}
          >
            Claim Reward
          </button>

          {/* Leaderboard Link */}
          <button className="w-full px-3 py-1.5 text-sm text-center text-purple-300 hover:text-white hover:bg-[#3a1d66] rounded-full transition-colors">
            View Leaderboard
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  



            <button onClick={handleNavigateToHistory} className="rounded-full">
              <Avatar className="h-[63px]  p-3.5 w-[63px] border-4 border-[#512E8B] rounded-full bg-[#413359] cursor-pointer hover:opacity-80 transition-opacity">
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
                  {/* <Leaderboard onClick={handleNavigateToCommunity} /> */}

                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="desktop-home__content">
          <div className="desktop-home__left-section">
            <div className="desktop-home__welcome">
              <div className="desktop-home__title">Welcome To Stake2Fit</div>
              <div className="desktop-home__subtitle">
                Sweat, hustle, and earn
              </div>
              <button
                className="herobutton"
                onClick={() => navigate("/challenge")}
              >
                Take on next challenge
              </button>{" "}
            </div>
            <div className="flex flex-col flex-1"> {/* Added flex-1 */}
              {/* Added h-full */}
              <HealthOverview className="h-full" /> {/* Pass height prop if needed */}

            </div>
          </div>

          <ActiveChallengeCard getUserData={getUserData}></ActiveChallengeCard>
        </div>
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

export default DesktopHome;