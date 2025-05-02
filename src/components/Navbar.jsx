import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, MessageSquare } from "lucide-react";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";
import ProfileDropdown from "./common/ProfileDropdown";
import axios from "axios";

const Navbar = ({ children }) => {
  const [nav, setNav] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleNavToggle = () => setNav(!nav);
  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };
  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  useEffect(() => {
    const fetchCars = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:4000/api/car/search/${query}`);
        setSearchResults(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    };

    const timeout = setTimeout(fetchCars, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="mx-auto flex justify-between items-center px-2 py-4 text-xs">
        {/* Logo */}
        <div className="flex gap-2 text-2xl font-bold text-blue-600">
          <Car className="h-8 w-8 text-blue-700" />
          <Link to={"/"}>CarHub</Link>
        </div>

        {/* Search Bar */}
        <div className="relative hidden lg:flex items-center w-[35%]">
          <input
            type="text"
            placeholder="Search Make, Model, Year..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
            Search
          </button>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border z-50 max-h-60 overflow-y-auto shadow-lg">
              {searchResults.map((car) => {
                const matchedField = ["title", "brand", "model", "year"].find((field) =>
                  car[field]?.toLowerCase().includes(query.toLowerCase())
                );
                return (
                  <li
                    key={car._id}
                    onClick={() => {
                      setSelectedCar(car);
                      setSearchResults([]);
                      setQuery("");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {car.title}
                    {matchedField && (
                      <span className="text-gray-500">
                        {" "}
                        ({matchedField}: {car[matchedField]})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}




        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 items-center">
          {user?.role === "admin" && (
            <Link to={"/admin/dashboard"} className="text-gray-700 hover:text-blue-600">
              Admin
            </Link>
          )}
          <Link to={"/"} className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to={"/carComparison"} className="text-gray-700 hover:text-blue-600">Compare</Link>
          <Link to={"/about"} className="text-gray-700 hover:text-blue-600">About</Link>
          <Link to={"/services"} className="text-gray-700 hover:text-blue-600">Services</Link>
          <Link to={"/contact"} className="text-gray-700 hover:text-blue-600">Contact</Link>
          <Link to={"/faq"} className="text-gray-700 hover:text-blue-600">FAQ</Link>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {user?.role === "seller" && (
              <Link to={"/mylistings"} className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                My Listings
              </Link>
            )}
            {user && (
              <Link to={"/messages/null"} className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                <div className="flex items-center space-x-4">
                  <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    Messages
                  </button>
                </div>
              </Link>
            )}
            <ProfileDropdown onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
          </div>

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
          <RegisterModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />

          {user?.role === "seller" && (
            <Link to={"/carListing"} className="bg-blue-600 text-white px-2 py-2 rounded-md hover:bg-blue-700 text-xs">
              Add New Car
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={handleNavToggle}>
            {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {nav && (
        <div className="md:hidden bg-white shadow-md py-4 px-6">
          <div className="flex flex-col gap-4">
            <Link to={"/admin/dashboard"} className="text-gray-700 hover:text-blue-600">Admin</Link>
            <Link to={"/"} className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to={"/carComparison"} className="text-gray-700 hover:text-blue-600">Compare</Link>
            <Link to={"/about"} className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to={"/services"} className="text-gray-700 hover:text-blue-600">Services</Link>
            <Link to={"/contact"} className="text-gray-700 hover:text-blue-600">Contact</Link>
            <Link to={"/faq"} className="text-gray-700 hover:text-blue-600">FAQ</Link>
            <ProfileDropdown onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
            {user?.role === "seller" && (
              <Link to={"/mylistings"} className="text-gray-700 hover:text-blue-600">My Listings</Link>
            )}
            {user && (
              <>
                <Link to={"/messages/null"} className="text-gray-700 hover:text-blue-600">Messages</Link>
                <Link to={"/carListing"} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-center font-bold">
                  Sell Your Car Easily
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Car Details Modal */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCar.year} {selectedCar.brand} {selectedCar.model}
                </h2>
                <button
                  onClick={() => setSelectedCar(null)}
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
                      {["Chat With The Seller"].map((platform) => (
                        <button
                          key={platform}
                          className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50"
                          onClick={async () => {
                            if (!user)
                              alert("Please login to send a message")
                            else {

                              console.log("IDS ", user._id, selectedCar.user._id);

                              const res = await axios.get(
                                `http://localhost:4000/api/chat/create_conversations/${user._id}/${selectedCar.user._id}`
                              );

                              navigate(`/messages/${selectedCar.user._id}`);


                            }

                          }}
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
    </header>
  );
};

export default Navbar;
