import { useState, useEffect } from "react";

const ProgressCircle = ({ todaySteps }) => {
  const [progress, setProgress] = useState(0);

  // Total circumference of the circle
  const circleCircumference = 5000;

  // Calculate strokeDashoffset based on percentage of completion
  const progressPercentage = Math.min(todaySteps / 10000, 1); // Assuming max steps = 10000
  const progressOffset = circleCircumference * (1 - progressPercentage);

  // Define colors dynamically based on todaySteps
  const getProgressColor = () => {
    if (todaySteps < 3000) return "#FF3B30"; // Red for low steps
    if (todaySteps < 7000) return "#FF9500"; // Orange for medium steps
    return "#4CD964"; // Green for high steps
  };

  useEffect(() => {
    // Animate from 0 to the actual progress
    setTimeout(() => {
      setProgress(progressOffset);
    }, 500);
  }, [todaySteps]);

  return (
    <div className="self-stretch flex flex-col items-center justify-center min-h-[170px] w-[170px] max-md:px-5 relative">
      <svg width="175" height="175" viewBox="0 0 120 120">
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#F2F3F1"
          strokeWidth="12"
        />

        {/* Animated Progress Arc */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={getProgressColor()} // Dynamic color
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circleCircumference}
          strokeDashoffset={progress}
          transform="rotate(-90 60 60)"
          style={{
            transition: "stroke-dashoffset 1.5s ease-out", // Smooth animation
          }}
        />
      </svg>

      {/* Percentage Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
        {todaySteps}
      </div>
    </div>
  );
};

export default ProgressCircle;
