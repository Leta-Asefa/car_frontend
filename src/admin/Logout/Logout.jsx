// src/pages/admin/Logout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const {logout}=useAuth()

  const handleConfirm = async () => {
    try {
     
      const status=await  logout();
      if(status){
        navigate('/');
      }
    } catch (err) {
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate('/admin/dashboard');
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  // Simple modal definition
  const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center">
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal isOpen={showModal}>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Logout</h2>
        <p className="mb-6 text-gray-600">Are you sure you want to log out?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Log Out
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Logout;
