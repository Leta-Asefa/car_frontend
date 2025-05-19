import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../Data/mockData";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import InfoModal from "../components/InfoModal"; // Add this import at the top if not present
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = Cookies.get("token");

    return token ? jwtDecode(token) : null;
  });

  const [searchResults,setSearchResults]=useState([])
  const [modal, setModal] = useState({ open: false, message: "" });

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log("Login succewss", res);

      if (res?.data?.status === 'unapproved') {
        setModal({ open: true, message: "Your account is not approved yet. please wait patietly the approval may take upto 2 days." });
        return false;
      }
      if (res?.data?.status === 'declined') {
        setModal({ open: true, message: "Your account is declined by the admin" });
        return false;
      }

      if (res?.data?._id) {
        setUser(res.data)
        return true
      }

    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    const res = await axios.get("http://localhost:4000/api/auth/logout", {
      withCredentials: true,
    });

    if (res.data.message) {
      setUser(null);
      return true
    }

  };

  const register = async (email, password, name, role, phoneNumber) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          email,
          password,
          username: name,
          role,
          phoneNumber
        },
        { withCredentials: true }
      );
console.log("response from register", res);

      if (res?.data?.status === 'unapproved') {
        setModal({ open: true, message: "Your account is not approved yet. please wait patietly the approval may take upto 2 days." });
        return false
      }
      if (res?.data?.status === 'declined') {
        setModal({ open: true, message: "Your account is declined by the admin" });
        return false
      }

      if (res?.data?._id) {
        setUser(res.data)
        return true
      }

    } catch (err) {
      console.error("Register error:", err.response);
      throw err; // Re-throw for caller to handle
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register,searchResults,setSearchResults }}>
      {children}
      <InfoModal
        open={modal.open}
        message={modal.message}
        onClose={() => setModal({ open: false, message: "" })}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
