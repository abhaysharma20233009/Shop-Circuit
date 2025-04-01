import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaSun, FaMoon } from "react-icons/fa";
import defaulPic from '../assets/react.svg';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };
 
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".sidebar")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between p-3 m-0 bg-gray-800 text-white`}> 
      <div className="flex items-center pb-1 gap-4">
        <button className="text-2xl" onClick={toggleSidebar}><FaBars /></button>
        <div className="text-xl font-bold">Shop Circuit</div>
      </div>
      
      {/* <div className="flex items-center gap-4">
        <button className="text-2xl" onClick={toggleDarkMode}>{darkMode ? <FaSun /> : <FaMoon />}</button>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt />
          <span>Nearby</span>
        </div>
      </div> */}
      
      
      
      {/* Sidebar */}
      <div className={`z-10 fixed top-0 left-0 h-full w-60 bg-gray-800 text-white p-5 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} sidebar`}> 
        <div className="flex justify-between items-center">
          <img src={defaulPic} alt="logo" className="w-12 h-12 rounded-full border border-gray-600" onClick={()=>(navigate('/me'))}/>
          <button onClick={toggleSidebar} className="text-2xl"><FaTimes /></button>
        </div>
        <ul className="mt-5 space-y-4">
          <li className="hover:text-gray-300 cursor-pointer" onClick={()=>navigate('/dashboards')}>Home</li>
          <li className="hover:text-gray-300 cursor-pointer">About</li>
          <li className="hover:text-gray-300 cursor-pointer">Services</li>
          <li className="hover:text-gray-300 cursor-pointer">Contact</li>
        </ul>
      </div>
    </div>
  );
}
