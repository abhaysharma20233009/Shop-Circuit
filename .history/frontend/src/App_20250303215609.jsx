function App() {
  return (
    <UserDataProvider> {/* Wrap everything inside UserDataProvider */}
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
        </Routes>
      </Router>
    </UserDataProvider>
  );
}

export default App;
