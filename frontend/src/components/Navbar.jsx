import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaSun, FaBell } from "react-icons/fa";
import defaulPic from '../assets/react.svg';
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./Notification";

export default function Navbar() {
  
  // const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [data, setData] = useState("");

  const navigate=useNavigate();
  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  //   document.body.classList.toggle("dark-mode", !darkMode);
  // };
 
  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleNotificationBell = () => {
    setIsBellOpen(!isBellOpen);
  };

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
  }, [isOpen,isBellOpen]);

  const handleDataFromChild = (childData) => {
    setData(childData);
  };

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between p-3 m-0 bg-gray-800 text-white`}> 
      <div className="flex items-center pb-1 gap-4">
        <button className="text-2xl" onClick={toggleSidebar}><FaBars /></button>
        <div className="text-xl font-bold">Shop Circuit</div>
      </div>
      
      <div className="relative flex items-center gap-2 cursor-pointer bell-icon" onClick={toggleNotificationBell}>
          <FaBell className="text-2xl"/>
          <span className=" text-white rounded-full">{data}</span>
          {isBellOpen && <NotificationDropdown sendData={handleDataFromChild}/>}
        </div>
      
      
      
      {/* Sidebar */}
      <div className={`z-10 fixed top-0 left-0 h-full w-60 bg-gray-800 text-white p-5 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} sidebar`}> 
        <div className="flex justify-between items-center">
          <img src={defaulPic} alt="logo" className="w-12 h-12 rounded-full border border-gray-600" onClick={()=>(navigate('/me'))}/>
          <button onClick={toggleSidebar} className="text-2xl"><FaTimes /></button>
        </div>
        <ul className="mt-5 space-y-4">
          <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/dashboard')}>Home</li>
          <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/me')}>Profile</li>
          <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/chat')}>Chats</li>
          <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/sells')}>sell</li>
          <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/rents')}>rent requests</li>
          <li className="hover:text-gray-300 cursor-pointer">About</li>
          <li className="hover:text-gray-300 cursor-pointer">Services</li>
          <li className="hover:text-gray-300 cursor-pointer">Contact</li>
        </ul>
      </div>
    </div>
  );
}
