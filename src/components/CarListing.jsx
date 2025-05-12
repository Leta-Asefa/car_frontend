import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "./common/Modal";

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

const CarListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    brand: "",
    year: "",
    bodyType: "",
    fuel: "",
    mileage: "",
    model: "",
    transmission: "",
    color: "",
    price: "",
    images: [],
    vehicleDetails: "",
    features: [],
    safety: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/");
  }

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const updatedArray = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "You can upload a maximum of 6 images",
      }));
      return;
    }
    setSelectedImages(files);
    setErrors((prevErrors) => ({ ...prevErrors, images: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpavrc7wd/image/upload";
      const CLOUDINARY_UPLOAD_PRESET = "ml_default";

      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          const imageFormData = new FormData();
          imageFormData.append("file", image);
          imageFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const response = await axios.post(CLOUDINARY_URL, imageFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          return response.data.secure_url;
        })
      );

      const payload = {
        ...formData,
        user: user.id || user._id,
        images: uploadedImageUrls,
      };

      const response = await axios.post("http://localhost:4000/api/car/add", payload, {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true,
        },
      });

      if (response.status === 201) {
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting car listing:", error);
      alert("Error while submitting the car listing!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-16">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Submit Car Listing
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(formData).map((key) => (
            key !== "images" && (
              <div key={key}>
                <label htmlFor={key} className="block text-gray-700 font-semibold">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {dropdownData[key] ? (
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
                            onChange={() => handleInputChange(key, option)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <select
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select {key}</option>
                      {dropdownData[key].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )
                ) : (
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            )
          ))}

          <div>
            <label htmlFor="images" className="block text-gray-700 font-semibold">
              Upload Images (Max 6)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageSelection}
              className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Submit Listing
            </button>
          </div>
        </form>
      </div>
      {isSuccessModalOpen && (
        <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
          <div className="text-center bg-gray-200 text-black p-10 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p className=" mb-6">Your car has been successfully submitted.</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/");
              }}
            >
              Go to Home
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarListing;