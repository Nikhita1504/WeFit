import React, { useState, useEffect } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5'; // Import green tick icon from react-icons
import ProgressCircle from './ui/ProgressCircle';

const ActiveChallengeCard = () => {
  const [challengeData, setChallengeData] = useState(null);

  // Fetch data from API on mount
  useEffect(() => {
    setChallengeData({
      "message": "Active Challenge created successfully!",
      "challenge": {
          "userId": "67ea5516e876b029485b754d",
          "challengeId": "67eaeecab6ed7a01f4e16a71",
          "exercises": [
              {
                  "name": "Step",
                  "reps": 3000,
                  "completedReps": 2000,
                  "isCompleted": false,
                  "isVideoRequired": false,
                  "videoUrl": "",
                  "_id": "67eb00606ed8d25400add7e6"
              },
              {
                  "name": "Pushup",
                  "reps": 20,
                  "completedReps": 20,
                  "isCompleted": false,
                  "isVideoRequired": true,
                  "videoUrl": "",
                  "_id": "67eb00606ed8d25400add7e7"
              },
              {
                  "name": "Squat",
                  "reps": 20,
                  "completedReps": 20,
                  "isCompleted": true,
                  "isVideoRequired": true,
                  "videoUrl": "",
                  "_id": "67eb00606ed8d25400add7e8"
              }
          ],
          "ethStaked": 3,
          "rewardsEarned": 1.5,
          "timeLeft": 24,
          "isCompleted": false,
          "_id": "67eb00606ed8d25400add7e5",
          "createdAt": "2025-03-31T20:51:44.817Z",
          "updatedAt": "2025-03-31T20:51:44.817Z",
          "__v": 0
      }
    })
  }, []);

  if (!challengeData) {
    return <div>Loading...</div>;
  }

  // Filter out the "Step" exercise
  const filteredExercises = challengeData.challenge.exercises.filter(exercise => exercise.name !== "Step");
  const totalExercises = filteredExercises.length;
  const completedExercises = filteredExercises.filter(ex => ex.isCompleted).length;
  const completionPercentage = (completedExercises / totalExercises) * 100;

  return (
    <div className="flex flex-col grow shrink self-stretch bg-[#1A0F2B] border-4 border-solid border-[#301F4C] rounded-[23px] h-[700px] min-w-[534px] max-md:max-w-full">
      <div className="flex flex-col justify-center py-4 pr-10 pl-9 w-full bg-[#2B1748] min-h-[55px] rounded-[22px_22px_0px_0px] max-md:px-5 max-md:max-w-full">
        <div className="flex justify-between items-center max-md:max-w-full">
          <div className="self-stretch my-auto text-xl leading-none text-green-500">
            Active Challenge
          </div>
          <div className="flex gap-2 items-center self-stretch my-auto text-xs leading-6 text-center text-white whitespace-nowrap">
            <div className="flex gap-1.5 items-center self-stretch px-1 py-0.5 my-auto bg-yellow-800 border border-orange-500 border-solid rounded-[37px] w-[45px]">
              <div className="self-stretch my-auto">{challengeData.challenge.exercises[0].completedReps}</div>
            </div>
            <div className="gap-1.5 self-stretch px-1 py-0.5 my-auto w-14 bg-blue-900 border border-violet-700 border-solid rounded-[37px]">
              Today
            </div>
          </div>
        </div>
      </div>
      <div className="self-center flex flex-col flex-1 mt-7 max-w-full">
        <div className="text-lg leading-none text-white max-md:max-w-full">
          {filteredExercises.map(exercise => (
            <div key={exercise._id}>
              <div className="flex gap-2 items-center">
                {/* Display green tick icon if completedReps matches reps */}
                {exercise.reps === exercise.completedReps && (
                  <IoCheckmarkCircle className="text-green-500 w-5 h-5" />
                )}
                {exercise.name} ({exercise.reps})
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-9 items-center mt-10 w-full max-md:max-w-full">
          <ProgressCircle todaySteps={challengeData.challenge.exercises[0].reps} />
          <div className="flex flex-col flex-1 shrink justify-center self-stretch">
            <div className="max-w-full w-[231px]">
              <div className="text-sm leading-loose text-white">
                Today's Exercises
              </div>
              {filteredExercises.map(exercise => (
                <div key={exercise._id} className="flex flex-1 gap-2 items-center pb-1.5 w-[full]">
                  {/* Display green tick icon if completedReps matches reps */}
                  {exercise.reps === exercise.completedReps && (
                    <IoCheckmarkCircle className="text-green-500 w-5 h-5" />
                  )}
                  <div className="self-stretch my-auto text-xs leading-6 text-white">
                    {exercise.name} ({exercise.reps})
                  </div>
                  <div className="flex flex-1 gap-1 items-center self-stretch my-auto bg-gray-700 min-h-[23px] rounded-[100px] w-full">
                    {exercise.isVideoRequired && (
                      <div className="flex gap-2.5 items-center self-stretch px-2 py-1 my-auto bg-purple-900 min-h-[23px] rounded-[100px] w-[35px]">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/33266c09e91dbfd9d462bcbee6a56ad979c4cca1?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
                          className="object-contain self-stretch my-auto aspect-square w-[18px]"
                        />
                      </div>
                    )}
                    <div className="self-stretch my-auto text-xs leading-6 text-white">
                      Capture
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3.5 pt-3 pb-3 mt-2.5 w-full text-base leading-none text-white bg-gray-700 rounded-lg min-h-[61px]">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                <span>{completionPercentage.toFixed(2)}% complete</span>
                </div>
                <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CF15E0] rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${completionPercentage.toFixed(2)}%` }}
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
                    <div className="self-stretch my-auto text-2xl">{challengeData.challenge.timeLeft}</div>
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
                <div className="text-2xl">{challengeData.challenge.rewardsEarned} ETH</div>
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
                <div>{challengeData.challenge.ethStaked} ETH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveChallengeCard;
