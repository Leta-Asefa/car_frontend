import React from "react";
import { AiOutlineHeart } from "react-icons/ai";

const WishlistButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-red-100 transition"
    title="View Wishlist"
  >
    <AiOutlineHeart className="text-red-500 text-xl" />
  </button>
);

export default WishlistButton;