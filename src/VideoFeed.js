import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoFeed = () => {
    const [frame, setFrame] = useState('');
    const [landmarks, setLandmarks] = useState([]);

    useEffect(() => {
        const fetchVideoFeed = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/video_feed', {
                    responseType: 'json'
                });
                
                const data = response.data;
                setFrame(`data:image/jpeg;base64,${data.image}`);
                setLandmarks(data.landmarks);
            } catch (error) {
                console.error("Error fetching video feed", error);
            }
        };

        const interval = setInterval(fetchVideoFeed, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Pose Landmarks</h1>
            <img src={frame} alt="Pose" width="640" height="480" />
            <div>
                <h2>Landmarks</h2>
                {landmarks.map((landmark, index) => (
                    <p key={index}>
                        Landmark {index + 1}: (x: {landmark.x}, y: {landmark.y}, z: {landmark.z}, visibility: {landmark.visibility})
                    </p>
                ))}
            </div>
        </div>
    );
};

export default VideoFeed;
