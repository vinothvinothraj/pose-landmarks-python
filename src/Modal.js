import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
                <p className="text-gray-700 mb-4">Are you sure you want to delete this user?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
