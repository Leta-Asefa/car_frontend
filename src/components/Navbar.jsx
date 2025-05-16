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
  const { user, searchResults, setSearchResults } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [query, setQuery] = useState("");
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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getLatestCars = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/car/latestcars");
      console.log("get latest cars ",response.da)
      return response.data || []
    } catch (error) {
      console.error("Error fetching filtered cars:", error);
    }
  };
  useEffect(() => {
    const fetchCars = async () => {
      if (!query.trim()) {
        try {
          const response = await axios.get("http://localhost:4000/api/car/latestcars");
          console.log("get latest cars ",response.data)
          setSearchResults(response.data)
        } catch (error) {
          console.error("Error fetching filtered cars:", error);
        }
        return;
      }
      try {
        const res = await axios.get(`http://localhost:4000/api/car/search/${query}`);
        setSearchResults(res.data || getLatestCars());
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([] || getLatestCars());
      }
    };

    const timeout = setTimeout(fetchCars, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="mx-auto flex justify-between items-center px-2 py-4 text-xs">
        {/* Logo */}
        <div className="flex gap-2 text-2xl font-bold text-blue-600">
          <Car className="h-8 w-8 text-blue-700" />
          <Link to="/" onClick={handleScrollToTop}>CarHub</Link>
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
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            onClick={() => {
              const availableCarsSection = document.getElementById("available-cars");
              if (availableCarsSection) {
                availableCarsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Search
          </button>
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


    </header>
  );
};

export default Navbar;
