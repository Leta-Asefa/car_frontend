import React, { useState } from "react";
import axios from "axios";

const Category = ({ setFilterType, filterType }) => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const priceRanges = {
    "Under 20000": { min: 0, max: 20000 },
    "20000 - 30000": { min: 20000, max: 30000 },
    "30000 - 40000": { min: 30000, max: 40000 },
    "40000+": { min: 40000, max: Infinity },
  };

  const handleApplyFilters = async () => {
    const filters = {
      bodyType: filterType || null,
      make: selectedMake || null,
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


      {/* Categories */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 px-20">
        {["SUV", "Sedan", "Hatchback", "Electric", "Convertible"].map((category, index) => (
          <div
            key={index}
            className="border bg-white text-black rounded-xl p-1 flex flex-wrap justify-center items-center gap-2 hover:shadow-md hover:bg-slate-100 cursor-pointer"
            onClick={() => {
              setFilterType(category);
              setSelectedMake("");
              setSelectedModel("");
              setSelectedPrice("");
              handleApplyFilters();
            }}
          >
            <img
              src={`https://via.placeholder.com/20?text=${category.charAt(0)}`}
              alt="category"
              width={20}
              height={20}
            />
            <h2 className="font-semibold">{category}</h2>
          </div>
        ))}
      </div>

   

      {/* Filter Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 mt-10">
        {filteredCars.map((car) => (
          <div
            key={car._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
            onClick={() => handleCarClick(car)}
          >
            {car.images?.[0] && (
              <img
                src={car.images[0]}
                alt={car.name}
                className="w-full h-auto object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-lg font-bold mb-2">{car.name}</h2>
            <p className="text-gray-500 text-sm">🚗 {car.brand}</p>
            <p className="text-gray-500 text-sm">💰 ${car.price}</p>
            <p className="text-gray-500 text-sm">📍 {car.location}</p>
            <button
              className="mt-4 bg-blue-100 text-blue-500 px-2 py-1 rounded-full hover:bg-blue-200 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleMessageClick(car.user?._id);
              }}
            >
              💬 Message Owner
            </button>
          </div>
        ))}
      </div>

      {/* Car Details Modal */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4 z-50">
          <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{selectedCar.name}</h2>
            {selectedCar.images?.[0] && (
              <img
                src={selectedCar.images[0]}
                alt={selectedCar.name}
                className="w-full h-60 object-cover rounded-md mb-4"
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">🚗 <strong>Brand:</strong> {selectedCar.brand}</p>
              <p className="text-gray-700">📅 <strong>Year:</strong> {selectedCar.year}</p>
              <p className="text-gray-700">💰 <strong>Price:</strong> ${selectedCar.price}</p>
              <p className="text-gray-700">🎨 <strong>Color:</strong> {selectedCar.color}</p>
              <p className="text-gray-700">📍 <strong>Location:</strong> {selectedCar.location}</p>
              <p className="text-gray-700">⚙️ <strong>Transmission:</strong> {selectedCar.transmission}</p>
              <p className="text-gray-700">⛽ <strong>Fuel:</strong> {selectedCar.fuel}</p>
              <p className="text-gray-700">📏 <strong>Mileage:</strong> {selectedCar.mileage} km</p>
            </div>
            <button
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
