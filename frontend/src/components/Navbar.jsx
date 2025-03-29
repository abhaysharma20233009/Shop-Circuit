import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import defaulPic from '../assets/react.svg';
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./Notification";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleNotificationBell = () => setIsBellOpen(!isBellOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".sidebar")) {
        setIsOpen(false);
      }
      if (isBellOpen && !event.target.closest(".bell-dropdown, .bell-icon")) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isBellOpen]);

  const handleDataFromChild = (childData) => {
    setData(childData);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-900 text-white shadow-lg border-b border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="text-3xl text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-110" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="text-2xl font-extrabold tracking-wide text-blue-400 animate-pulse">⚡ Shop Circuit ⚡</div>
      </div>
      
      {/* Notification Bell */}
      <div className="relative flex items-center gap-2 cursor-pointer bell-icon" onClick={toggleNotificationBell}>
        <FaBell className="text-2xl text-red-400 hover:text-red-600 transform transition duration-200 hover:scale-110" />
        <span className="text-white rounded-full">{data}</span>
        {isBellOpen && <NotificationDropdown sendData={handleDataFromChild} />}
      </div>
      
      {/* Sidebar */}
      <div className={`z-20 fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} sidebar`}> 
        <div className="flex justify-between items-center border-b pb-3 border-gray-600">
          <img src={defaulPic} alt="logo" className="w-14 h-14 rounded-full border border-gray-600 hover:border-blue-500 transition" onClick={() => navigate('/me')} />
          <button onClick={toggleSidebar} className="text-2xl text-red-400 hover:text-red-600 transition-transform transform hover:scale-110">
            <FaTimes />
          </button>
        </div>

        <ul className="mt-6 space-y-6 text-lg font-semibold">
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/dashboard')}>🏠 Home</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/me')}>👤 Profile</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/sells')}>🛒 Sells</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/rents')}>🔄 Rents</li>
           <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/chat')}>Chats</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110" onClick={() => navigate('/about')}>📜 About</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110"onClick={() => navigate('/services')}>⚙️ Services</li>
          <li className="hover:text-blue-400 cursor-pointer transition-transform transform hover:scale-110"onClick={() => navigate('/contact')}>📞 Contact</li>

        </ul>
      </div>
    </div>
  );
}
