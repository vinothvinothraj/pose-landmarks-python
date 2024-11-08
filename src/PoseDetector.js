import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000");  // Connect to Flask server

const PoseDetector = () => {
    const webcamRef = useRef(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [noseMessage, setNoseMessage] = useState("");
    const [shoulderMessage, setShoulderMessage] = useState("");

    const captureFrame = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            // Send the frame's base64 data to the backend
            socket.emit('frame', imageSrc.split(",")[1]);
        }
    };

    useEffect(() => {
        // Set up interval to capture frames every 100 ms
        const interval = setInterval(captureFrame, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Listen for processed frames from the backend
        socket.on("processed_frame", (data) => {
            setProcessedImage(`data:image/jpeg;base64,${data.image}`);
            setNoseMessage(data.nose_message);
            setShoulderMessage(data.shoulder_message);
        });
    }, []);

    return (
        <div>
            <h2>Real-Time Pose Detection</h2>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={640} height={480} />
            {processedImage && <img src={processedImage} alt="Processed with landmarks" />}
            <p>{noseMessage}</p>
            <p>{shoulderMessage}</p>
        </div>
    );
};

export default PoseDetector;
