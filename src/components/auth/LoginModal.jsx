import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(isOpen);
  const navigate = useNavigate();

  const { login } = useAuth();

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const status = await login(email, password);
      onClose();
      if (status)
        navigate('/')

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Modal isOpen={showModal} onClose={onClose}>
      <div className="bg-white px-8 py-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" w-full p-2 mt-2 border focus:outline-none focus:ring-2  block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" w-full p-2 mt-2 border focus:outline-none focus:ring-2  block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </button>
        </div>
      </div>
    </Modal>
  );
}
