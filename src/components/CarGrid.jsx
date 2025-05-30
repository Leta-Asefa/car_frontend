import React, { useState } from "react";
import CarCard from "./CarCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaSearch } from "react-icons/fa";

export default function CarGrid({ listings, itemsPerPage = 6, onViewDetails }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = listings.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-10">
      {/* Search Bar */}
      <div className="flex md:hidden justify-center items-center mb-10">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Search cars..."
          />
          <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-4 mx-4 ">
        {currentListings.map((listing) => (
          <CarCard
            className="w-full sm:w-72 md:w-80 lg:w-96 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl cursor-pointer group relative"
            data-aos="fade-up"
            data-aos-delay={`${listing.id * 100}`}
            key={listing.id}
            listing={listing}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {listings.length > itemsPerPage && (
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
    </div>
  );
}
