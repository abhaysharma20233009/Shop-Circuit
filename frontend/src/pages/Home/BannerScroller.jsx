import { useEffect, useState } from "react";
import laptop from "../../assets/BannerItems/laptop2.jpg";
import calculator from "../../assets/BannerItems/calculator.jpg";
import books from "../../assets/BannerItems/books.jpg";
import cycle from "../../assets/BannerItems/cycle.jpg";
import snack from "../../assets/BannerItems/snack2.jpg";
import breakfast from "../../assets/BannerItems/breakfast.jpg";

export default function BannerScroller() {
  const items = [
    { image: laptop, title: "Student Selling: Old Laptop", description: "Affordable second-hand laptops from students. Great deals!" },
    { image: calculator, title: "Student Selling: Scientific Calculator", description: "Get pre-owned scientific calculators at a low price!" },
    { image: books, title: "Student Request: Book Rental", description: "Students requesting books for rent. Lend and help others!" },
    { image: cycle, title: "Student Request: Cycle for Rent", description: "Need a cycle for a few days? Students requesting rentals!" },
    { image: snack, title: "Shopkeeper: Snacks Available", description: "Local shopkeepers selling snacks and refreshments." },
    { image: breakfast, title: "Shopkeeper: Breakfast & Dinner", description: "Local shopkeepers selling delicious breakfast and dinner. Check out now!" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div
        className="w-full flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="min-w-full relative">
            {/* Background Image */}
            <div className="w-full h-[500px] relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover brightness-110"
              />
              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-100 backdrop-opacity-100"></div>
            </div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
              <h2 className="text-4xl font-bold tracking-wide drop-shadow-2xl">{item.title}</h2>
              <p className="text-lg text-gray-300 mt-3 max-w-2xl">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {items.map((_, index) => (
          <span
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-violet-900 scale-110 shadow-lg" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
