import axios from "axios";
import Layout from "./Layout";
import { FiCalendar } from "react-icons/fi";
import { FaCarSide, FaTags, FaMoneyBillWave } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";
import UserSummary from "../ManageUsers/UserSummary";
const Dashboard = () => {

  const [summary, setSummary] = useState(null);
  const [months, setMonths] = useState(6);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (selectedMonths) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/car/summary/${selectedMonths}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(months);
  }, [months]);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axios.get("http://localhost:4000/api/car/summary");
      setSummary(res.data);
    };
    fetchSummary();
  }, []);

  if (!summary) return <div className="text-center p-6">Loading summary...</div>;


  return (
      <div className="p-6 space-y-6 h-full" >
        <h1 className="text-2xl font-bold mb-4">Car Summary Dashboard</h1>
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded-lg flex items-center gap-4">
            <FaCarSide className="text-3xl text-blue-500" />
            <div>
              <p className="text-gray-500">Total Cars</p>
              <p className="text-2xl font-semibold">{summary.totalCars}</p>
            </div>
          </div>

          <div className="p-4 bg-white shadow rounded-lg flex items-center gap-4">
            <FaMoneyBillWave className="text-3xl text-green-500" />
            <div>
              <p className="text-gray-500">Avg. Price</p>
              <p className="text-2xl font-semibold">${summary.averagePrice}</p>
            </div>
          </div>

          <div className="p-4 bg-white shadow rounded-lg flex items-center gap-4">
            <FaTags className="text-3xl text-purple-500" />
            <div>
              <p className="text-gray-500">Top Brands</p>
              <ul className="text-sm mt-2">
                {summary.carsByBrand.slice(0, 3).map((brand) => (
                  <li key={brand._id}>
                    {brand._id} — <span className="font-semibold">{brand.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Latest Cars</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 border-b">
              <tr>
                <th className="py-2">Title</th>
                <th>Brand</th>
                <th>Year</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {summary.latestCars.map((car) => (
                <tr key={car._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{car.title}</td>
                  <td>{car.brand}</td>
                  <td>{car.year}</td>
                  <td>${car.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Graph Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
          {/* Cars by Brand Graph */}
          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">All Posted Cars by Brand</h2>
            <div className="w-full h-64 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                {summary.carsByBrand.slice(0, 6).map((brand, idx) => {
                  const max = Math.max(...summary.carsByBrand.map(b => b.count));
                  const barHeight = (brand.count / max) * 150;
                  return (
                    <g key={brand._id}>
                      <rect
                        x={30 + idx * 60}
                        y={180 - barHeight}
                        width={40}
                        height={barHeight}
                        fill="#7c3aed"
                      />
                      <text
                        x={50 + idx * 60}
                        y={195}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#333"
                      >
                        {brand._id}
                      </text>
                      <text
                        x={50 + idx * 60}
                        y={170 - barHeight}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#333"
                      >
                        {brand.count}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700 mb-1 flex items-center gap-2">
                  <FiCalendar className="text-blue-500" />
                  Cars Posted in Last {months} Month{months > 1 && "s"}
                </h2>
                <div className="h-1 w-16 bg-blue-200 rounded-full mb-2"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Show</span>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="border-2 border-blue-200 rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-700 font-semibold"
                />
                <span className="text-gray-500">months</span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-60">
                <span className="text-blue-400 font-semibold">Loading...</span>
              </div>
            ) : data.length === 0 ? (
              <div className="flex justify-center items-center h-60">
                <span className="text-gray-400 font-semibold">No data available</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                  <XAxis dataKey="month" tick={{ fill: "#3b82f6", fontWeight: 500 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#3b82f6", fontWeight: 500 }} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #dbeafe", borderRadius: 8 }}
                    labelStyle={{ color: "#3b82f6", fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: "#bfdbfe", stroke: "#3b82f6", strokeWidth: 3 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <UserSummary />
      </div>
  );
};


export default Dashboard;