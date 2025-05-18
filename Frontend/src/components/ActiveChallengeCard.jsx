import React, { useState, useEffect, useContext } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import ProgressCircle from "./ui/ProgressCircle";
import TimerActiveChallenge from "./ui/TimerActiveChallenge";
import useFitnessData from "../Utils/useStepCount";
import getBalance from "../Utils/getbalance";
import Contractcontext from "../context/contractcontext";
import walletcontext from "../context/walletcontext";
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom";
import { FiCamera, FiDollarSign, FiGift, FiLoader } from 'react-icons/fi';
import { useAuth } from "../context/AuthContext";
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { Gift, Timer } from "lucide-react";

const ActiveChallengeCard = ({ getUserData }) => {
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const { contract } = useContext(Contractcontext);
  const { Setbalance } = useContext(walletcontext);
  const { account } = useContext(walletcontext);
  const navigate = useNavigate();
  const { JwtToken } = useAuth();
  const [showCompletionLoader, setShowCompletionLoader] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowWidth, windowHeight] = useWindowSize();

  // Fetch active challenge from API
  const fetchActiveChallenge = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(
        `http://localhost:3000/ActiveChallenge/get/${token}`
      );

      if (response.data) {
        setChallengeData(response.data);
      } else {
        throw new Error("No active challenge found");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setChallengeData(null);
        setError(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveChallenge();
  }, []);

  // Define filteredExercises before using it in the JSX
  const filteredExercises = challengeData?.exercises?.filter(
    (exercise) => exercise.name !== "s"
  ) || [];

  const totalExercises = filteredExercises.length;
  const completedExercises = filteredExercises.filter(
    (ex) => ex.isCompleted
  ).length;
  const completionPercentage =
    totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const allExercisesCompleted = completedExercises === totalExercises && totalExercises > 0;

  // Show celebration when all exercises are completed
  useEffect(() => {
    if (allExercisesCompleted && !showCelebration) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 8000); // Hide confetti after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [allExercisesCompleted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm p-4">Error: {error}</div>;
  }

  if (!challengeData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-[#1A0F2B] border border-[#301F4C] rounded-xl h-40">
        <div className="text-white text-base text-center">
          No active challenge added currently
        </div>
      </div>
    );
  }

  const handlecompletechallenge = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage");
        alert("You need to be logged in to delete the challenge.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/ActiveChallenge/update/challenge/${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Challenge completed successfully:", response.data);
      toast.success("Active challenge completed successfully!");
    } catch (error) {
      console.error("Error completing challenge:", error);
      alert("An error occurred while completing the active challenge.");
    }
  };

  const handleAddtohistory = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage");
        alert("You need to be logged in to delete the challenge.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/history/create/${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("history created successfully:", response.data);
      toast.success("history created successfully!");
    } catch (error) {
      console.error("Error history created challenge:", error);
      alert("An error occurred while history created.");
    }
  }

  const handleIncreaseChallengeWon = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/users/updateChallengeWon/${token}`, {},
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

  const handleAddRewardsEarned = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/users/updateRewardsEarned/${token}`, {
        rewardAmount: challengeData.rewardsEarned
      },
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
    try {
      setIsClaiming(true);
      if (!contract) {
        alert("Contract not connected.");
        return;
      }

      const contractBalance = await contract.getContractBalance();
      const formattedContractBalance = ethers.formatEther(contractBalance);

      const userGoal = await contract.getUserGoal(account);
      if (!userGoal || userGoal.length < 2) {
        alert("Failed to fetch user goal.");
        return;
      }

      const [stake, reward] = userGoal;
      const formattedReward = ethers.formatEther(reward);

      if (parseFloat(formattedContractBalance) < parseFloat(formattedReward)) {
        alert("Insufficient contract balance to claim rewards.");
        return;
      }

      const tx = await contract.claimReward();
      await tx.wait();

      const balance = await getBalance(account);
      console.log(balance * 156697);
      Setbalance(balance);

      toast.success("Rewards claimed successfully!");
      handlecompletechallenge();
      handleIncreaseChallengeWon();
      handleAddRewardsEarned();
      handleAddtohistory();
      handleDeleteChallenge();
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Failed to claim rewards");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleIncreasePoints = async () => {
    try {
      setShowCompletionLoader(true);
      console.log("Attempting to increase points");
      const JwtToken = localStorage.getItem("JwtToken");

      if (!JwtToken) {
        console.error("No JWT token found in localStorage");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/users/updatePoints/${JwtToken}`,
        { points: 50 },
        {
          headers: {
            'Authorization': `Bearer ${JwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await new Promise(resolve => setTimeout(resolve, 3000));
      getUserData();
      handleAddtohistory();
      handleDeleteChallenge();
      console.log("Points updated successfully:", response.data);
    } catch (error) {
      console.error("Error increasing points:", error.response?.data || error.message);
      throw error;
    } finally {
      setShowCompletionLoader(false);
    }
  };

  const handleDeleteChallenge = async () => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage");
        alert("You need to be logged in to delete the challenge.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/ActiveChallenge/delete/${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Challenge deleted successfully:", response.data);
      localStorage.removeItem("challengeInitialSteps");
      fetchActiveChallenge();
      toast.success("Active challenge deleted successfully!");
    } catch (error) {
      console.error("Error deleting challenge:", error);
      alert("An error occurred while deleting the active challenge.");
    }
  };

  const handleCompleteExercise = async (exerciseId) => {
    try {
      const token = localStorage.getItem("JwtToken");
      if (!token) {
        console.error("No JWT token found in localStorage");
        return;
      }

      const requestBody = {
        exerciseId: exerciseId,
      };

      const response = await axios.put(
        `http://localhost:3000/ActiveChallenge/update/${token}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Exercise marked as completed:", response.data);
      fetchActiveChallenge();
      toast.success("Exercise completed successfully!");
    } catch (error) {
      console.error("Error completing exercise:", error);
      alert("An error occurred while marking the exercise as completed.");
    }
  };

  const handleCaptureClick = (exerciseId, reps, exerciseName) => {
    navigate("/capture", { state: { exerciseId, reps, exerciseName } });
  };

  if (showCompletionLoader) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mb-8"></div>
        <h2 className="text-3xl font-bold text-white mb-2">Challenge Completed!</h2>
        <p className="text-xl text-purple-300">You earned 50 points</p>
        <p className="text-sm text-gray-400 mt-4">Updating your profile...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Confetti
            width={windowWidth}
            height={windowHeight}
            recycle={false}
            numberOfPieces={300}
            gravity={0.15}
          />
          {allExercisesCompleted && (
            <div className="bg-purple-900/90 p-4 rounded-lg max-w-xs text-center animate-bounce">
              <h3 className="text-xl font-bold text-white mb-1">🎉 Congrats!</h3>
              <p className="text-white text-sm mb-1">You earned 50 points!</p>
              <p className="text-yellow-300 text-xs font-medium">
                You earned {challengeData.rewardsEarned} ETH (≈ ₹100)
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col bg-[#1A0F2B] border border-[#301F4C] rounded-xl w-full max-w-md mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#2B1748] to-[#3A225D] rounded-t-xl border-b border-[#4A2D7A]">
          <div className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
            Active Challenge
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center px-2 py-1 bg-yellow-800/80 border border-orange-500 rounded-full text-xs">
              {challengeData.exercises[0]?.completedReps || 2}
            </div>
            <div className="px-2 py-1 bg-blue-900/80 border border-violet-700 rounded-full text-xs">
              Today
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-3 overflow-y-auto">
          {/* Exercises list */}
          {/* <div className="mb-4">
            {filteredExercises.map((exercise) => (
              <div key={exercise._id} className="mb-2 p-2 bg-[#2B1748]/50 rounded-lg border border-[#3A225D]">
                <div className="flex gap-2 items-center">
                  {exercise.reps === exercise.completedReps ? (
                    <IoCheckmarkCircle className="text-green-400 text-base" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-purple-400"></div>
                  )}
                  <span className="text-sm font-medium">
                    {exercise.name} <span className="text-purple-300 text-xs">({exercise.reps})</span>
                  </span>
                </div>
              </div>
            ))}
          </div> */}

          {/* Progress section */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-medium text-purple-300">Today's Exercises</div>

            {filteredExercises.map((exercise) => (
              <div key={exercise._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {exercise.reps === exercise.completedReps ? (
                    <IoCheckmarkCircle className="text-green-400 text-sm" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-purple-400"></div>
                  )}
                  <span className="text-xs font-medium">
                    {exercise.name} ({exercise.reps})
                  </span>
                </div>

                <div className="flex gap-1">
                  {exercise.isVideoRequired && (
                    <button
                      onClick={() => handleCaptureClick(exercise._id, exercise.reps, exercise.name)}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-900 rounded-full text-2xs"
                    >
                      <FiCamera className="text-xs" />
                      <span className="hidden sm:inline">Capture</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCompleteExercise(exercise._id)}
                    className="px-2 py-1 bg-blue-900 rounded-full text-2xs"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}

            <div className="p-2 bg-[#2B1748] rounded-lg border border-[#3A225D]">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-purple-300">Progress</span>
                <span>{completionPercentage.toFixed(2)}% complete</span>
              </div>
              <div className="w-full h-1.5 bg-[#3A225D] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${completionPercentage.toFixed(2)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="flex-1 ">
              <TimerActiveChallenge
                handleDeleteChallenge={handleDeleteChallenge}
                fetchedData={challengeData}
              />
            </div>



            <div className="flex justify-center w-full">
              <div className="flex gap-3 items-center py-2 px-4 bg-purple-900 min-h-[60px] rounded-full w-full max-w-[400px]">
                <div className="bg-[#3A225D] p-1 text-center rounded-full  flex gap-3 items-center flex-1">
                  <Gift className="w-8 h-8 mr-2" />
                  <div className="text-sm text-gray-300">Rewards</div>

                </div>
                <div className="flex gap-3 items-center flex-1">
                  <div className="flex items-baseline gap-1">
                    <div className="text-md font-medium ">
                      {challengeData.rewardsEarned} Points
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 w-full mx-auto rounded-lg ${allExercisesCompleted ? "bg-gradient-to-r from-[#8A2BE2] to-[#FF1493]" : "bg-gray-700"}`}>
              <button
                onClick={handleIncreasePoints}
                disabled={!allExercisesCompleted || isClaiming}
                className={`
      flex items-center justify-center 
      w-full py-3 px-4 
      text-sm font-medium rounded-lg 
      gap-1 transition-all duration-300
      ${allExercisesCompleted
                    ? "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }
    `}
              >
                {isClaiming ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="animate-spin" />
                    Claiming...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiGift />
                    Complete Challenge
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Claim button */}

        </div>
      </div>
    </>
  );
};

export default ActiveChallengeCard;