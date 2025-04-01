import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import defaulPic from '../assets/react.svg';
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./Notification";

import { useData } from "../store/userDataStore"; // Adjust the import path as necessary 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [data, setData] = useState(0);
  const navigate = useNavigate();
  const { user, loading } = useData();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Default user data when loading or not available
  const defaultUser = {
    profilePicture: defaulPic,
    name: "Guest",
  };

  const displayUser = loading ? defaultUser : user || defaultUser;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleNotificationBell = () => setIsBellOpen(!isBellOpen);
  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".sidebar")) {
        setIsOpen(false);
      }
      if (isBellOpen && !event.target.closest(".bell-dropdown, .bell-icon")) {
        setIsBellOpen(false);
      }
      if (isProfileOpen && !event.target.closest(".profile-menu, .profile-icon")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isBellOpen, isProfileOpen]);

  const handleDataFromChild = (childData) => {
    setData(childData);
  };
  const handleLogout=async ()=>{
    const response =await  fetch(`http://localhost:3000/api/v1/users/logout`, {
      credentials: "include", // Include cookies for authentication
    });
    if(response.ok){
      navigate("/");
    }
  } 
  return (
    <div className="flex items-center justify-between p-2 bg-gray-900 text-white shadow-lg border-b border-gray-700">
      {/* Left Section - Sidebar Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button className="text-3xl text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-110" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="text-2xl font-extrabold tracking-wide text-blue-400 animate-pulse">⚡ Shop Circuit ⚡</div>
      </div>

      {/* Right Section - Notification & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer bell-icon" onClick={toggleNotificationBell}>
          <FaBell className="text-2xl text-red-400 hover:text-red-600 transform transition duration-200 hover:scale-110" />
          {data > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {data}
            </span>
          )}
          {isBellOpen && <NotificationDropdown sendData={handleDataFromChild} />}
        </div>

        {/* Profile Image */}
        <div className="relative">
          <img
            src={displayUser.profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-gray-600 hover:border-blue-500 transition cursor-pointer profile-icon"
            onClick={toggleProfileMenu}
          />

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute z-20 right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden profile-menu">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/me')}>
                  👤 {loading ? "Loading..." : "View Profile"}
                </li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/editProfile',{ state: { user } })}>
                  ✏️ Edit Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/sell-product')}>
                  🛒 Sell Product
                </li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/request-rent')}>
                  🔄 Request Rent
                </li>
                <li className="px-4 py-2 hover:bg-red-600 cursor-pointer" onClick={() => handleLogout()}>
                  🚪 Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`z-20 fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} sidebar`}> 
        <div className="flex justify-between items-center border-b pb-3 border-gray-600">
          <button onClick={toggleSidebar} className="text-2xl text-red-400 hover:text-red-600 transition-transform transform hover:scale-110">
            <FaTimes />
          </button>
        </div>

        <ul className="mt-6 space-y-6 text-lg font-semibold">
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/dashboard')}>🏠 Home</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/me')}>👤 Profile</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/sells')}>🛒 Sells</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/rents')}>🔄 Rents</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/chat')}>📩 Chats</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/about')}>📜 About</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/services')}>⚙️ Services</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/contact')}>📞 Contact</li>
           {/* Settings Dropdown */}
      <li
        className="relative cursor-pointer hover:text-blue-400 transition-transform transform hover:scale-110"
        onMouseEnter={() => setIsSettingsOpen(true)}
        onMouseLeave={() => setIsSettingsOpen(false)}
      >
        ⚙️ Settings
        {isSettingsOpen && (
          <ul className="absolute left-0  w-48 bg-green-800  text-white rounded-lg shadow-lg overflow-hidden">
            <li
              className="px-2 text-sm py-1 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate("/account-settings")}
            >
              🔧 Account Settings
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate('/editProfile',{ state: { user } })}
            >
              ✏️ Edit Profile
            </li>
          </ul>
        )}
      </li>
        </ul>
      </div>
    </div>
  );
}
