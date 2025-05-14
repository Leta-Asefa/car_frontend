import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import {
  FaCarSide,
  FaGasPump,
  FaRoad,
  FaPalette,
  FaCogs,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaUser,
  FaInfoCircle,
  FaTags,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ConfirmationModal from "../../components/common/ConfirmationModal";


const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("unapproved");
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedCar.images.length - 1 : prev - 1
    );
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedCar.images.length - 1 ? 0 : prev + 1
    );
  };
  
  useEffect(() => {
    const fetchCars = async () => {
      let endpoint;
      if (activeTab === "all") {
        endpoint = "http://localhost:4000/api/car";
      } else if (activeTab === "approved") {
        endpoint = "http://localhost:4000/api/car/approved";
      } else {
        endpoint = "http://localhost:4000/api/car/unapproved";
      }
      const res = await axios.get(endpoint);
      setCars(res.data);
    };
    fetchCars();
  }, [activeTab]);

  const handleAction = async (carId, action) => {
    try {
      await axios.post("http://localhost:4000/api/car/approve", { carId, action });
      setCars((prev) => prev.filter((car) => car._id !== carId));
      setSelectedCar(null);

      if (action === "approve") {
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000); // Show confirmation modal for 3 seconds
      }
    } catch (err) {
      alert("Error performing action");
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Cars</h1>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "unapproved" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("unapproved")}
          >
            Unapproved Cars
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "approved" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Cars
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("all")}
          >
            All Cars
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by title or brand..."
          className="mb-4 p-2 border rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredCars.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No cars match your search.</div>
        ) : (
          <div className="overflow-x-auto max-h-[60vh]">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase text-left sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Status</th>
                  {(activeTab === "unapproved" || activeTab === "all") && (
                    <th className="py-3 px-4 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredCars.map((car) => (
                  <tr
                    key={car._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCar(car)}
                  >
                    <td className="py-2 px-4">{car.title}</td>
                    <td className="py-2 px-4">{car.brand}</td>
                    <td className="py-2 px-4">
                      {car.user?.name}
                      <br />
                      <span className="text-xs text-gray-500">{car.user?.email}</span>
                    </td>
                    <td className="py-2 px-4 capitalize">{car.status}</td>
                    {activeTab === "unapproved" && (
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(car._id, "approve");
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(car._id, "decline");
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </td>
                    )}
                    {activeTab === "all" && car.status === "unapproved" && (
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(car._id, "approve");
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(car._id, "decline");
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCar && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
      {/* Close Button */}
      <button
        onClick={() => setSelectedCar(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
      >
        <MdCancel />
      </button>

      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaCarSide className="text-blue-600" />
        {selectedCar.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Car Info */}
        <div className="space-y-3 text-gray-700 text-sm">
          <p className="flex items-center gap-2">
            <FaTags className="text-gray-500" /> <strong>Brand:</strong> {selectedCar.brand}
          </p>
          <p className="flex items-center gap-2">
            <FaInfoCircle className="text-gray-500" /> <strong>Model:</strong> {selectedCar.model}
          </p>
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" /> <strong>Year:</strong> {selectedCar.year}
          </p>
          <p className="flex items-center gap-2">
            <FaGasPump className="text-gray-500" /> <strong>Fuel:</strong> {selectedCar.fuel}
          </p>
          <p className="flex items-center gap-2">
            <FaRoad className="text-gray-500" /> <strong>Mileage:</strong> {selectedCar.mileage} km
          </p>
          <p className="flex items-center gap-2">
            <FaPalette className="text-gray-500" /> <strong>Color:</strong> {selectedCar.color}
          </p>
          <p className="flex items-center gap-2">
            <FaCogs className="text-gray-500" /> <strong>Transmission:</strong> {selectedCar.transmission}
          </p>
          <p className="flex items-center gap-2">
            <FaMoneyBillAlt className="text-gray-500" /> <strong>Price:</strong> ${selectedCar.price}
          </p>
          <p className="flex items-center gap-2">
            <FaInfoCircle className="text-gray-500" /> <strong>Status:</strong> {selectedCar.status}
          </p>
          <p className="flex items-center gap-2">
            <FaUser className="text-gray-500" /> <strong>Posted by:</strong> {selectedCar.user?.username} ({selectedCar.user?.phoneNumber})
          </p>
          <p className="flex items-center gap-2">
            <FaTags className="text-gray-500" /> <strong>Body Type:</strong> {selectedCar.bodyType}
          </p>
          <p className="flex items-center gap-2">
            <FaTags className="text-gray-500" /> <strong>Vehicle Details:</strong> {selectedCar.vehicleDetails}
          </p>
          <div>
            <p className="font-semibold">Description:</p>
            <p className="text-gray-600">{selectedCar.description}</p>
          </div>
          {/* Features */}
          <div>
            <p className="font-semibold mb-1">Features:</p>
            <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-x-4">
              {selectedCar.features && selectedCar.features.length > 0 ? (
                selectedCar.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))
              ) : (
                <li>No features listed</li>
              )}
            </ul>
          </div>
          {/* Safety */}
          <div>
            <p className="font-semibold mb-1">Safety:</p>
            <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-x-4">
              {selectedCar.safety && selectedCar.safety.length > 0 ? (
                selectedCar.safety.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li>No safety features listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right: Image Slider */}
        <div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow border border-gray-200 mb-4">
            <img
              src={selectedCar.images[currentImageIndex]}
              alt={`car-${currentImageIndex}`}
              className="w-full h-full object-cover"
            />
            {/* Arrows */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <FaArrowRight />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 w-full flex justify-center gap-2">
              {selectedCar.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-blue-600" : "bg-gray-400"} bg-opacity-80`}
                ></button>
              ))}
            </div>
          </div>
          {/* Location */}
          <div className="bg-gray-50 rounded-lg p-4 shadow text-gray-700 mb-4">
            <p className="font-semibold mb-1">Location:</p>
            <p>{selectedCar.location}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        {selectedCar.status !== "approved" && (
          <>
            <button
              onClick={() => handleAction(selectedCar._id, "approve")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(selectedCar._id, "decline")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Decline
            </button>

        <button
          onClick={() => setSelectedCar(null)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
          </>
        )}
      </div>
    </div>
  </div>
)}

      {showConfirmation && (
        <ConfirmationModal message="Car approved successfully!" />
      )}

    </Layout>
  );
};

export default ManageCars;
