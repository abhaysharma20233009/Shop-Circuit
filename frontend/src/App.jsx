import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserProfile from "./pages/profile/profile.jsx";
import EditUserProfile from "./pages/profile/editProfile.jsx";
import SignupPage from "./pages/authentication/signup.jsx";
import LoginPage from "./pages/authentication/login.jsx";
import HomePage from "./pages/profile/websiteHome.jsx";
import ChatPage from "./pages/chat/chatApp.jsx";

import Navbar from "./components/Navbar.jsx";
import FilterBar from "./components/Filterbar.jsx";
import ProductList from "./pages/Home/ProductList.jsx";
import Footer from "./components/Footer.jsx";

// Layout for pages that require Navbar & Footer
const MainLayout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

// Layout for Dashboard Pages
const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <FilterBar />
      {children}
      <Footer />
    </>
  );
};

// Layout for Profile Pages (Only Navbar, No Sidebar)
const ProfileLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

// Exclude Navbar & Footer from login and signup
const AuthLayout = ({ children }) => {
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard route with Navbar, FilterBar, and Footer */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <ProductList />
            </DashboardLayout>
          }
        />

        {/* Profile routes with only Navbar */}
        <Route
          path="/me"
          element={
            <ProfileLayout>
              <UserProfile />
            </ProfileLayout>
          }
        />
        <Route
          path="/editProfile"
          element={
            <ProfileLayout>
              <EditUserProfile />
            </ProfileLayout>
          }
        />

        {/* Auth routes without Navbar & Footer */}
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        {/* Default pages with Navbar & Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={<ChatPage/>} // Fixed incorrect usage of currentUser
        />
      </Routes>
    </Router>
  );
}

export default App;
