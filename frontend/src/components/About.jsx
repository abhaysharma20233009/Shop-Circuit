import { FaStore, FaExchangeAlt, FaComments, FaPhoneAlt, FaUsers, FaClock, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import abhay from "../assets/abhaySharma.jpg";
import adarsh from "../assets/adarsh_land.jpg";
import abhinav from "../assets/profilePic.jpeg";

export default function AboutPage() {
  const navigate = useNavigate();
  const [webTime, setWebTime] = useState("");

  

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400 animate-pulse">🏫 About Shop Circuit</h1>

      

      <p className="text-gray-400 text-lg mb-6 text-center max-w-4xl">
        Welcome to <span className="text-blue-500 font-semibold">Shop Circuit</span> – your one-stop platform for all student needs! Find out what products are available in
        <strong> shops & canteens</strong>, <strong>buy, sell, or rent</strong> items, and easily
        <strong> connect with other students or shop owners</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <FeatureCard icon={<FaStore />} title="Shop & Canteen Listings" description="Easily check what products are available in college shops and canteens." color="yellow" />
        <FeatureCard icon={<FaExchangeAlt />} title="Buy, Sell, Rent" description="Students can sell, buy, or rent items directly on the platform." color="red" />
        <FeatureCard icon={<FaComments />} title="Instant Chat" description="Contact other students easily using our built-in chat feature." color="blue" />
        <FeatureCard icon={<FaPhoneAlt />} title="Direct Shop Contact" description="Get shop phone numbers for quick and easy purchases." color="red" />
        <FeatureCard icon={<FaUsers />} title="Student Community" description="Join a trusted network of students for buying, selling, and renting." color="purple" />
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-400">👨‍💻 Meet Our Team</h2>
        <p className="text-gray-400 mt-2 text-lg">We are Full-Stack Developer students from <strong>MNNIT Allahabad</strong></p>

        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <TeamMember name="Abhinav Yadav" role="Full-Stack Developer" image={abhinav} phone="+91 9876543210" linkedin="https://linkedin.com" instagram="https://instagram.com" facebook="https://facebook.com" />
          <TeamMember name="Abhay Sharma" role="Backend Specialist" image={abhay} phone="+91 9876543211" linkedin="https://tinyurl.com/3k4xnnyt" instagram="https://instagram.com" facebook="https://facebook.com" />
          <TeamMember name="Adarsh Kumar" role="Full-Stack Developer" image={adarsh} phone="+91 9876543212" linkedin="https://www.linkedin.com/in/adarshkumar292/" instagram="https://instagram.com" facebook="https://facebook.com" />
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-400">🚀 Get Started Today!</h2>
        <p className="text-gray-400 mt-4 text-lg">Join the <strong>College Marketplace</strong> now to buy, sell, rent, and connect with your peers easily.</p>
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition" onClick={() => handleNavigation("/dashboard")}>
          Start Now
        </button>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transition transform duration-300 border-t-4 border-${color}-500`}>
    <div className={`text-5xl text-${color}-400 mb-4`}>{icon}</div>
    <h2 className="text-2xl font-semibold text-white">{title}</h2>
    <p className="text-gray-400 mt-2">{description}</p>
  </div>
);

const TeamMember = ({ name, role, image, phone, linkedin, instagram, facebook }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition transform duration-300">
    <img src={image} alt={name} className="w-24 h-24 rounded-full mb-4 border-2 border-blue-500 object-cover" />
    <h3 className="text-lg font-semibold text-white">{name}</h3>
    <p className="text-gray-400 text-sm">{role}</p>
    <p className="text-gray-300 text-sm mt-2">📞 {phone}</p>
    <div className="flex gap-4 mt-3">
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-2xl hover:scale-110 transition"><FaLinkedin /></a>
      <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 text-2xl hover:scale-110 transition"><FaInstagram /></a>
      <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-blue-700 text-2xl hover:scale-110 transition"><FaFacebook /></a>
    </div>
  </div>
);
