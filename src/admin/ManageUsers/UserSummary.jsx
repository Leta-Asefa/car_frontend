import { FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaUserTie, FaUserAltSlash, FaUserTag } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/auth/getUserSummary/${days}`);
        setSummary(res.data);
      } catch (err) {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [days]);

  if (loading) return <div className="text-center py-8">Loading user summary...</div>;
  if (!summary) return <div className="text-center py-8 text-red-500">Failed to load user summary.</div>;

  const cards = [
    {
      label: "Total Users",
      value: summary.totalUsers,
      icon: <FaUsers className="text-3xl text-violet-600" />, bg: "bg-violet-50",
      onClick: () => navigate("/admin/users", { state: { tab: "all" } })
    },
    {
      label: "Approved Users",
      value: summary.approvedUsers,
      icon: <FaUserCheck className="text-3xl text-green-600" />, bg: "bg-green-50",
      onClick: () => navigate("/admin/users", { state: { tab: "approved" } })
    },
    {
      label: "Suspended Users",
      value: summary.suspendedUsers,
      icon: <FaUserAltSlash className="text-3xl text-yellow-600" />, bg: "bg-yellow-50",
      onClick: () => navigate("/admin/users", { state: { tab: "suspended" } })
    },
    {
        label: "Unapproved",
        value: summary.joinedRecently,
        icon: <FaUserClock className="text-3xl text-blue-600" />, bg: "bg-blue-50",
        onClick: () => navigate("/admin/users", { state: { tab: "unapproved" } })
    },
    {
      label: "Declined Users",
      value: summary.declinedUsers,
      icon: <FaUserTimes className="text-3xl text-red-600" />, bg: "bg-red-50",
      onClick: null
    },
    {
      label: "Sellers",
      value: summary.sellers,
      icon: <FaUserTie className="text-3xl text-indigo-600" />, bg: "bg-indigo-50",
      onClick: null
    },
    {
      label: "Buyers",
      value: summary.buyers,
      icon: <FaUserTag className="text-3xl text-pink-600" />, bg: "bg-pink-50",
      onClick: null
    },
  ];

  // Separate out non-clickable cards
  const clickableCards = cards.filter(card => card.onClick);
  const nonClickableCards = cards.filter(card => !card.onClick);

  return (
    <div className="w-full py-8">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {clickableCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-xl shadow-lg p-6 flex flex-col items-center ${card.bg} transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
            onClick={card.onClick}
          >
            <div className="mb-3">{card.icon}</div>
            <div className="text-3xl font-extrabold text-gray-800 mb-1">{card.value}</div>
            <div className="text-md font-semibold text-gray-600 text-center">{card.label}</div>
          </div>
        ))}
      </div>
      {/* Display non-clickable cards in a non-card, horizontal info style */}
      <div className="flex flex-wrap items-center justify-center gap-10 mt-8">
        {nonClickableCards.map((card, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-transparent p-0">
            <span className="text-3xl">{card.icon}</span>
            <span className="text-3xl font-bold text-violet-700">{card.value}</span>
            <span className="text-lg font-semibold text-gray-700 uppercase tracking-wide">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSummary;