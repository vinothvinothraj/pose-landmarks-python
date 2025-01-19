import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaPlay, FaTrashAlt } from 'react-icons/fa';
import Modal from './Modal';  // Import the modal component
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const UserListComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/users");
                setUsers(response.data.users);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError("Error fetching users. Please try again.");
            }
        };

        fetchUsers();
    }, []);

    const handleLiveClick = (userId) => {
        navigate(`/pose-detection/${userId}`);  // Use navigate for routing
    };

    const handleViewClick = (userId) => {
        alert(`Viewing details for User ID: ${userId}`);  // Replace with actual view logic
    };

    const handleDeleteClick = (userId) => {
        setIsModalOpen(true);
        setSelectedUserId(userId);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/users/${selectedUserId}`);
            setIsModalOpen(false);
            window.location.reload();  // Optionally reload the page
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User List</h3>
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                            ID
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                            Age
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{user.age}</td>
                            <td className="px-6 py-4 items-center justify-center text-sm text-center text-gray-900 flex space-x-4">
                                <button
                                    onClick={() => handleLiveClick(user.id)}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center space-x-2"
                                >
                                    <FaPlay />
                                </button>
                                <button
                                    onClick={() => handleViewClick(user.id)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center space-x-2"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(user.id)}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center space-x-2"
                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleModalClose} 
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default UserListComponent;
