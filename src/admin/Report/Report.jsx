// components/Report.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { FiCalendar } from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Report = () => {
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

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Cars Posted in Last {months} Month{months > 1 && "s"}</h2>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500 text-lg" />
            <input
              type="number"
              min="1"
              max="24"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  );
};

export default Report;
