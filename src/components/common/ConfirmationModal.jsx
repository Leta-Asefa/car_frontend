import React from "react";
import "./Modal.css";
import { FaCheckCircle } from "react-icons/fa";

const ConfirmationModal = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg shadow-2xl border border-gray-200 text-center animate-fade-in">
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-white text-4xl mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
          <p className="text-lg text-white">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;