import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Illusion */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 border-8 border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin-slow"></div>
      </div>

      {/* Loading Text */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold animate-pulse">Loading...</h1>
        <p className="text-lg text-gray-400 mt-2">Please wait a moment</p>
      </div>

      {/* Extra Moving Orbs for Illusion */}
      <div className="absolute w-5 h-5 bg-blue-500 rounded-full animate-bounce top-20 left-1/3"></div>
      <div className="absolute w-6 h-6 bg-purple-500 rounded-full animate-ping bottom-24 right-1/4"></div>
      <div className="absolute w-4 h-4 bg-yellow-500 rounded-full animate-bounce left-10 bottom-10"></div>
    </div>
  );
};

export default LoadingPage;