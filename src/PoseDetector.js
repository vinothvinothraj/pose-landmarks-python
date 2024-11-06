// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const PoseDetector = () => {
//     const webcamRef = useRef(null);
//     const [landmarks, setLandmarks] = useState([]);

//     const captureFrame = async () => {
//         const imageSrc = webcamRef.current.getScreenshot();

//         if (imageSrc) {
//             try {
//                 const response = await axios.post("http://127.0.0.1:5000/video_feed", {
//                     image: imageSrc.split(",")[1]  // Remove the base64 header
//                 }, {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 setLandmarks(response.data.landmarks);
//             } catch (error) {
//                 console.error("Error analyzing pose:", error);
//             }
//         }
//     };

//     useEffect(() => {
//         const interval = setInterval(captureFrame, 1000);  // Capture frame every 1 second
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div>
//             <h2>Human Pose Detection</h2>
//             <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 width={640}
//                 height={480}
//             />
//             <div>
//                 <h3>Pose Landmarks</h3>
//                 {landmarks.length > 0 ? (
//                     <ul>
//                         {landmarks.map((landmark, index) => (
//                             <li key={index}>
//                                 x: {landmark.x.toFixed(3)}, y: {landmark.y.toFixed(3)}, z: {landmark.z.toFixed(3)}, visibility: {landmark.visibility.toFixed(3)}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No landmarks detected</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PoseDetector;


// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const PoseDetector = () => {
//     const webcamRef = useRef(null);
//     const [landmarks, setLandmarks] = useState([]);
//     const [processedImage, setProcessedImage] = useState(null);

//     const captureFrame = async () => {
//         const imageSrc = webcamRef.current.getScreenshot();

//         if (imageSrc) {
//             try {
//                 const response = await axios.post("http://127.0.0.1:5000/video_feed", {
//                     image: imageSrc.split(",")[1]  // Remove the base64 header
//                 }, {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
                
//                 setLandmarks(response.data.landmarks);
//                 setProcessedImage(`data:image/jpeg;base64,${response.data.image}`);
//             } catch (error) {
//                 console.error("Error analyzing pose:", error);
//             }
//         }
//     };

//     useEffect(() => {
//         const interval = setInterval(captureFrame, 1000);  // Capture frame every 1 second
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div>
//             <h2>Human Pose Detection</h2>
//             <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 width={640}
//                 height={480}
//             />
//             <div>
//                 <h3>Processed Image with Pose Landmarks</h3>
//                 {processedImage && <img src={processedImage} alt="Processed frame with landmarks" />}
//             </div>
//             <div>
//                 <h3>Pose Landmarks</h3>
//                 {landmarks.length > 0 ? (
//                     <ul>
//                         {landmarks.map((landmark, index) => (
//                             <li key={index}>
//                                 x: {landmark.x.toFixed(3)}, y: {landmark.y.toFixed(3)}, z: {landmark.z.toFixed(3)}, visibility: {landmark.visibility.toFixed(3)}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No landmarks detected</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PoseDetector;


import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000");  // Connect to Flask server

const PoseDetector = () => {
    const webcamRef = useRef(null);
    const [processedImage, setProcessedImage] = useState(null);

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
        });
    }, []);

    return (
        <div>
            <h2>Real-Time Pose Detection</h2>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={640} height={480} />
            {processedImage && <img src={processedImage} alt="Processed with landmarks" />}
        </div>
    );
};

export default PoseDetector;
