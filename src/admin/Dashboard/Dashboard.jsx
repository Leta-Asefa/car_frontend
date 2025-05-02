import axios from "axios";
import Layout from "../ManageCars/Layout";
import { useEffect, useState } from "react";
const Dashboard = () => {

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axios.get("http://localhost:4000/api/car/summary");
      setSummary(res.data);
    };
    fetchSummary();
  }, []);

  if (!summary) return <div className="text-center p-6">Loading summary...</div>;


  return (
    <Layout>
     <div className="p-6 space-y-6 h-full" >
      <h1 className="text-2xl font-bold mb-4">Car Summary Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500">Total Cars</p>
          <p className="text-2xl font-semibold">{summary.totalCars}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500">Avg. Price</p>
          <p className="text-2xl font-semibold">${summary.averagePrice}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
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
   
    </div>
    </Layout>
  );
};


export default Dashboard;