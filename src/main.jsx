import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import ComparisonPage from "./pages/ComparisonPage.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";
import CarListing from "./components/CarListing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./admin/Dashboard/Dashboard.jsx";
import ManageCars from "./admin/ManageCars/ManageCars.jsx";
import Logout from "./admin/Logout/Logout.jsx";
import MyListing from "./components/MyListing.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import Message from "./components/Message.jsx";
import ManageUsers from "./admin/ManageUsers/ManageUsers.jsx";
import Layout from "./admin/ManageCars/Layout.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
// import ManageUsers from "./admin/ManageUsers/ManageUsers.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/carComparison",
    element: <ComparisonPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "/carListing",
    element: <CarListing />,
  },
  {
    path: "/messages/:receiverId",
    element: <Message />,
  },
  {
    path: "/admin",
    element: <AdminLayout />, // This renders Sidebar and <Outlet />
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "cars", element: <ManageCars /> },
      { path: "users", element: <ManageUsers /> },
      { path: "logout", element: <Logout /> },
    ]
  },
  {
    path: "/mylistings",
    element:<MyListing/>,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SocketContextProvider>
        <RouterProvider router={router} />
      </SocketContextProvider>
    </AuthProvider>
  </StrictMode>
);
