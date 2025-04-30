import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CarListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    brand: "",
    year: "",
    bodyType: "",
    fuel: "",
    mileage: "", // Added mileage field here
    model: "",
    transmission: "",
    color: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "You can upload a maximum of 5 images",
      }));
      return;
    }
    setImages(files);
    setErrors((prevErrors) => ({ ...prevErrors, images: "" }));
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.title) formErrors.title = "Title is required";
    if (!formData.description) formErrors.description = "Description is required";
    if (!formData.location) formErrors.location = "Location is required";
    if (!formData.brand) formErrors.brand = "Brand is required";
    if (!formData.year) formErrors.year = "Year is required";
    if (!formData.bodyType) formErrors.bodyType = "Body Type is required";
    if (!formData.fuel) formErrors.fuel = "Fuel Type is required";
    if (!formData.mileage) formErrors.mileage = "Mileage is required";
    if (!formData.model) formErrors.model = "Model is required";
    if (!formData.transmission) formErrors.transmission = "Transmission is required";
    if (!formData.color) formErrors.color = "Color is required";
    if (!formData.price) formErrors.price = "Price is required";
    if (images.length === 0) formErrors.images = "At least one image is required";

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    console.log("handle submit called, user object", user);

    setIsSubmitting(true);

    try {
      const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpavrc7wd/image/upload";
      const CLOUDINARY_UPLOAD_PRESET = "ml_default";

      // Upload images to Cloudinary
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          const imageFormData = new FormData();
          imageFormData.append("file", image);
          imageFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const response = await axios.post(CLOUDINARY_URL, imageFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          return response.data.secure_url; // Get the secure URL of the uploaded image
        })
      );

      // Prepare JSON payload to send to the backend
      const payload = {
        ...formData,
        user: user.id || user._id,
        images: uploadedImageUrls, // Include uploaded image URLs
      };

      // Send JSON payload to the backend
      const response = await axios.post("http://localhost:4000/api/car/add", payload, {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true,
        },
      });

      console.log("Response", response);

      if (response.status === 201) {
        alert("Car successfully submitted!");
        navigate("/"); // Redirect after successful submission
      }
    } catch (error) {
      console.error("Error submitting car listing:", error);
      alert("Error while submitting the car listing!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const address = data.display_name || "Location found";
          setFormData((prevData) => ({
            ...prevData,
            location: address,
          }));
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            location: "Could not retrieve location",
          }));
        }
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          location: "Location permission denied",
        }));
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-16">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Submit Car Listing
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-semibold">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Mileage */}
          <div>
            <label htmlFor="mileage" className="block text-gray-700 font-semibold">
              Mileage
            </label>
            <input
              type="text"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mileage && (
              <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
            )}
          </div>

        {/* Description */}
        <div>
            <label htmlFor="description" className="block text-gray-700 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-semibold">
              Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter or detect your location"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="p-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                {loadingLocation ? "Detecting..." : "Use Current Location"}
              </button>
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="images" className="block text-gray-700 font-semibold">
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>

          {/* Dropdowns and Inputs */}
          {[
            { label: "Brand", name: "brand", options: ["Toyota", "BMW", "Audi", "Mercedes", "Honda"] },
            { label: "Year", name: "year", options: Array.from({ length: 30 }, (_, i) => (2025 - i).toString()) },
            { label: "Body Type", name: "bodyType", options: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible"] },
            { label: "Fuel Type", name: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid"] },
            { label: "Model", name: "model", options: ["Model X", "Model Y", "Model Z"] },
            { label: "Transmission", name: "transmission", options: ["Automatic", "Manual"] },
            { label: "Color", name: "color", options: ["Red", "Blue", "Black", "White"] },
          ].map((dropdown) => (
            <div key={dropdown.name}>
              <label htmlFor={dropdown.name} className="block text-gray-700 font-semibold">
                {dropdown.label}
              </label>
              <select
                id={dropdown.name}
                name={dropdown.name}
                value={formData[dropdown.name]}
                onChange={handleChange}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select {dropdown.label}</option>
                {dropdown.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors[dropdown.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[dropdown.name]}</p>
              )}
            </div>
          ))}

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 font-semibold">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarListing;