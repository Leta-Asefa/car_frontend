import React, { useState } from "react";
import axios from "axios";
import { PiBrandy } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";

const Category = ({ setFilterType, filterType }) => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const priceRanges = {
    "Under 20000": { min: 0, max: 20000 },
    "20000 - 30000": { min: 20000, max: 30000 },
    "30000 - 40000": { min: 30000, max: 40000 },
    "40000+": { min: 40000, max: 100000000 },
  };

  const handleApplyFilters = async () => {
    const filters = {
      bodyType: filterType || null,
      brand: selectedMake || null,
      model: selectedModel || null,
      priceRange: selectedPrice ? priceRanges[selectedPrice] : null,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/car/filter", filters);
      setFilteredCars(response.data);
    } catch (error) {
      console.error("Error fetching filtered cars:", error);
    }
  };

  const handleCarClick = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleMessageClick = (ownerId) => {
    console.log("Owner ID:", ownerId);
  };

  return (
    <div
      className="py-12"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920)",
      }}
    >
      <h2 className="font-bold text-3xl text-center mb-10 text-white">
        Browse Cars By Type
      </h2>

      {/* Categories */}
      <div className="flex flex-wrap flex-row justify-center items-center gap-5  ">
        {["SUV", "Sedan", "Hatchback", "Electric", "Convertible"].map((category, index) => (
          <div
            key={index}
            className="border p-4 bg-white text-black rounded-xl p-1 flex flex-wrap justify-center items-center gap-2 hover:shadow-md hover:bg-slate-100 cursor-pointer"
            onClick={() => {
              setFilterType(category);
              setSelectedMake("");
              setSelectedModel("");
              setSelectedPrice("");
              handleApplyFilters();
            }}
          >
            <input
              type="radio"
              name="category"
              checked={filterType === category}
              onChange={() => { }}
              className="form-radio text-indigo-600 h-4 w-4"
            />
            <h2 className="font-semibold">{category}</h2>
          </div>
        ))}
      </div>




      {/* Dropdown Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Make</option>
              {["Toyota", "BMW", "Mercedes", "Audi"].map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Model</option>
              {["Corolla", "X5", "C-Class", "Q7"].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Price</option>
              {Object.keys(priceRanges).map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>




      {/* Filter Results */}
      <div className="bg-gray-800 py-10 px-4 rounded-xl">
        <div className="grid grid-cols-3 gap-14 px-20">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              onClick={() => handleCarClick(car)}
              className="w-full sm:w-72 md:w-80 lg:w-96 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl cursor-pointer group relative"
            >
              {car.images?.[0] && (
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-bold mb-1">{car.name}</h2>
                <p className="text-gray-500 text-sm mb-1">🚗 {car.brand}</p>
                <p className="text-gray-500 text-sm mb-1">💰 ${car.price}</p>
                <p className="text-gray-500 text-sm mb-3">📍 {car.location}</p>
                <button
                  className="bg-blue-100 text-blue-500 px-3 py-1 rounded-full hover:bg-blue-200 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessageClick(car.user?._id);
                  }}
                >
                  💬 Message Owner
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Car Details Modal */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCar.year} {selectedCar.brand} {selectedCar.model}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-red-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                {/* Left Column - Images */}
                <div>
                  {selectedCar.images?.length > 0 && (
                    <img
                      src={selectedCar.images[selectedImageIndex]}
                      alt={selectedCar.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />


                  )}

                  {/* Thumbnails */}
                  <div className="flex mt-4 gap-2 overflow-x-auto">
                    {selectedCar.images?.map((img, idx) => (

                      <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`h-16 w-16 object-cover rounded border-2 cursor-pointer ${selectedImageIndex === idx ? "border-indigo-500" : "border-gray-300"
                          }`}
                      />

                    ))}
                  </div>

                  {/* Description */}
                  {selectedCar.description && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-600">{selectedCar.description}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-3xl font-bold text-indigo-600 mb-4">
                      ${selectedCar.price}
                    </h3>
                    <button className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition">
                      Call Seller
                    </button>
                    <h4 className="text-center font-bold text-blue-700 mt-6">
                      Or Contact Via
                    </h4>
                    <div className="flex justify-center gap-2 mt-4 flex-wrap">
                      {["Email", "Telegram", "Facebook", "Instagram"].map((platform) => (
                        <button
                          key={platform}
                          className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50"
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span>Year:</span>
                        <span>{selectedCar.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span>{selectedCar.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transmission:</span>
                        <span>{selectedCar.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel:</span>
                        <span>{selectedCar.fuel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mileage:</span>
                        <span>{selectedCar.mileage} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{selectedCar.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Category;
