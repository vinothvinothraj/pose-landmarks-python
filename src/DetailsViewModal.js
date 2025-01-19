import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DetailsViewModal = ({ isOpen, onClose, sessions }) => {
    if (!isOpen) return null;

    // Prepare data for the line chart
    const chartData = {
        labels: sessions.map(session => session.id),  // Session IDs on the x-axis
        datasets: [
            {
                label: "Session Posture Score",  // The line label
                data: sessions.map(session => session.session_posture_score),  // The posture score on the y-axis
                borderColor: "rgba(75, 192, 192, 1)",  // Line color
                backgroundColor: "rgba(75, 192, 192, 0.2)",  // Area under the line
                fill: true,  // Fill the area under the line
                tension: 0.4,  // Smoothness of the line
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Posture Score vs Session ID",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Session ID",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Posture Score",
                },
                min: 0,  // Set minimum y-axis value
                max: 100,  // Set maximum y-axis value
            },
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg w-full h-full sm:w-full lg:w-3/4 p-4 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-2 border-b col-span-2">
                    <h2 className="text-lg font-semibold">User Sessions</h2>
                    <button
                        onClick={onClose}
                        className="text-red-500 font-extrabold hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>

                {/* Left Column: Session Details */}
                <div className="overflow-auto p-2">
                    {sessions.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div key={session.id} className="p-4 border rounded-lg shadow-sm">
                                        <h3 className="text-xl font-semibold">{session.session_name}</h3>
                                        <p><strong>Posture Type:</strong> {session.posture_type}</p>
                                        <p><strong>Start Time:</strong> {new Date(session.start_time).toLocaleString()}</p>
                                        <p><strong>End Time:</strong> {new Date(session.end_time).toLocaleString()}</p>
                                        <p><strong>Score:</strong> {session.session_posture_score}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>No sessions found for this user.</p>
                    )}
                </div>

                {/* Right Column: Line Graph */}
                <div className="p-2">
                    <Line data={chartData} options={chartOptions} />
                </div>

            </div>
        </div>
    );
};

export default DetailsViewModal;
