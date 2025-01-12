import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import ProgressBar from "@ramonak/react-progress-bar";
const socket = io("http://127.0.0.1:5000");  // Connect to Flask server

const PoseDetector = () => {
    const webcamRef = useRef(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [noseMessage, setNoseMessage] = useState("");
    const [shoulderMessage, setShoulderMessage] = useState("");
    const [angles, setAngles] = useState({});
    const [alignmentPercentage, setAlignmentPercentage] = useState(0);
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
            console.log(data);
            setProcessedImage(`data:image/jpeg;base64,${data.image}`);
            setNoseMessage(data.nose_message);
            setShoulderMessage(data.shoulder_message);
            setAngles(data.angles);
            setAlignmentPercentage(data.overall_percentage);
        });
    }, []);


    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Real-Time Pose Detection</h2>
            <div className="grid grid-cols-4 gap-6 items-start">
                {/* Webcam Section */}
                <div className="col-span-2">
                    <div className="rounded-lg shadow-lg overflow-hidden">
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={640}
                            height={480}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Messages Section */}
                <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
                    <p className="text-sm font-medium text-gray-700 mb-2">{noseMessage}</p>
                    <p className="text-sm font-medium text-gray-700">{shoulderMessage}</p>
                    <ProgressBar completed={alignmentPercentage} />
                </div>

                {/* Angles Table Section */}
                <div className="col-span-1 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Angles Table</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Angle
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(angles).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 text-sm text-gray-900">{key}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Uncomment the following line if you use the processed image */}
            {/* {processedImage && <img src={processedImage} alt="Processed with landmarks" className="mt-6 mx-auto" />} */}
        </div>


    );
};

export default PoseDetector;
