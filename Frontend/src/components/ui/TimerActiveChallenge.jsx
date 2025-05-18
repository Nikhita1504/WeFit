import { Timer } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const TimerActiveChallenge = ({ fetchedData , handleDeleteChallenge }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [creationDate, setCreationDate] = useState('');
  const [creationTime, setCreationTime] = useState('');

  useEffect(() => {
    if (!fetchedData?.createdAt) {
      console.error("No createdAt value found");
      return;
    }

    // Handle different createdAt formats
    let createdAt;
    if (typeof fetchedData.createdAt === 'string') {
      createdAt = new Date(fetchedData.createdAt);
    } else if (fetchedData.createdAt?.$date) {
      // Handle MongoDB extended JSON format
      createdAt = new Date(fetchedData.createdAt.$date);
    } else {
      console.error("Unsupported createdAt format", fetchedData.createdAt);
      return;
    }

    if (isNaN(createdAt.getTime())) {
      console.error("Invalid date format for createdAt", fetchedData.createdAt);
      return;
    }

    // Calculate midnight of the same day
    const midnightSameDay = new Date(createdAt);
    midnightSameDay.setHours(24, 0, 0, 0);

    const formatDateTime = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      
      return { formattedDate, formattedTime };
    };

    const { formattedDate, formattedTime } = formatDateTime(createdAt);
    setCreationDate(formattedDate);
    setCreationTime(formattedTime);

    const calculateTimeLeft = () => {
      const now = new Date();
      const remainingTime = midnightSameDay - now;
      
      if (remainingTime <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        clearInterval(timer);
        handleDeleteChallenge();
      } else {
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        setTimeLeft({
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [fetchedData]);



  return (
    <div className="flex justify-center w-full">
  <div className="flex gap-3 items-center py-2 px-4 bg-purple-900 min-h-[60px] rounded-full w-full max-w-[400px]">
  <div className="bg-[#3A225D] p-1 text-center rounded-full  flex gap-3 items-center flex-1">
  <Timer className="w-8 h-8" />
  <div className="text-sm text-gray-300">Time Left</div>

              </div>
    <div className="flex gap-3 items-center flex-1">
      <div className="flex items-baseline gap-1">
        <div className="text-md font-medium">
          {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
        </div>
        <div className="text-sm text-gray-300">sec</div>
      </div>
    </div>
  </div>
</div>

  );
};

export default TimerActiveChallenge;