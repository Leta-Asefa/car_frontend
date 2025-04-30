import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, Search } from "lucide-react";
import Navbar from "../components/Navbar";

export default function ComparisonPage() {
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filteredCars1, setFilteredCars1] = useState([]);
  const [filteredCars2, setFilteredCars2] = useState([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const fetchCars = async (query, setFunction) => {
    if (!query.trim()) {
      setFunction([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:4000/api/car/search/${query}`);
      console.log("cars ",response.data);
      setFunction(response.data); // assumes the response is an array of car objects
    } catch (error) {
      console.error("Error fetching cars:", error);
      setFunction([]);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCars(search1, setFilteredCars1);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search1]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCars(search2, setFilteredCars2);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search2]);

  const selectCar1 = (car) => {
    setCar1(car);
    setSearch1(`${car.year} ${car.brand} ${car.model}`);
    setShowDropdown1(false);
  };

  const selectCar2 = (car) => {
    setCar2(car);
    setSearch2(`${car.year} ${car.brand} ${car.model}`);
    setShowDropdown2(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-24">
        <h1 className="text-3xl font-bold mb-8">Compare Cars</h1>
        <div className="grid grid-cols-2 gap-8">
          {/* Car Selection 1 */}
          <div className="space-y-2 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search first car..."
                value={search1}
                onChange={(e) => {
                  setSearch1(e.target.value);
                  setShowDropdown1(true);
                }}
                onFocus={() => setShowDropdown1(true)}
                className="w-full p-2 pl-8 border rounded"
              />
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {showDropdown1 && filteredCars1.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCars1.map((car) => (
                  <div
                    key={car._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectCar1(car)}
                  >
                    {car.year} {car.brand} {car.model}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Car Selection 2 */}
          <div className="space-y-2 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search second car..."
                value={search2}
                onChange={(e) => {
                  setSearch2(e.target.value);
                  setShowDropdown2(true);
                }}
                onFocus={() => setShowDropdown2(true)}
                className="w-full p-2 pl-8 border rounded"
              />
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {showDropdown2 && filteredCars2.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCars2.map((car) => (
                  <div
                    key={car._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectCar2(car)}
                  >
                    {car.year} {car.brand} {car.model}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Car Images */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {car1 ? (
              <img
                src={car1.images?.[0]}
                alt={`${car1.brand} ${car1.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Select a car
              </div>
            )}
          </div>


          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {car2 ? (
              <img
                src={car2.images?.[0]}
                alt={`${car2.brand} ${car2.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Select a car
              </div>
            )}
          </div>

          {/* Basic Info */}
          {car1 && (
  <div className="space-y-2 border p-4 rounded shadow">
    <p className="text-2xl font-bold text-indigo-600">
      ${Number(car1.price).toLocaleString()}
    </p>
    <p className="text-lg font-semibold">{car1.title}</p>
    <p><strong>Brand:</strong> {car1.brand}</p>
    <p><strong>Model:</strong> {car1.model}</p>
    <p><strong>Year:</strong> {car1.year}</p>
    <p><strong>Body Type:</strong> {car1.bodyType}</p>
    <p><strong>Color:</strong> {car1.color}</p>
    <p><strong>Fuel:</strong> {car1.fuel}</p>
    <p><strong>Transmission:</strong> {car1.transmission}</p>
    <p><strong>Mileage:</strong> {Number(car1.mileage).toLocaleString()} miles</p>
    <p><strong>Location:</strong> {car1.location}</p>
    <p><strong>Description:</strong> {car1.description}</p>
    <p><strong>Seller:</strong> {car1.user?.username} ({car1.user?.email})</p>
    <div className="space-x-2">
      {car1.images?.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Car1 image ${idx + 1}`}
          className="inline-block h-32 w-48 object-cover rounded"
        />
      ))}
    </div>
  </div>
)}

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">
              {car2
                ? `${car2.year} ${car2.brand} ${car2.model}`
                : "Select a car"}
            </h3>
            {car2 && (
  <div className="space-y-2">
    <p className="text-2xl font-bold text-indigo-600">
      ${Number(car2.price).toLocaleString()}
    </p>
    <p className="text-lg font-semibold">{car2.title}</p>
    <p><strong>Brand:</strong> {car2.brand}</p>
    <p><strong>Model:</strong> {car2.model}</p>
    <p><strong>Year:</strong> {car2.year}</p>
    <p><strong>Body Type:</strong> {car2.bodyType}</p>
    <p><strong>Color:</strong> {car2.color}</p>
    <p><strong>Fuel:</strong> {car2.fuel}</p>
    <p><strong>Transmission:</strong> {car2.transmission}</p>
    <p><strong>Mileage:</strong> {Number(car2.mileage).toLocaleString()} miles</p>
    <p><strong>Location:</strong> {car2.location}</p>
    <p><strong>Description:</strong> {car2.description}</p>
    <p><strong>Seller:</strong> {car2.user?.username} ({car2.user?.email})</p>
    <div className="space-x-2">
      {car2.images?.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Car image ${idx + 1}`}
          className="inline-block h-32 w-48 object-cover rounded"
        />
      ))}
    </div>
  </div>
)}

          </div>

       

        
        </div>
      </div>
    </>
  );
}
