import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import { FaUser, FaEnvelope, FaCheck, FaTimes, FaUserShield, FaPhone, FaDotCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useLocation } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || "unapproved");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [tab]);

  const fetchUsers = async () => {
    let url;
    if (tab === "all") {
      url = "http://localhost:4000/api/auth/all";
    } else if (tab === "approved") {
      url = "http://localhost:4000/api/auth/approved";
    } else if (tab === "suspended") {
      url = "http://localhost:4000/api/auth/suspended";
    } else {
      url = "http://localhost:4000/api/auth/unapproved";
    }
    const res = await axios.get(url);
    setUsers(res.data);
  };

  const handleApproval = async (userId, action) => {
    try {
      await axios.post("http://localhost:4000/api/auth/approve", {
        userId,
        action,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, status: action === "approve" ? "approved" : action === "decline" ? "declined" : u.status }
            : u
        )
      );
      setSelectedUser((prev) =>
        prev && prev._id === userId
          ? { ...prev, status: action === "approve" ? "approved" : action === "decline" ? "declined" : prev.status }
          : prev
      );
    } catch (err) {
      alert("Action failed.");
    }
  };

  const handleSuspend = async (userId, action) => {
    try {
      await axios.post("http://localhost:4000/api/auth/suspend", { userId, action });
      if (action === "suspend") {
        if (tab === "approved") {
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          setSelectedUser(null);
        } else {
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId
                ? { ...u, status: "suspended" }
                : u
            )
          );
          setSelectedUser((prev) =>
            prev && prev._id === userId
              ? { ...prev, status: "suspended" }
              : prev
          );
        }
      } else if (action === "unsuspend") {
        if (tab === "suspended") {
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          setSelectedUser(null);
        } else {
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId
                ? { ...u, status: "approved" }
                : u
            )
          );
          setSelectedUser((prev) =>
            prev && prev._id === userId
              ? { ...prev, status: "approved" }
              : prev
          );
        }
      }
    } catch (err) {
      alert("Suspend/Unsuspend failed.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="p-6 ">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b">
          {[
            { key: "all", label: "All Users" },
            { key: "approved", label: "Approved Users" },
            { key: "unapproved", label: "Unapproved Users" },
            { key: "suspended", label: "Suspended Users" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-2 px-4 font-semibold border-b-2 ${tab === t.key ? "border-blue-500 text-blue-600" : "border-transparent"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by username or email..."
          className="mb-4 p-2 border rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        {/* Table with sticky header */}
        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-600 text-sm uppercase text-left sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 w-1/4">Username</th>
                <th className="py-3 px-4 w-1/4">Email</th>
                <th className="py-3 px-4 w-1/4">Role</th>
                <th className="py-3 px-4 w-1/4">Phone Number</th>
              </tr>
            </thead>
          </table>

          <div className="max-h-80 overflow-y-auto">
            <table className="min-w-full text-sm text-gray-700">
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="py-2 px-4 w-1/4">{user.username}</td>
                    <td className="py-2 px-4 w-1/4">{user.email}</td>
                    <td className="py-2 px-4 w-1/4 capitalize">{user.role}</td>
                    <td className="py-2 px-4 w-1/4 capitalize">{user.phoneNumber}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
            >
              <MdCancel />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              {selectedUser.username}
            </h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-gray-500" />
                <strong>Phone Number:</strong> {selectedUser.phoneNumber}
              </p>
              <p className="flex items-center gap-2">
                <FaUserShield className="text-gray-500" />
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p className="flex items-center gap-2">
                <FaDotCircle className="text-gray-500" />
                <strong>Joined:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              {tab === "unapproved" && (
                <>
                  <button
                    onClick={() => handleApproval(selectedUser._id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FaCheck />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(selectedUser._id, "decline")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <FaTimes />
                    Decline
                  </button>
                </>
              )}
              {tab === "approved" && (
                <button
                  onClick={() => handleSuspend(selectedUser._id, "suspend")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaTimes />
                  Suspend
                </button>
              )}
              {tab === "suspended" && (
                <button
                  onClick={() => handleSuspend(selectedUser._id, "unsuspend")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaCheck />
                  Remove Suspend
                </button>
              )}
              {tab === "all" && (
                <>
                  {selectedUser.status === "approved" && (
                    <button
                      onClick={() => handleSuspend(selectedUser._id, "suspend")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FaTimes />
                      Suspend
                    </button>
                  )}
                  {selectedUser.status === "suspended" && (
                    <button
                      onClick={() => handleSuspend(selectedUser._id, "unsuspend")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FaCheck />
                      Remove Suspend
                    </button>
                  )}
                  {selectedUser.status === "unapproved" && (
                    <>
                      <button
                        onClick={() => handleApproval(selectedUser._id, "approve")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <FaCheck />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(selectedUser._id, "decline")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <FaTimes />
                        Decline
                      </button>
                    </>
                  )}
                </>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
 </div>
  );
};

export default ManageUsers;
