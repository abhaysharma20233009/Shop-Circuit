import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import FilterBar from './components/Filterbar.jsx';
import ProductList from './pages/Home/ProductList.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <FilterBar />
        <Routes>
          <Route path="/" element={<ProductList/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
