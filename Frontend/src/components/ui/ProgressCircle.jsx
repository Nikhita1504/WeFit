import { useState, useEffect } from "react";
import AnimatedNumber from "./AnimatedNumber";

const ProgressCircle = ({ todaySteps }) => {
  const [progress, setProgress] = useState(0);

  // Total circumference of the circle
  const circleCircumference = 339.3; // 2 * π * r (for r=54)

  // **Modify Progress Calculation for 5000 Steps**
  const maxSteps = 5000; 
  const progressPercentage = Math.min(todaySteps / maxSteps, 1); // Normalize within 0-1
  const progressOffset = circleCircumference * (1 - progressPercentage);

  // **Dynamic Color Based on todaySteps**
  const getProgressColor = () => {
    if (todaySteps < 1500) return "#FF3B30"; // Red (low progress)
    if (todaySteps < 3500) return "#FF9500"; // Orange (medium progress)
    return "#4CD964"; // Green (high progress)
  };

  useEffect(() => {
    setTimeout(() => {
      setProgress(progressOffset);
    }, 500);
  }, [todaySteps]);

  return (
    <div className="relative flex items-center justify-center w-[170px] h-[170px]">
      <svg width="175" height="175" viewBox="0 0 120 120">
        {/* Background Circle */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F2F3F1" strokeWidth="12" />

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
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }} // Smooth animation
        />
      </svg>

      {/* Animated Number in Center */}
      <div className="absolute text-2xl font-bold text-white">
        <AnimatedNumber value={todaySteps}/>
      </div>
    </div>
  );
};

export default ProgressCircle;
