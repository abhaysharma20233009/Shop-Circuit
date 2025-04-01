import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserProfile from "./pages/profile/profile.jsx";
import EditUserProfile from "./pages/profile/editProfile.jsx";
import SignupPage from "./pages/authentication/signup.jsx";
import LoginPage from "./pages/authentication/login.jsx";
import HomePage from "./pages/profile/websiteHome.jsx";
import Navbar from "./components/Navbar.jsx";
import ProductList from "./pages/Home/ProductList.jsx";
import Footer from "./components/Footer.jsx";
import { ProductsDataProvider } from "./store/productDataStore.jsx";
import { UserDataProvider } from "./store/userDataStore.jsx";

// Layout for Dashboard Pages
const DashboardLayout = ({ children }) => {
  return (
    <ProductsDataProvider> {/* Wrap entire DashboardLayout with Provider */}
   
    <Navbar />
    
     
      {children}
      <Footer />
    </ProductsDataProvider>
  );
};

// Other Layouts remain the same
const ProfileLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const AuthLayout = ({ children }) => {
  return <>{children}</>;
};

const MainLayout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard Route */}
        <Route
          element={
            <useProductData>
           
             <Navbar/>
          
           </useProductData>
          }
        />
        <Route
          path="/dashboard"
          element={
            <useProductData>
             <DashboardLayout>
              <ProductList />
            </DashboardLayout>
            </useProductData>
            
          }
        />

        {/* Profile Routes */}
        <Route
          path="/me"
          element={
            <ProfileLayout>
              <UserDataProvider>
              <UserProfile />
              </UserDataProvider>
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

        {/* Authentication Routes */}
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

        {/* Main Route */}
        <Route
          path="/"
          element={
            <MainLayout>
              <ProductsDataProvider>
                <HomePage />
              </ProductsDataProvider>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;