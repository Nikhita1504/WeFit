import React, { useState, useEffect } from 'react';

const TimerActiveChallenge = ({ fetchedData }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [creationDate, setCreationDate] = useState('');
  const [creationTime, setCreationTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (!fetchedData?.challenge?.createdAt) {
      console.error("Invalid createdAt value");
      return;
    }

    const createdAt = new Date(fetchedData.challenge.createdAt);
    if (isNaN(createdAt.getTime())) {
      console.error("Invalid date format for createdAt");
      return;
    }

    setCreationDate(createdAt.toLocaleDateString());
    setCreationTime(createdAt.toLocaleTimeString());

    const updateTimeLeft = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString());
      setCurrentTime(now.toLocaleTimeString());

      console.log("curr month" , now.getMonth()+1);
      console.log("start month" , createdAt.getMonth());
      console.log("curr year" , now.getFullYear()+1);
      console.log("start year" , createdAt.getFullYear());

      if (
        now.getFullYear() > createdAt.getFullYear() ||
        (now.getFullYear() === createdAt.getFullYear() && now.getMonth() > createdAt.getMonth()) ||
        (now.getFullYear() === createdAt.getFullYear() && now.getMonth() === createdAt.getMonth() && now.getDate() > createdAt.getDate())
      ) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const endOfDay = new Date(now);
      endOfDay.setHours(24, 0, 0, 0);
      
      const diff = endOfDay - now;
      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimeLeft();
    const timerInterval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timerInterval);
  }, [fetchedData]);

  return (
    <div className="flex gap-3 items-start w-[225px]">
      <div className="flex gap-6 items-center py-2 pr-8 pl-4 bg-purple-900 min-h-[74px] rounded-[140px] w-[225px] max-md:pr-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cff239496af3f485e4fc3d530033b89091c58c13?placeholderIfAbsent=true&apiKey=1455cb398c424e78afe4261a4bb08b71"
          className="object-contain shrink-0 self-stretch my-auto aspect-[0.98] rounded-[1030px] w-[52px]"
          alt="Timer icon"
        />
        <div className="flex flex-col self-stretch my-auto w-[78px]">
          <div className="self-start text-sm leading-loose text-center">Time Left</div>
          <div className="flex gap-1 items-center w-full whitespace-nowrap">
            <div className="self-stretch my-auto text-2xl">
              {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
            </div>
            <div className="self-stretch my-auto text-base font-medium leading-none text-center">sec</div>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Created: {creationDate} at {creationTime}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Current: {currentDate} at {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerActiveChallenge;
