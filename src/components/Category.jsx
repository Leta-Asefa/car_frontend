import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FaCar, FaHistory } from "react-icons/fa";
import { Calendar, CarFront, CarTaxiFrontIcon, CarIcon, Truck, SlidersHorizontal, Check, Gauge, MapPin, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { MdOpenInNew } from "react-icons/md";
import { HiOutlineSearchCircle } from "react-icons/hi";
import { PiVan } from "react-icons/pi";
import AdvancedFilters from "./filters/AdvancedFilters";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import WishlistButton from "./WishlistButton";
import WishlistModal from "./WishlistModal";

const Category = ({ setFilterType, filterType }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setUser, searchResults, setSearchResults } = useAuth();
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    bodyType: "",
    brand: "",
    model: "",
    priceRange: null,
    vehicleDetails: "",
    transmission: "",
    fuelType: "",
    features: [],
    safety: []
  });
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const currentYear = new Date().getFullYear();

  // Wishlist modal state
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [wishlistCars, setWishlistCars] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const paginatedCars = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isModalOpen && selectedCar?.user?._id) {
        try {
          const res = await axios.get(`http://localhost:4000/api/car/recommendations/${user._id}`);
          setRecommendations(res.data);
        } catch {
          setRecommendations([]);
        }
      }
    };
    fetchRecommendations();
  }, [isModalOpen, selectedCar]);

  useEffect(() => {
    const fetchOtherPosts = async () => {
      if (isModalOpen && selectedCar?.user?._id) {
        try {
          const res = await axios.get(`http://localhost:4000/api/car/get_other_posts/${selectedCar.user._id}`);
          setOtherPosts(res.data);
        } catch {
          setOtherPosts([]);
        }
      }
    };
    fetchOtherPosts();
  }, [isModalOpen, selectedCar]);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(`http://localhost:4000/api/auth/${user._id}/search_history`);
          setSearchHistory(response.data);
        } catch {}
      }
    };
    fetchSearchHistory();
  }, [user]);

  const priceRanges = {
    "Under 20000": { min: 0, max: 20000 },
    "20000 - 30000": { min: 20000, max: 30000 },
    "30000 - 40000": { min: 0, max: 40000 },
    "40000+": { min: 40000, max: 100000000 },
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/car/latestcars");
        setSearchResults(response.data);
      } catch {}
    };
    fetchCars();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleApplyFilters = async () => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/api/car/filter", filters);
      setSearchResults(response.data);
      setCurrentPage(1);
    } catch {}
    const availableCarsSection = document.getElementById("available-cars");
    if (availableCarsSection) {
      availableCarsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (filters.bodyType || filters.bodyType === '') {
      handleApplyFilters();
    }
  }, [filters.bodyType]);

  useEffect(() => {
    handleApplyFilters();
  }, [filters.bodyType, filters.vehicleDetails, filters.transmission, filters.fuelType, filters.features, filters.safety]);

  const handleCategoryClick = async (category) => {
    if (category.type === "Any") {
      // Clear all filters
      setFilters({
        bodyType: "",
        brand: "",
        model: "",
        priceRange: null,
        vehicleDetails: "",
        transmission: "",
        fuelType: "",
        features: [],
        safety: []
      });
      setSelectedMake("");
      setSelectedModel("");
      setSelectedPrice("");
      // Fetch all latest cars
      try {
        const response = await axios.get("http://localhost:4000/api/car/latestcars");
        setSearchResults(response.data);
        setCurrentPage(1);
      } catch {}
    } else {
      handleFilterChange(category.filterKey, category.type);
      setSelectedMake("");
      setSelectedModel("");
      setSelectedPrice("");
    }
  };

  const handleCarCardClick = async (car, event) => {
    event.preventDefault();
    setSelectedCar(car);
    setSelectedImageIndex(0);
    setIsModalOpen(true);
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
      } catch {}
    }
  };

  const handleApplyAdvancedFilters = (advancedFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...advancedFilters,
    }));
    handleApplyFilters();
  };

  const handleRecommendationClick = (car) => {
    setSelectedCar(car);
    setSelectedImageIndex(0);
    const modalElement = document.querySelector('.modal-content');
    if (modalElement) {
      modalElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOtherPostClick = (car) => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedCar(car);
      setSelectedImageIndex(0);
      setIsModalOpen(true);
    }, 300);
  };

  const getStatusBadge = (vehicleDetails, year) => {
    let badgeClass = "";
    let label = "";
    if (vehicleDetails?.toLowerCase().includes("new")) {
      badgeClass = "bg-green-100 text-green-800";
      label = "New";
    } else if (vehicleDetails?.toLowerCase().includes("used")) {
      badgeClass = "bg-gray-100 text-gray-800";
      label = "Used";
    } else if (year == currentYear) {
      badgeClass = "bg-blue-100 text-blue-800";
      label = "Recent";
    } else {
      badgeClass = "bg-blue-100 text-blue-800";
      label = vehicleDetails || "Available";
    }
    return (
      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>{label}</span>
    );
  };

  // --- Wishlist logic ---
  const fetchWishlist = async () => {
    if (!user) return;
    setWishlistLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/auth/${user._id}/wishlist`);
      setWishlistCars(res.data || []);
    } catch {
      setWishlistCars([]);
    }
    setWishlistLoading(false);
  };

  const handleOpenWishlist = async () => {
    await fetchWishlist();
    setShowWishlistModal(true);
  };

  const handleRemoveFromWishlist = async (carId) => {
    try {
      await axios.post(`http://localhost:4000/api/auth/${user._id}/wishlist`, { carId });
      setWishlistCars(prev => prev.filter(car => car._id !== carId));
      setUser(prev => ({
        ...prev,
        wishList: prev.wishList?.filter(id => id !== carId)
      }));
    } catch {}
  };

  const handleWishlistCarClick = (car) => {
    setSelectedCar(car);
    setSelectedImageIndex(0);
    setIsModalOpen(true);
    setShowWishlistModal(false);
  };

  const handleToggleFavorite = async (carId, e) => {
    if (e) e.stopPropagation();
    if (!user) return;
    try {
      await axios.post(`http://localhost:4000/api/auth/${user._id}/wishlist`, { carId });
      setUser(prev => ({
        ...prev,
        wishList: prev.wishList?.includes(carId)
          ? prev.wishList?.filter(id => id !== carId)
          : [...prev.wishList, carId]
      }));
    } catch {}
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

      {user?.role==='buyer' && (
        <div className="flex justify-end mb-4 gap-2">
          <WishlistButton onClick={handleOpenWishlist} />
          {searchHistory.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
              title="View Search History"
            >
              <FaHistory className="text-blue-600 text-xl" />
            </button>
          )}
        </div>
      )}

      {showWishlistModal && (
        <WishlistModal
          wishListCars={wishlistCars}
          onClose={() => setShowWishlistModal(false)}
          onRemove={handleRemoveFromWishlist}
          onCarClick={handleWishlistCarClick}
          loading={wishlistLoading}
        />
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
              <FaHistory className="text-blue-600" /> Your Search History
            </h2>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {searchHistory.map((entry, index) => (
                <div
                  key={index}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-gray-800 text-sm shadow hover:shadow-md transition whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    setSelectedCar(entry.carId);
                    setIsModalOpen(true);
                    setShowHistoryModal(false);
                  }}
                >
                  {entry.brand} {entry.model}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="px-6 py-2 bg-red-600 text-gray-50 rounded hover:bg-red-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-wrap flex-row justify-center items-center gap-5">
        {[
          { type: "Any", icon: <FaCar className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "SUV", icon: <FaCar className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Sedan", icon: <CarFront className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Hatchback", icon: <CarTaxiFrontIcon className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Convertible", icon: <CarIcon className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Coupe", icon: <FaCar className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Crossover", icon: <FaCar className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Pickup", icon: <FaCar className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Truck", icon: <Truck className="text-black h-6 w-6" />, filterKey: "bodyType" },
          { type: "Van", icon: <PiVan className="text-black h-6 w-6" />, filterKey: "bodyType" },
        ].map((category, index) => (
          <div
            key={index}
            className={`border p-2 bg-white text-black rounded-xl flex flex-wrap justify-center items-center gap-2 hover:shadow-md hover:bg-slate-100 cursor-pointer ${filters.bodyType === category.type ? 'bg-indigo-100' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.icon}
            <h2 className="font-semibold">{category.type}</h2>
          </div>
        ))}
      </div>

      {/* Dropdown Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto my-10">
        <div className="flex flex-row justify-between items-end gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Brand</option>
              {[
                'Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Jeep',
                'Kia', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes', 'Nissan', 'Porsche',
                'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
              ].map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <select
              value={filters.model}
              onChange={(e) => handleFilterChange("model", e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Model</option>
              {[
                'A4', 'A6', 'Accord', 'Altima', 'Camry', 'C-Class', 'Civic', 'Corolla',
                'Cruze', 'CX-5', 'E-Class', 'Elantra', 'F-150', 'Golf', 'Malibu', 'Mustang',
                'Passat', 'Sentra', 'Sportage', 'Tucson', 'X3', 'X5'
              ].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select
              value={filters.priceRange ? JSON.stringify(filters.priceRange) : ""}
              onChange={(e) => handleFilterChange("priceRange", e.target.value ? JSON.parse(e.target.value) : null)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any Price</option>
              {Object.entries(priceRanges).map(([range, value]) => (
                <option key={range} value={JSON.stringify(value)}>{range}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex-1 px-10 flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              Search
            </button>
          </div>
          <div className="">
            <button
              onClick={() => setIsAdvancedFiltersOpen(true)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
            >
              <SlidersHorizontal className="h-10 w-10 border border-gray-200 rounded-lg p-2" />
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
      <div id="available-cars" className="bg-gray-100 py-10 lg:px-32 px-12  rounded-xl">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">Available Cars</h2>
        {searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-md">
            <HiOutlineSearchCircle className="h-20 w-20 text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No cars found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {paginatedCars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative"
                  onClick={(e) => handleCarCardClick(car, e)}
                >
                  {/* Favorite Button */}
                  {user?.role==='buyer' && (
                    <div
                      className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition-all duration-300 cursor-pointer"
                      onClick={e => handleToggleFavorite(car._id, e)}
                    >
                      {user?.wishList?.includes(car._id) ? (
                        <AiFillHeart className="text-red-500 text-xl" />
                      ) : (
                        <AiOutlineHeart className="text-gray-500 text-xl" />
                      )}
                    </div>
                  )}
                  {/* Status Badge */}
                  {getStatusBadge(car.vehicleDetails, car.year)}
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
                          e.stopPropagation();
                          handleCarCardClick(car, e);
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
            {searchResults.length !== 0 && (
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-all duration-7000 ease-in-out"
          style={{ opacity: isModalOpen ? 1 : 0, visibility: isModalOpen ? 'visible' : 'hidden' }}
        >
          <div
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-7000 ease-in-out"
            style={{ transform: isModalOpen ? 'translateY(0)' : 'translateY(-20px)', opacity: isModalOpen ? 1 : 0 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCar.title}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
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
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Safety</h3>
                    <ul className="grid grid-cols-2 gap-6">
                      {selectedCar?.safety?.map((safety, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          {safety}
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
                        e.stopPropagation();
                        if (!user) {
                          setShowLoginModal(true);
                        } else {
                          try {
                            await axios.get(
                              `http://localhost:4000/api/chat/create_conversations/${user._id}/${selectedCar.user._id}`
                            );
                            navigate(`/messages/${selectedCar.user._id}`);
                          } catch {
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
                              onClick={() => setShowLoginModal(false)}
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
                      {(selectedCar?.user?.socialMedia || [{ name: "Telegram", link: 'https://' }]).map((social, index) => (
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
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Brand</span>
                        </div>
                        <span className="font-medium">{selectedCar.brand}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Body Type</span>
                        </div>
                        <span className="font-medium">{selectedCar.bodyType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Model</span>
                        </div>
                        <span className="font-medium">{selectedCar.model}</span>
                      </div>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                          <span>Vehicle Details</span>
                        </div>
                        <span className="font-medium">{selectedCar.vehicleDetails}</span>
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
                        onClick={() => handleRecommendationClick(car)}
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
              {otherPosts.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4">Seller's Other Posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {otherPosts.map((car) => (
                      <div
                        key={car._id}
                        className="border rounded-lg p-3 shadow hover:shadow-md cursor-pointer transition"
                        onClick={() => handleOtherPostClick(car)}
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
