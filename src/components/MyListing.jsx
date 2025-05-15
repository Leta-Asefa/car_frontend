import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Modal from "./common/Modal";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Navbar from "./Navbar";
import { HiOutlineSearchCircle } from "react-icons/hi";
import { MdOpenInNew } from "react-icons/md";
import { Calendar, Gauge, MapPin } from "lucide-react";

const dropdownData = {
  brand: [
    "Audi", "BMW", "Chevrolet", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep",
    "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes", "Nissan", "Porsche",
    "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
  ],
  model: [
    "A4", "A6", "Accord", "Altima", "Camry", "C-Class", "Civic", "Corolla",
    "Cruze", "CX-5", "E-Class", "Elantra", "F-150", "Golf", "Malibu", "Mustang",
    "Passat", "Sentra", "Sportage", "Tucson", "X3", "X5"
  ],
  year: Array.from({ length: 30 }, (_, i) => `${2025 - i}`),
  bodyType: [
    "Convertible", "Coupe", "Crossover", "Hatchback", "Pickup", "Sedan",
    "SUV", "Truck", "Van", "Wagon"
  ],
  fuel: [
    "CNG", "Diesel", "Electric", "Hybrid", "LPG", "Petrol"
  ],
  transmission: [
    "Automatic", "CVT", "Dual-Clutch", "Manual", "Semi-Automatic",
  ],
  vehicleDetails: ["New", "Used", "Certified Pre-Owned"],
  features: [
    "Air Conditioning",
    "Bluetooth",
    "Navigation",
    "Leather Seats",
    "Sunroof",
    "Backup Camera",
    "Heated Seats",
    "Apple CarPlay",
    "Android Auto",
    "Lane Departure Warning",
  ],
  safety: [
    "ABS",
    "Airbags",
    "Stability Control",
    "Blind Spot Monitor",
    "Forward Collision Warning",
    "Parking Sensors",
  ],
};

const CarManager = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleEdit = (car) => {
    const { status, ...editableCar } = car; // Exclude status from being edited
    setSelectedCar(car);
    setFormData(editableCar);
    setSelectedImages(car.images || []);
    setIsModalOpen(true);
    setTimeout(() => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) modalContent.scrollTop = 0;
    }, 0);
  };

  const handleImageSelection = (index, file) => {
    setSelectedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = file;
      return updatedImages;
    });
  };

  const handleUpdate = async () => {
    try {
      setIsUploading(true);
      setIsLoading(true);

      const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpavrc7wd/image/upload";
      const CLOUDINARY_UPLOAD_PRESET = "ml_default";

      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          if (image && typeof image !== "string") {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            const response = await axios.post(CLOUDINARY_URL, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            return response.data.secure_url;
          }
          return image; // Keep existing URLs as is
        })
      );

      const updatedCar = { ...formData, images: uploadedImageUrls };
      await axios.put(`http://localhost:4000/api/car/${selectedCar._id}`, updatedCar);
      setSuccessMessage("Car updated successfully!");
      setShowSuccessModal(true);
      setCars((prevCars) =>
        prevCars.map((car) => (car._id === selectedCar._id ? updatedCar : car))
      );
      setIsModalOpen(false);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Error updating car!");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleDelete = (carId) => {
    setCarIdToDelete(carId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/car/${carIdToDelete}`);
      setSuccessMessage("Car deleted successfully!");
      setShowSuccessModal(true);
      setCars((prevCars) => prevCars.filter((car) => car._id !== carIdToDelete));
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car!");
    } finally {
      setShowDeleteModal(false);
      setCarIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCarIdToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const updatedArray = prev[field]?.includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...(prev[field] || []), value];
      return { ...prev, [field]: updatedArray };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-12">
      <Navbar/>
      <h1 className="text-3xl font-bold text-center mb-6 mt-10">Manage Your Car Posts</h1>

      <div className="bg-gray-100 py-10 lg:px-20 rounded-xl">
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-md">
            <HiOutlineSearchCircle className="h-20 w-20 text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No cars found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative"
                  onClick={() => handleEdit(car)}
                >
                  <img
                    src={car.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {car.year} {car.brand} {car.model}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-500 text-sm overflow-hidden">
                        <MapPin className="flex-shrink-0 h-4 w-4 mr-2" />
                        <h1 className="text-ellipsis overflow-hidden whitespace-nowrap">
                          {car.location}
                        </h1>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {car.year}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Gauge className="h-4 w-4 mr-2" />
                        {car.mileage.toLocaleString()} miles
                      </div>
                      <hr className="my-8 border-t border-dotted border-gray-400" />
                    </div>
                    <div className="mt-4 flex justify-between items-center gap-1">
                      <button
                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleEdit
                          handleDelete(car._id);
                        }}
                      >
                        <AiOutlineDelete className="mr-2" />
                        Delete
                      </button>
                     
                      <h3
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleEdit
                          handleEdit(car);
                        }}
                        className=" bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-md flex items-center gap-1"
                      >
                        View 
                        <MdOpenInNew />
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">Edit Car</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(formData).map((key) => (
                key !== "_id" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "user" &&
                key !== "__v" &&
                key !== "status" && (
                  <div key={key}>
                    <label className="block text-gray-700 font-semibold capitalize">{key}</label>
                    {key === "images" ? (
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={index} className="relative">
                            {selectedImages[index] ? (
                              <img
                                src={
                                  typeof selectedImages[index] === "string"
                                    ? selectedImages[index]
                                    : URL.createObjectURL(selectedImages[index])
                                }
                                alt={`Selected ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                                <span className="text-gray-500">Placeholder</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageSelection(index, e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    ) : dropdownData[key] ? (
                      key === "features" || key === "safety" ? (
                        <div className="mt-2 space-y-2">
                          {dropdownData[key].map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData[key]?.includes(option) || false}
                                onChange={() => handleMultiSelect(key, option)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : key === "vehicleDetails" ? (
                        <div className="mt-2 space-y-2">
                          {dropdownData[key].map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name="vehicleDetails"
                                checked={formData[key] === option}
                                onChange={() => handleChange({ target: { name: key, value: option } })}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <select
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="">Select {key}</option>
                          {dropdownData[key].map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>
                )
              ))}
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
        </Modal>
      )}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center">
            <h2 className="text-2xl font-bold mb-2 text-blue-600">Uploading...</h2>
            <p className="text-lg text-gray-700">Please wait while your car is being saved.</p>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-600">Success</h2>
            <p className="text-lg text-gray-700">{successMessage}</p>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-600">Delete Car</h2>
            <p className="text-lg text-gray-700 mb-6">Are you sure you want to delete this car?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManager;