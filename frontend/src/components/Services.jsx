import React from "react";
import { FaRocket, FaShieldAlt, FaUsers, FaHandshake, FaLightbulb, FaChartLine, FaCogs, FaGlobe } from "react-icons/fa";

const services = [
  {
    title: "Fast & Secure Transactions",
    description: "Experience seamless and secure transactions with advanced encryption.",
    icon: <FaShieldAlt size={50} className="text-blue-500" />,
  },
  {
    title: "24/7 Customer Support",
    description: "Our support team is available around the clock to assist you with any concerns.",
    icon: <FaUsers size={50} className="text-green-500" />,
  },
  {
    title: "Easy Buying & Selling",
    description: "Effortlessly buy and sell products with our user-friendly, AI-powered marketplace.",
    icon: <FaHandshake size={50} className="text-purple-500" />,
  },
  {
    title: "Innovative Solutions",
    description: "We integrate cutting-edge technology to enhance your experience.",
    icon: <FaRocket size={50} className="text-pink-500" />,
  },
  {
    title: "AI-Powered Recommendations",
    description: "Smart suggestions tailored to your preferences, powered by AI algorithms.",
    icon: <FaLightbulb size={50} className="text-yellow-500" />,
  },
  {
    title: "Real-Time Analytics",
    description: "Monitor your sales, purchases, and trends with real-time insights.",
    icon: <FaChartLine size={50} className="text-cyan-500" />,
  },
  {
    title: "Seamless Integrations",
    description: "Easily integrate with various payment gateways and third-party tools.",
    icon: <FaCogs size={50} className="text-red-500" />,
  },
  {
    title: "Global Accessibility",
    description: "Connect with users worldwide and expand your reach effortlessly.",
    icon: <FaGlobe size={50} className="text-indigo-500" />,
  },
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 overflow-hidden">
      {/* Glowing Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-black opacity-20 animate-pulse"></div>

      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-400 tracking-widest animate-bounce">
        ⚡ Our Premium Services
      </h1>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl z-10">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="bg-gray-800 p-6 rounded-2xl shadow-lg transition transform hover:scale-110 hover:shadow-gray-400 flex flex-col items-center text-center"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold text-blue-600">{service.title}</h3>
            <p className="text-gray-400 mt-2">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="mt-12 text-center z-10">
        <h2 className="text-3xl font-bold text-blue-600">🚀 Ready to Experience the Future?</h2>
        <p className="text-gray-400 mt-4 text-lg">Join us today and take advantage of our next-gen services.</p>
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-blue-400">
          Get Started
        </button>
      </div>
    </div>
  );
}
