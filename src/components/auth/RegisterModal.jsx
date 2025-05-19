import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register } = useAuth();
  const navigator = useNavigate();

  const validate = () => {
    const errors = {};
    let isValid = true;

    if (!/^0[79]\d{8}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone must start with 09 or 07 and be 10 digits.";
      isValid = false;
    }

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validate()) return;

    try {
      const status = await register(email, password, name, role, phoneNumber);
      if (status) {
        onClose();
        navigator("/");
      }
    } catch (err) {
      console.error("Registration failed error", err);

    const message =
      err?.response?.data?.message+". email and phone should be unique" || "Registration failed. Please try again.";
    setError(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white px-8 py-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Register</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 mt-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone No
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={`w-full p-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                fieldErrors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mt-2 border rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full p-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full p-2 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2">Buyer</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="seller"
                  checked={role === "seller"}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2">Seller</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
