import React from "react";
import { AiFillHeart } from "react-icons/ai";

const WishlistModal = ({
  wishListCars,
  onClose,
  onRemove,
  onCarClick,
  loading,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-lg w-full text-center max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
        <AiFillHeart className="text-red-500" /> Your Wishlist
      </h2>
      {loading ? (
        <div className="py-8 text-gray-500">Loading...</div>
      ) : wishListCars.length === 0 ? (
        <div className="py-8 text-gray-500">No cars in your wishlist.</div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {wishListCars.map((car) => (
            <div
              key={car._id}
              className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 shadow cursor-pointer hover:bg-gray-200"
              onClick={() => onCarClick(car)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={car.images?.[0]}
                  alt={car.brand}
                  className="w-16 h-12 object-cover rounded"
                />
                <span className="font-semibold text-gray-800">
                  {car.brand} {car.model}
                </span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onRemove(car._id);
                }}
                className="text-red-500 hover:text-red-700 px-2"
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onClose}
        className="px-6 py-2 bg-red-600 text-gray-50 rounded hover:bg-red-400"
      >
        Close
      </button>
    </div>
  </div>
);

export default WishlistModal;