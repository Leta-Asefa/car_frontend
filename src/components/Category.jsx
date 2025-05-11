import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FaCar, FaMapMarkerAlt, FaMoneyBillWave, FaCommentDots } from "react-icons/fa";
import { Calendar, Car, Gauge, MapPin, ChevronLeft, ChevronRight, Phone, MessageCircle, CarFront, CarTaxiFrontIcon, CarIcon, Truck, SlidersHorizontal } from "lucide-react";
import { MdOpenInNew } from "react-icons/md";
import { HiOutlineSearchCircle } from "react-icons/hi";
import { FaCarBattery } from "react-icons/fa6";
import { PiVan } from "react-icons/pi";
import { GiOldWagon } from "react-icons/gi";
import AdvancedFilters from "./filters/AdvancedFilters";

const Category = ({ setFilterType, filterType }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user,searchResults,setSearchResults } = useAuth()
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginatedCars = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isModalOpen && selectedCar?.user?._id) {
        try {
          const res = await axios.get(`http://localhost:4000/api/car/recommendations/${user._id}`);
          console.log("Recommendations: ", res.data);
          setRecommendations(res.data);
        } catch (err) {
          console.error("Error fetching recommendations:", err);
          setRecommendations([]);
        }
      }
    };

    fetchRecommendations();
  }, [isModalOpen, selectedCar]);


  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(`http://localhost:4000/api/auth/${user._id}/search_history`);
          console.log("Search History: ", response.data);
          setSearchHistory(response.data);
        } catch (error) {
          console.error("Error fetching search history:", error);
        }
      }
    };

    fetchSearchHistory();
  }, [user]);


  const priceRanges = {
    "Under 20000": { min: 0, max: 20000 },
    "20000 - 30000": { min: 20000, max: 30000 },
    "30000 - 40000": { min: 30000, max: 40000 },
    "40000+": { min: 40000, max: 100000000 },
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/car/latestcars");
        console.log("latest cars: ", response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching filtered cars:", error);
      }
    };
    fetchCars()
  }, [])



  const handleApplyFilters = async () => {
    const filters = {
      bodyType: filterType || null,
      brand: selectedMake || null,
      model: selectedModel || null,
      priceRange: selectedPrice ? priceRanges[selectedPrice] : null,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/car/filter", filters);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching filtered cars:", error);
    }
  };

  const handleCarClick = async (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
    console.log(car);
    if (user && user._id) {
      try {
        await axios.post(`http://localhost:4000/api/auth/${user._id}/search_history`, {
          brand: car.brand,
          model: car.model,
          location: car.location,
          year: car.year,
          ownerId: car.user._id,
          carId: car._id,
          date: new Date()
        });
      } catch (error) {
        console.error("Failed to save search history:", error);
      }
    }
  };

  const handleApplyAdvancedFilters = (filters) => {
    console.log("Applied Advanced Filters:", filters);
    // Handle advanced filters logic here
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
        Browse Cars By Body Type
      </h2>

      {user && searchHistory.length > 0 && (
        <div className="bg-white p-2 rounded-xl shadow-lg my-4  mx-auto">
          <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">Your Search History</h2>

          <div className="flex flex-wrap gap-2 justify-center">
            {searchHistory.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-gray-800 text-sm shadow hover:shadow-md transition whitespace-nowrap"
                onClick={() => {
                  setSelectedCar(entry.carId);
                  setIsModalOpen(true);
                }}
              >
                {entry.brand} {entry.model}
              </div>
            ))}
          </div>

        </div>
      )}
      

      {/* Categories */}
      <div className="flex flex-wrap flex-row justify-center items-center gap-5">
          {[
            { type: "SUV", icon: <FaCar className="text-black h-6 w-6" /> },
            { type: "Sedan", icon: <CarFront className="text-black h-6 w-6" /> },
            { type: "Hatchback", icon: <CarTaxiFrontIcon className="text-black h-6 w-6" /> },
            { type: "Convertible", icon: <CarIcon className="text-black h-6 w-6" /> },
            { type: "Coupe", icon: <FaCar className="text-black h-6 w-6" /> },
            { type: "Crossover", icon: <FaCar className="text-black h-6 w-6" /> },
            { type: "Pickup", icon: <FaCar className="text-black h-6 w-6" /> },
            { type: "Truck", icon: <Truck className="text-black h-6 w-6" /> },
            { type: "Van", icon: <PiVan className="text-black h-6 w-6" /> },
          ].map((category, index) => (
            <div
              key={index}
              className="border p-4 bg-white text-black rounded-xl flex flex-wrap justify-center items-center gap-2 hover:shadow-md hover:bg-slate-100 cursor-pointer"
              onClick={() => {
                setFilterType(category.type);
                setSelectedMake("");
                setSelectedModel("");
                setSelectedPrice("");
                handleApplyFilters();
              }}
            >
              {category.icon}
              <h2 className="font-semibold">{category.type}</h2>
            </div>
          ))}
        </div>




      {/* Dropdown Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto my-10">
        <div className="flex flex-row justify-between gap-3">
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


          <div className="md:col-span-2 flex-1 px-10 flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              Apply Filters
            </button>
        </div>

        <div className="flex justify-end mb-4 ">
          <button
            onClick={() => setIsAdvancedFiltersOpen(true)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
        <AdvancedFilters
          isOpen={isAdvancedFiltersOpen}
          onClose={() => setIsAdvancedFiltersOpen(false)}
          onApplyFilters={handleApplyAdvancedFilters}
        />

        </div>

        
      </div>





      {/* Filter Results */}
      <div className="bg-gray-100 py-10 lg:px-32 px-12  rounded-xl">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Available Cars</h2>
          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-md">
            <HiOutlineSearchCircle className="h-20 w-20 text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No cars found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                {paginatedCars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative"
                    onClick={() => handleCarClick(car)}
                  >


                    <img
                      src={car.images?.[0]}
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
                      <div className="mt-4 flex justify-between items-center gap-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          {car.price.toLocaleString()} ETB
                        </span>
                        <h3
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering handleCarClick
                            handleCarClick(car);
                          }}
                          className="text-md bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-md flex items-center gap-1"
                        >
                          View Details
                          <MdOpenInNew />
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length > itemsPerPage && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
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
                  className="text-gray-400 hover:text-red-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Images */}
                <div>
                  <div className="mt-6 relative overflow-hidden">
                    <div
                      className="flex transition-transform duration-300"
                      style={{
                        transform: `translateX(-${selectedImageIndex * 100}%)`,
                      }}
                    >
                      {selectedCar.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedCar.brand} ${selectedCar.model}`}
                          className="w-full h-96 object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => Math.max(prev - 1, 0))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ❮
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => Math.min(prev + 1, selectedCar.images.length - 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ❯
                    </button>
                  </div>

                  <div className="flex mt-4 gap-2">
                    {selectedCar.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-16 w-16 object-cover border-2 rounded ${index === selectedImageIndex
                          ? "border-blue-500"
                          : "border-gray-200"
                          } cursor-pointer ${index !== selectedImageIndex ? "opacity-50 blur-sm" : ""
                          }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedCar.description}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="grid grid-cols-2 gap-6">
                      {selectedCar?.features?.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 py-6 px-5 rounded-lg">
                    <h3 className="text-3xl font-bold text-indigo-600  mb-2">
                      {selectedCar.price.toLocaleString()} ETB
                    </h3>
                    <button
                      className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mt-4"
                      onClick={async (e) => {
                        e.stopPropagation(); // prevent triggering handleCarClick
                        if (!user) {
                          setShowLoginModal(true);
                        } else {
                          try {
                            await axios.get(
                              `http://localhost:4000/api/chat/create_conversations/${user._id}/${selectedCar.user._id}`
                            );
                            navigate(`/messages/${selectedCar.user._id}`);
                          } catch (error) {
                            console.error("Failed to start chat:", error);
                            alert("Could not create chat.");
                          }
                        }
                      }}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat Now
                    </button>
                    {showLoginModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Login Required</h2>
                            <button
                              onClick={() => {
                                setShowLoginModal(false);
                               
                              }}
                              className="text-gray-400 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-gray-600 mb-4">
                          You can not send messages while your are logged out.
                          </p>
                        
                        </div>
                      </div>
                    )}
                    <h1 className="font-bold text-center py-4 text-blue-700 text-2xl">
                      Contact Seller Via
                    </h1>
                    <div className="flex justify-center items-center flex-wrap gap-2">
                      {(user?.links || [{ name: "Telegram", link: 'https://' }]).map((social, index) => (
                        <a
                          key={index}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center flex-wrap items-center border border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          {social.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Year</span>
                        </div>
                        <span className="font-medium">{selectedCar.year}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Gauge className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Mileage</span>
                        </div>
                        <span className="font-medium">
                          {selectedCar.mileage.toLocaleString()} miles
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Location</span>
                        </div>
                        <span
                          className="font-medium text-xs max-w-[150px] truncate"
                          title={selectedCar.location}
                        >
                          {selectedCar.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Color</span>
                        </div>
                        <span className="font-medium">{selectedCar.color}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Fuel</span>
                        </div>
                        <span className="font-medium">{selectedCar.fuel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Transmission</span>
                        </div>
                        <span className="font-medium">{selectedCar.transmission}</span>
                      </div>
                    </div>
                  </div>


                </div>
              </div>

              {recommendations.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4">You Might Also Like</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recommendations.map((car) => (
                      <div
                        key={car._id}
                        className="border rounded-lg p-3 shadow hover:shadow-md cursor-pointer transition"
                        onClick={() => {
                          setSelectedCar(car);
                          setSelectedImageIndex(0); // Reset image index
                        }}
                      >
                        <img
                          src={car.images?.[0]}
                          alt={car.name}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                        <h4 className="text-lg font-bold">{car.brand} {car.model}</h4>
                        <p className="text-gray-600">${car.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Category;
