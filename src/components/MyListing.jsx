import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CarManager = ({ userId }) => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuth();

  // Fetch cars for the specified user
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/car/user/${user._id}`);
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, [user]);

  // Open modal and populate form data with selected car's details
  const handleEdit = (car) => {
    setSelectedCar(car);
    setFormData(car); // Pre-fill form data with the selected car's details
    setIsModalOpen(true);
  };

  // Update car
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await axios.put(`http://localhost:4000/api/car/${selectedCar._id}`, formData);
      alert("Car updated successfully!");
      setIsModalOpen(false);
      setCars((prevCars) =>
        prevCars.map((car) => (car._id === selectedCar._id ? { ...car, ...formData } : car))
      );
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Error updating car!");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete car
  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/car/${carId}`);
      alert("Car deleted successfully!");
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car!");
    }
  };

  // Handle input changes in the modal form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Car Manager</h1>

      {/* Car List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
      <div key={car._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
      {/* Display the first image */}
      {car.images && car.images.length > 0 && (
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        🚗 {car.title}
      </h2>
      <p className="text-gray-600 mb-2">{car.description}</p>
      <p className="text-gray-500 text-sm">
        🏷️ <strong>Brand:</strong> {car.brand}
      </p>
      <p className="text-gray-500 text-sm">
        📋 <strong>Model:</strong> {car.model}
      </p>
      <p className="text-gray-500 text-sm">
        📅 <strong>Year:</strong> {car.year}
      </p>
      <p className="text-gray-500 text-sm">
        🚙 <strong>Body Type:</strong> {car.bodyType}
      </p>
      <p className="text-gray-500 text-sm">
        ⛽ <strong>Fuel:</strong> {car.fuel}
      </p>
      <p className="text-gray-500 text-sm">
        ⚙️ <strong>Transmission:</strong> {car.transmission}
      </p>
      <p className="text-gray-500 text-sm">
        🎨 <strong>Color:</strong> {car.color}
      </p>
      <p className="text-gray-500 text-sm">
        📏 <strong>Mileage:</strong> {car.mileage} km
      </p>
      <p className="text-gray-500 text-sm">
        💰 <strong>Price:</strong> ${car.price}
      </p>
      <p className="text-gray-500 text-sm">
        📍 <strong>Location:</strong> {car.location}
      </p>
      <p className="text-gray-500 text-sm">
        👤 <strong>User:</strong> {car.user?.username}
      </p>
      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          onClick={() => handleEdit(car)}
        >
          ✏️ Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
          onClick={() => handleDelete(car._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4">
    <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg mt-40">
      <h2 className="text-xl font-bold mb-6 text-center mt-10">Edit Car</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(formData).map(
          (key) =>
            key !== "_id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "user" &&
            key !== "__v" && (
              <div key={key}>
                <label className="block text-gray-700 font-semibold capitalize">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )
        )}
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  </div>
      )}
    </div>
  );
};

export default CarManager;