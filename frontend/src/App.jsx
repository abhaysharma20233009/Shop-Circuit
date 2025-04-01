import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserProfile from "./pages/profile/profile.jsx";
import EditUserProfile from "./pages/profile/editProfile.jsx";
import SignupPage from "./pages/authentication/signup.jsx";
import LoginPage from "./pages/authentication/login.jsx";
import HomePage from "./pages/profile/websiteHome.jsx";
import ChatPage from "./pages/chat/chatApp.jsx";
import AdminDashboard from "./pages/adminPages/adminDashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import ProductList from "./pages/Home/ProductList.jsx";
import Footer from "./components/Footer.jsx";
import { ProductsDataProvider } from "./store/productDataStore.jsx";
import { UserDataProvider } from "./store/userDataStore.jsx";
import AllSells from "./pages/sellAndRentRequests/sells.jsx";
import AllRequests from "./pages/sellAndRentRequests/rentRequests.jsx";
import ContactPage from "./components/Contact.jsx";
import ServicesPage from "./components/Services.jsx";
import AboutPage from "./components/About.jsx";
import { ToastContainer } from "react-toastify";
import AdminContactQueries from "./pages/adminPages/contactQueries.jsx";
import ForgotPassword from "./pages/account-setting/forgotPassword.jsx";
import AccountSettings from "./pages/account-setting/account-setting.jsx";
import ResetPassword from "./pages/account-setting/resetPassword.jsx";

//  Dashboard Layout
const DashboardLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

//  Profile Layout
const ProfileLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

//  Authentication Layout (No Navbar/Footer)
const AuthLayout = ({ children }) => <>{children}</>;

//  Main Layout
const MainLayout = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

function App() {
  return (
    
    <UserDataProvider>
      <ProductsDataProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={2000} />
          <Routes>
            {/*  Home */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              }
            />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <ProductList />
                </DashboardLayout>
              }
            />
            <Route
              path="/sells"
              element={
                <DashboardLayout>
                  <AllSells />
                </DashboardLayout>
              }
            />
            <Route
              path="/rents"
              element={
                <DashboardLayout>
                  <AllRequests />
                </DashboardLayout>
              }
            />

            {/*  Profile Routes */}
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
             <Route
              path="/account-settings"
              element={
                <ProfileLayout>
                  <AccountSettings />
                </ProfileLayout>
              }
            />
            <Route
              path="/chat"
              element={
                <ProfileLayout>
                  <ChatPage />
                </ProfileLayout>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProfileLayout>
                  <AdminDashboard />
                </ProfileLayout>
              }
            />
              <Route
              path="/contact-queries"
              element={
                <ProfileLayout>
                  <AdminContactQueries />
                </ProfileLayout>
              }
            />
            {/*  Authentication Routes */}
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
             <Route
              path="/forgot-password"
              element={
                <AuthLayout>
                  <ForgotPassword />
                </AuthLayout>
              }
            />

<Route
              path="/resetPassword/:token"
              element={
                <AuthLayout>
                  <ResetPassword />
                </AuthLayout>
              }
            />

            {/* ℹInfo Pages */}
            <Route
              path="/contact"
              element={
                <DashboardLayout>
                  <ContactPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/services"
              element={
                <DashboardLayout>
                  <ServicesPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/about"
              element={
                <DashboardLayout>
                  <AboutPage />
                </DashboardLayout>
              }
            />
          </Routes>
        </Router>
      </ProductsDataProvider>
    </UserDataProvider>
  );
}

export default App;
