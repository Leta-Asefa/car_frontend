import Sidebar from "../pages/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 p-5 bg-gray-100 overflow-y-auto h-screen">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;