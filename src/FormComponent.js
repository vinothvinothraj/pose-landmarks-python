import React, { useState } from "react";
import axios from "axios";

const FormComponent = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [formData, setFormData] = useState([]);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newEntry = { name, age };
            const response = await axios.post("http://127.0.0.1:5000/users", newEntry);
            
            // Append new user to formData
            setFormData([...formData, newEntry]);

            // Reset fields
            setName("");
            setAge("");

            setMessage("Data successfully submitted!");
            window.location.reload();
        } catch (error) {
            setMessage("Error submitting form. Please try again.");
        }
    };

    const handleClear = () => {
        setName("");
        setAge("");
        setMessage("");
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-2">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-between items-center gap-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg"
                    >
                        Clear
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
};

export default FormComponent;
