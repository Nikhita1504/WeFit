
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

import useStepCount from "../utils/useStepCount";
import useFitnessData from "../utils/useStepCount";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { FaHistory } from "react-icons/fa";
import ProgressCircle from "../components/ui/ProgressCircle";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DesktopHome = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { logout, JwtToken } = useAuth();
 
  const { todaySteps,
    weeklySteps,
    todayCalories,
    weeklyCalories, isLoading, error } = useFitnessData();
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
            <div className="overflow-hidden">
              <ConnectWallet />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-[63px]  p-3.5 w-[63px] border-4 border-[#512E8B] rounded-full bg-[#413359] cursor-pointer hover:opacity-80 transition-opacity">
                  <FaHistory color="white" size={30} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">

                <DropdownMenuItem
                  className="cursor-pointer"

                >

                  previous score
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

        <div className="desktop-home__content">
          <div className="desktop-home__left-section">
            <div className="desktop-home__welcome">
              <div className="desktop-home__title">Welcome To StakeFit</div>
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
            <div className="gap-5 flex flex-col">
              <div className="desktop-home__stats-card">
                <div className="flex-1 w-full max-md:max-w-full">
                  <h2 className="desktop-section-text ">How it works?</h2>
                  <ul className="mt-2.5 text-base leading-9 text-zinc-400 max-md:max-w-full list-none">
                    <li>Connect your wallet and stake ETH</li>
                    <li>Complete your daily step goal</li>
                    <li>Earn rewards for staying active</li>
                  </ul>
                </div>
                <div className="desktop-home__stats-content"></div>
              </div>
              <div className="desktop-home__stats-card">
                <div className="flex-1 w-full max-md:max-w-full">
                  <h2 className="desktop-section-text ">Fitness Tips</h2>
                  <ul className="mt-2.5 text-base leading-9 text-zinc-400 max-md:max-w-full list-none">
                    <li>
                      Start with 3,000-5,000 steps if you're new to walking
                    </li>
                    <li>Take the stairs instead of elevators.</li>
                    <li>
                      Stay hydrated and stretch post-walk to prevent stiffness.
                    </li>
                  </ul>
                </div>
                <div className="desktop-home__stats-content"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col grow shrink self-stretch  bg-[#1A0F2B] border-4 border-solid border-[#301F4C]  rounded-[23px] h-[700px] min-w-[534px]  max-md:max-w-full">
            <div className="flex flex-col justify-center py-4 pr-10 pl-9 w-full bg-[#2B1748] min-h-[55px] rounded-[22px_22px_0px_0px] max-md:px-5 max-md:max-w-full">
              <div className="flex justify-between items-center max-md:max-w-full">
                <div className="self-stretch my-auto text-xl leading-none text-green-500">
                  Active Challenge
                </div>
                <div className="flex gap-2 items-center self-stretch my-auto text-xs leading-6 text-center text-white whitespace-nowrap">
                  <div className="flex gap-1.5 items-center self-stretch px-1 py-0.5 my-auto bg-yellow-800 border border-orange-500 border-solid rounded-[37px] w-[45px]">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/6793544b358ef60ce60a3cf2caf8ae7d41362ed3?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                    />
                    <div className="self-stretch my-auto">{userData?.currentStreak}</div>
                  </div>
                  <div className="gap-1.5 self-stretch px-1 py-0.5 my-auto w-14 bg-blue-900 border border-violet-700 border-solid rounded-[37px]">
                    Today
                  </div>
                </div>
              </div>
            </div>
            <div className="self-center flex flex-col flex-1 mt-7 max-w-full ">
              <div className="text-lg leading-none text-white max-md:max-w-full">
                5K Steps + 30 Push-ups
              </div>
              <div className="flex gap-9 items-center mt-10 w-full max-md:max-w-full">
                <ProgressCircle todaySteps={weeklySteps} />
                <div className="flex flex-col flex-1 shrink justify-center self-stretch ">
                  <div className="max-w-full w-[231px]">
                    <div className="text-sm leading-loose text-white">
                      Today's Exercises
                    </div>
                    <div className="flex flex-1 gap-2 items-center pb-1.5 w-[full]">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fd5d1f6bc230a95768965bba79ca5d58853a8e3?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                      />
                      <div className="self-stretch my-auto text-xs leading-6 text-white">
                        Push-ups (30)
                      </div>
                      <div className="flex flex-1 gap-1 items-center self-stretch my-auto bg-gray-700 min-h-[23px] rounded-[100px] w-full">
                        <div className="flex gap-2.5 items-center self-stretch px-2 py-1 my-auto bg-purple-900 min-h-[23px] rounded-[100px] w-[35px]">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e826333352b18a0edd62a11ce90e0578440fdeb6?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                            className="object-contain self-stretch my-auto aspect-square w-[18px]"
                          />
                        </div>
                        <div className="self-stretch my-auto text-xs leading-6 text-white">
                          Capture
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center pb-1.5 w-full">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fd5d1f6bc230a95768965bba79ca5d58853a8e3?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                      />
                      <div className="self-stretch my-auto text-xs leading-6 text-white">
                        Push-ups (30)
                      </div>
                      <div className="flex gap-1 items-center self-stretch my-auto bg-gray-700 min-h-[23px] rounded-[100px] w-[109px]">
                        <div className="flex gap-2.5 items-center self-stretch px-2 py-1 my-auto bg-purple-900 min-h-[23px] rounded-[100px] w-[35px]">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/33266c09e91dbfd9d462bcbee6a56ad979c4cca1?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                            className="object-contain self-stretch my-auto aspect-square w-[18px]"
                          />
                        </div>
                        <div className="self-stretch my-auto text-xs leading-6 text-white">
                          Capture
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center w-full">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fd5d1f6bc230a95768965bba79ca5d58853a8e3?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                      />
                      <div className="self-stretch my-auto text-xs leading-6 text-white">
                        Push-ups (30)
                      </div>
                      <div className="flex gap-1 items-center self-stretch my-auto bg-gray-700 min-h-[23px] rounded-[100px] w-[109px]">
                        <div className="flex gap-2.5 items-center self-stretch px-2 py-1 my-auto bg-purple-900 min-h-[23px] rounded-[100px] w-[35px]">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/28d43aa21c1f94b4b5c2000cb0d76e2099c19ff5?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                            className="object-contain self-stretch my-auto aspect-square w-[18px]"
                          />
                        </div>
                        <div className="self-stretch my-auto text-xs leading-6 text-white">
                          Capture
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-3.5 pt-3 pb-3 mt-2.5 w-full text-base leading-none text-white bg-gray-700 rounded-lg min-h-[61px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span>50% complete</span>
                      </div>
                      <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#CF15E0] rounded-full transition-all duration-300 ease-in-out"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 w-full text-white max-md:max-w-full">
                <div className="flex gap-4 items-start max-md:max-w-full">
                  <div className="flex gap-3 items-start w-[225px]">
                    <div className="flex gap-6 items-center py-2 pr-8 pl-4 bg-purple-900 min-h-[74px] rounded-[140px] w-[225px] max-md:pr-5">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/cff239496af3f485e4fc3d530033b89091c58c13?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                        className="object-contain shrink-0 self-stretch my-auto aspect-[0.98] rounded-[1030px] w-[52px]"
                      />
                      <div className="flex flex-col self-stretch my-auto w-[78px]">
                        <div className="self-start text-sm leading-loose text-center">
                          Time Left
                        </div>
                        <div className="flex gap-1 items-center w-full whitespace-nowrap">
                          <div className="self-stretch my-auto text-2xl">7</div>
                          <div className="self-stretch my-auto text-base font-medium leading-none text-center">
                            hr
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center px-7 py-2 whitespace-nowrap bg-purple-900 min-h-[74px] rounded-[140px] w-[225px] max-md:px-5">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8c47120a8d5f778083924c03a11a3fbcf00948a?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                      className="object-contain shrink-0 self-stretch my-auto aspect-[0.98] rounded-[1030px] w-[52px]"
                    />
                    <div className="self-stretch my-auto w-[67px]">
                      <div className="text-sm leading-loose">Calories</div>
                      <div className="text-2xl">
                        <AnimatedCounter value={weeklyCalories}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start px-2.5 py-2 mt-7 w-full text-sm leading-loose rounded bg-slate-600 min-h-[58px] max-md:max-w-full">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff6840f88982558880b258883f520bb119c910b1?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                    />
                    <div className="self-stretch my-auto w-[77px]">
                      <div>ETH Staked</div>
                      <div>10 ETH</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center mt-7 w-full h-[70px] max-md:max-w-full">
                  <div className="flex flex-col justify-center items-start self-stretch p-3.5 my-auto bg-gray-700 rounded-lg min-h-[71px] w-[225px]">
                    <div className="flex gap-2.5 items-center">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0354d7f454fd566ab7701cb11c612f76ff9c5f74?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[27px]"
                      />
                      <div className="self-stretch my-auto w-[99px]">
                        <div className="text-xs leading-6">Challenges Won</div>
                        <div className="text-xl leading-none">{userData?.challengesWon?.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-start self-stretch px-5 py-3.5 my-auto bg-gray-700 rounded-lg min-h-[71px] w-[225px]">
                    <div className="flex gap-3.5 items-center">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c6931d743c34a4c72ec55d4e083e104c67948d24?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                      />
                      <div className="self-stretch my-auto w-[97px]">
                        <div className="text-xs leading-6">Rewards Earned</div>
                        <div className="text-xl leading-none">45 ETH</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
