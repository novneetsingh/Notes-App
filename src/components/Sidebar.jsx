import React from "react";
import { Home, Star, Menu, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("You are logged out!");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col p-4">
      {/* App Name */}
      <div className="flex items-center space-x-3">
        <Menu className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Voice Notes </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        <ul className="space-y-2">
          {/* Home Link */}
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </NavLink>
          </li>

          {/* Favourites Link */}
          <li>
            <NavLink
              to="/dashboard/favourites"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">Favourites</span>
            </NavLink>
          </li>

          {/* Logout Link */}
          <li>
            <button
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t pt-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
          N
        </div>
        <span className="font-medium">Novneet Singh</span>
      </div>
    </aside>
  );
};

export default Sidebar;
