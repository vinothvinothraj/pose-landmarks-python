import React, { useRef, useEffect, useState } from "react";
import { Router, useParams } from 'react-router-dom';
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
const socket = io("http://127.0.0.1:5000");  // Connect to Flask server

const PoseDetector = () => {
    const webcamRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [processedImage, setProcessedImage] = useState(null);

    const [shoulderMessage, setShoulderMessage] = useState("");
    const [angles, setAngles] = useState({});
    const [alignmentPercentage, setAlignmentPercentage] = useState(0);
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [headHorizontalMessage, setHeadHorizontalMessage] = useState("");
    const [headAlignmentPercentage, setHeadAlignmentPercentage] = useState(0);
    const [alignmentPercentages, setAlignmentPercentages] = useState([]);
    const [headAlignmentPercentages, setHeadAlignmentPercentages] = useState([]);
    const navigate = useNavigate();

    // Use a ref to store the latest alignment percentages
    const alignmentPercentagesRef = useRef([]);
    const headAlignmentPercentagesRef = useRef([]);
    const captureFrame = () => {
        if (isCapturing && webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                socket.emit('frame', imageSrc.split(",")[1]);
            }
        }
    };

    const handleStart = () => {
        setIsCapturing(true);
        setIsCountingDown(true);
        setStartTime(Date.now());
    };

    const handleStop = () => {
        setIsCapturing(false);
        setIsCountingDown(false);
        setEndTime(Date.now());
    };

    // useEffect(() => {
    //     if (isCapturing) {
    //         const interval = setInterval(() => {
    //             setElapsedTime(Date.now() - startTime);
    //         }, 1000);
    //         return () => clearInterval(interval);
    //     }
    // }, [isCapturing, startTime]);

    useEffect(() => {
        if (startTime && endTime) {
            const totalDuration = (endTime - startTime) / 1000; // Convert to seconds
            setElapsedTime(totalDuration);

            const postureStats = calculatePostureStatsWithArrays(
                alignmentPercentages,
                headAlignmentPercentages,
                startTime,
                endTime
            );

            const sessionData = {
                session_name: "Posture Session",
                user_id: userId,
                posture_type: "Seated",
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                ...postureStats, // Spread the returned object into sessionData
            };

            console.log("Session Data:", sessionData);


            axios.post('http://127.0.0.1:5000/sessions', sessionData)
                .then((response) => console.log("Session saved:", response.data))
                .catch((error) => console.error("Error saving session:", error));
        }
    }, [startTime, endTime]);

    useEffect(() => {
        // Set up interval to capture frames every 100 ms
        if (isCapturing) {
            const interval = setInterval(captureFrame, 100);
            return () => clearInterval(interval);
        }
    }, [isCapturing]);


    useEffect(() => {
        // Listen for processed frames from the backend
        socket.on("processed_frame", (data) => {
            setProcessedImage(`data:image/jpeg;base64,${data.image}`);
            setShoulderMessage(data.shoulder_message);
            setAngles(data.angles);
            setAlignmentPercentage(data.overall_percentage);
            setHeadHorizontalMessage(data.head_horizontal_message);
            setHeadAlignmentPercentage(data.head_horizontal_percentage);

            // Update the ref first
            alignmentPercentagesRef.current = [
                ...alignmentPercentagesRef.current,
                data.overall_percentage,
            ];

            headAlignmentPercentagesRef.current = [
                ...headAlignmentPercentagesRef.current,
                data.head_horizontal_percentage,
            ];

            // Update the state for React
            setAlignmentPercentages([...alignmentPercentagesRef.current]);
            setHeadAlignmentPercentages([...headAlignmentPercentagesRef.current]);
        });

        // Cleanup the listener when the component unmounts
        return () => socket.off("processed_frame");
    }, []);

    useEffect(() => {
    }, [alignmentPercentages, headAlignmentPercentages]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/users/${userId}`);  // Fetch user data by ID
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, [userId]);

    function calculatePostureStatsWithArrays(alignmentPercentages, headAlignmentPercentages, startTime, endTime) {
        let totalGoodDuration = 0;
        let totalBadDuration = 0;
        const threshold = 75;  // Threshold percentage for determining good/bad posture

        // Iterate over alignment percentage and head alignment percentage arrays
        for (let i = 0; i < alignmentPercentages.length; i++) {
            const alignmentPercentage = alignmentPercentages[i];
            const headAlignmentPercentage = headAlignmentPercentages[i];

            // Calculate the time at each point (assuming 100 ms intervals)
            const currentTime = startTime + i * 100;  // Incrementing the time by 100ms

            if (currentTime >= startTime && currentTime <= endTime) {
                if (alignmentPercentage > threshold && headAlignmentPercentage > threshold) {
                    totalGoodDuration += 100;  // 100 ms interval
                } else {
                    totalBadDuration += 100;  // 100 ms interval
                }
            }
        }

        // Calculate the total duration in seconds
        const totalDuration = (endTime - startTime) / 1000;  // Total duration in seconds

        // Average calculations
        const avg_good_posture = (totalGoodDuration / totalDuration) * 100;  // Average good posture percentage
        const avg_bad_posture = (totalBadDuration / totalDuration) * 100;    // Average bad posture percentage

        // Posture score calculation
        const session_posture_score = (totalGoodDuration / (totalGoodDuration + totalBadDuration)) * 100;  // Score percentage

        return {
            avg_good_posture,
            avg_bad_posture,
            session_posture_score,
        };
    }


    if (!user) {
        return <div className="flex justify-center items-center h-screen overflow-hidden">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    const goToAnalysis = () => {
        navigate("/analysis");
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl text-gray-200 font-bold mb-6 text-center bg-zinc-800 p-4 rounded-md">Real-Time Pose Detection for user: {user.name}</h2>

            <div className="grid grid-cols-5 gap-6 items-start">
                {/* Webcam Section */}
                <div className="col-span-2 flex items-center justify-start">
                    <div className="flex flex-col items-start w-full  p-4 bg-white rounded-lg shadow-2xl">
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={640}
                            height={480}
                            className="w-full h-auto"
                        />
                        <div className="pt-4 pb-4 flex justify-between gap-4 w-full">
                            <button
                                id="start-button"
                                onClick={handleStart}
                                className="w-full py-3 bg-blue-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg"
                            >
                                Start
                            </button>
                            <button
                                id="stop-button"
                                onClick={handleStop}
                                className="w-full py-3 bg-gray-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg"
                            >
                                End
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Section */}
                <div className="col-span-3 flex flex-col gap-6 w-full bg-gray-100 p-4 rounded-lg shadow-md ">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
                        <p className="text-sm font-medium text-gray-700">{shoulderMessage}</p>
                        <ProgressBar completed={alignmentPercentage} />
                        <p className="text-sm font-medium text-gray-700">{headHorizontalMessage}</p>
                        <ProgressBar completed={headAlignmentPercentage} />
                    </div>

                    {/* Display the countdown */}
                    {!isCapturing &&
                        <div className="mt-4 flex items-center justify-between">
                            <p>Total duration: {elapsedTime.toFixed(2)} seconds</p>
                            <button
                                onClick={goToAnalysis}
                                className="mt-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-blue-600"
                            >
                                Go to Analysis
                            </button>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default PoseDetector;
