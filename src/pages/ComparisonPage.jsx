import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { FaMoneyBillAlt, FaCarSide, FaCalendarAlt, FaTags, FaPalette, FaGasPump, FaCogs, FaTachometerAlt, FaMapMarkerAlt, FaUser, FaInfoCircle, FaListAlt, FaCheckCircle } from "react-icons/fa";

export default function ComparisonPage() {
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filteredCars1, setFilteredCars1] = useState([]);
  const [filteredCars2, setFilteredCars2] = useState([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [car1ImageIndex, setCar1ImageIndex] = useState(0);
  const [car2ImageIndex, setCar2ImageIndex] = useState(0);

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

  const renderImageSlider = (images, imageIndex, setImageIndex) => (
    <div className="relative w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      {images && images.length > 0 ? (
        <>
          <img
            src={images[imageIndex]}
            alt={`Car image ${imageIndex + 1}`}
            className="w-full h-64 object-cover rounded-lg"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                ❮
              </button>
              <button
                onClick={() => setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                ❯
              </button>
            </>
          )}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === imageIndex ? 'bg-blue-600' : 'bg-gray-300'} inline-block`}
                onClick={() => setImageIndex(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No image
        </div>
      )}
    </div>
  );

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
                    {car.year} {car.brand} {car.model} {car.title}
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
                    {car.year} {car.brand} {car.model} {car.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Car Images - now as sliders */}
          <div>
            {car1 ? (
              renderImageSlider(car1.images || [], car1ImageIndex, setCar1ImageIndex)
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden w-full h-64 flex items-center justify-center text-gray-400">
                Select a car
              </div>
            )}
          </div>
          <div>
            {car2 ? (
              renderImageSlider(car2.images || [], car2ImageIndex, setCar2ImageIndex)
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden w-full h-64 flex items-center justify-center text-gray-400">
                Select a car
              </div>
            )}
          </div>

          {/* Basic Info - Car 1 */}
          {car1 && (
            <div className="space-y-2 border p-4 rounded shadow bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 text-indigo-600 text-2xl font-bold">
                <FaMoneyBillAlt />
                <span>{Number(car1.price).toLocaleString()} ETB</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <FaCarSide />
                <span>{car1.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2"><FaTags className="text-blue-600" /> {car1.brand}</div>
                <div className="flex items-center gap-2"><FaInfoCircle className="text-blue-600" /> {car1.model}</div>
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-600" /> {car1.year}</div>
                <div className="flex items-center gap-2"><FaTags className="text-blue-600" /> {car1.bodyType}</div>
                <div className="flex items-center gap-2"><FaPalette className="text-blue-600" /> {car1.color}</div>
                <div className="flex items-center gap-2"><FaGasPump className="text-blue-600" /> {car1.fuel}</div>
                <div className="flex items-center gap-2"><FaCogs className="text-blue-600" /> {car1.transmission}</div>
                <div className="flex items-center gap-2"><FaTachometerAlt className="text-blue-600" /> {Number(car1.mileage).toLocaleString()} miles</div>
                <div className="flex items-center gap-2"><FaListAlt className="text-blue-600" /> {car1.vehicleDetails}</div>
                <div className="flex items-center gap-2 col-span-2"><FaMapMarkerAlt className="text-blue-600" /> {car1.location}</div>
                <div className="flex items-center gap-2 col-span-2"><FaListAlt className="text-blue-600" /> Status: {car1.status}</div>
              </div>
              <div className="flex items-center gap-2 mt-2"><FaUser className="text-blue-600" /> {car1.user?.username} <span className="text-xs text-gray-400">({car1.user?.email})</span></div>
              {/* Features */}
              {car1.features && car1.features.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold mb-1 flex items-center gap-2"><FaListAlt className="text-blue-600" /> Features</div>
                  <ul className="grid grid-cols-2 gap-1">
                    {car1.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm gap-2">
                        <FaCheckCircle className="text-green-600" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Safety */}
              {car1.safety && car1.safety.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold mb-1 flex items-center gap-2"><FaListAlt className="text-blue-600" /> Safety</div>
                  <ul className="grid grid-cols-2 gap-1">
                    {car1.safety.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm gap-2">
                        <FaCheckCircle className="text-green-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2 text-gray-700"><FaInfoCircle className="text-blue-600 align-middle mr-1" /> {car1.description}</div>
            </div>
          )}

          {/* Basic Info - Car 2 */}
          <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCarSide className="text-blue-600" />
              {car2 ? `${car2.year} ${car2.brand} ${car2.model}` : "Select a car"}
            </h3>
            {car2 && (
              <>
                <div className="flex items-center gap-2 text-indigo-600 text-2xl font-bold">
                  <FaMoneyBillAlt />
                  <span>{Number(car2.price).toLocaleString()} ETB</span>
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FaCarSide />
                  <span>{car2.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-2"><FaTags className="text-blue-600" /> {car2.brand}</div>
                  <div className="flex items-center gap-2"><FaInfoCircle className="text-blue-600" /> {car2.model}</div>
                  <div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-600" /> {car2.year}</div>
                  <div className="flex items-center gap-2"><FaTags className="text-blue-600" /> {car2.bodyType}</div>
                  <div className="flex items-center gap-2"><FaPalette className="text-blue-600" /> {car2.color}</div>
                  <div className="flex items-center gap-2"><FaGasPump className="text-blue-600" /> {car2.fuel}</div>
                  <div className="flex items-center gap-2"><FaCogs className="text-blue-600" /> {car2.transmission}</div>
                  <div className="flex items-center gap-2"><FaTachometerAlt className="text-blue-600" /> {Number(car2.mileage).toLocaleString()} miles</div>
                  <div className="flex items-center gap-2"><FaListAlt className="text-blue-600" /> {car2.vehicleDetails}</div>
                  <div className="flex items-center gap-2 col-span-2"><FaMapMarkerAlt className="text-blue-600" /> {car2.location}</div>
                  <div className="flex items-center gap-2 col-span-2"><FaListAlt className="text-blue-600" /> Status: {car2.status}</div>
                </div>
                <div className="flex items-center gap-2 mt-2"><FaUser className="text-blue-600" /> {car2.user?.username} <span className="text-xs text-gray-400">({car2.user?.email})</span></div>
                {/* Features */}
                {car2.features && car2.features.length > 0 && (
                  <div className="mt-2">
                    <div className="font-semibold mb-1 flex items-center gap-2"><FaListAlt className="text-blue-600" /> Features</div>
                    <ul className="grid grid-cols-2 gap-1">
                      {car2.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700 text-sm gap-2">
                          <FaCheckCircle className="text-green-600" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Safety */}
                {car2.safety && car2.safety.length > 0 && (
                  <div className="mt-2">
                    <div className="font-semibold mb-1 flex items-center gap-2"><FaListAlt className="text-blue-600" /> Safety</div>
                    <ul className="grid grid-cols-2 gap-1">
                      {car2.safety.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-700 text-sm gap-2">
                          <FaCheckCircle className="text-green-600" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-2 text-gray-700"><FaInfoCircle className="text-blue-600 align-middle mr-1" /> {car2.description}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
