import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

function Capture() {
    const [count, setCount] = useState(() => Number(sessionStorage.getItem("count")) || 0);
    const [finalc, setFinalc] = useState(() => Number(sessionStorage.getItem("finalc")) || 0);
    const [isTracking, setIsTracking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef(null);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const exerciseId = location.state?.exerciseId;
    const reps = location.state?.reps;

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io("http://localhost:3001", {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current.on("connect", () => {
            console.log("Socket connected");
        });

        socketRef.current.on("squat_count", (data) => {
            setCount(data.count);
        });

        socketRef.current.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            if (reason === "io server disconnect") {
                socketRef.current.connect();
            }
        });

        socketRef.current.on("connect_error", (err) => {
            console.log("Connection error:", err.message);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off("squat_count");
                socketRef.current.off("connect");
                socketRef.current.off("disconnect");
                socketRef.current.off("connect_error");
                socketRef.current.disconnect();
            }
            stopVideoStream();
        };
    }, []);

    const startVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check permissions.");
            throw err;
        }
    };

    const stopVideoStream = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            
            tracks.forEach(track => {
                track.stop();
                stream.removeTrack(track);
            });
            
            videoRef.current.srcObject = null;
        }
    };

    const startTracking = async () => {
        try {
            setIsLoading(true);
            await startVideoStream();
            await fetch("http://localhost:3000/flask/start_squat");
            setIsTracking(true);
        } catch (err) {
            console.error("Error starting tracking:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const stopTracking = async () => {
        try {
            await fetch("http://localhost:3000/flask/stop_squat");
            stopVideoStream();
            setIsTracking(false);
            setFinalc(count);
            sessionStorage.setItem("finalc", count);
            setCount(0);
            sessionStorage.setItem("count", 0);
        } catch (err) {
            console.error("Error stopping tracking:", err);
        }
    };

    const handleCompleteExercise = async (exerciseId) => {
        try {
            const token = localStorage.getItem("JwtToken");
            if (!token) {
                console.error("No JWT token found in localStorage");
                return;
            }

            const response = await axios.put(
                `http://localhost:3000/ActiveChallenge/update/${token}`,
                { exerciseId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Exercise marked as completed:", response.data);
            return true;
        } catch (error) {
            console.error("Error completing exercise:", error);
            return false;
        }
    };

    useEffect(() => {
        if (count === reps && reps > 0) {
            const completeExercise = async () => {
                stopVideoStream();
                // setIsTracking(false);
                const success = await handleCompleteExercise(exerciseId);
                if (success) {
                    alert("Exercise completed successfully!");
                } else {
                    alert("Exercise completed but failed to update server.");
                }
            };
            completeExercise();
        }
    }, [count, reps, exerciseId]);

    const handleNavigate = () => {
        stopVideoStream();
        navigate("/", { state: { finalc } });
        sessionStorage.setItem('finalc', 0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0a192f] relative overflow-hidden">
            {/* Purple and Teal Glow Effects */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 opacity-50 blur-2xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-400 opacity-50 blur-2xl rounded-full"></div>

            <h1 className="text-3xl font-bold mb-6 text-white">Squat Counter</h1>

            {/* Button Section Box */}
            <div className="mb-6 bg-black p-4 rounded-lg shadow-lg border border-gray-700">
                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-md font-medium ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            } transition-colors`}
                    >
                        {isLoading ? "Starting..." : "Start Tracking"}
                    </button>
                ) : (
                    <button
                        onClick={stopTracking}
                        className="px-6 py-2 rounded-md font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                    >
                        Stop Tracking
                    </button>
                )}
            </div>

            {/* Count Displays in Circles */}
            <div className="mb-6 flex space-x-6">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-800 text-white text-xl font-semibold border-4 border-teal-400">
                    {reps}
                </div>
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-800 text-white text-xl font-semibold border-4 border-teal-400">
                    {count}
                </div>
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-800 text-white text-xl font-semibold border-4 border-purple-500">
                    {finalc}
                </div>
            </div>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full max-w-md rounded-lg border-2 ${isTracking ? 'border-green-400' : 'border-gray-300'
                    }`}
            />
            <button
                onClick={handleNavigate}
                className="mt-6 px-6 py-2 rounded-md font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors relative z-10"
            >
                Done
            </button>
        </div>
    );
}

export default Capture;