import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./index.css";
import "./App.css";

import Home from "./pages/Home";
import Topics from "./pages/Topics";
import Questions from "./pages/Questions";
import Saved from "./pages/Saved";
import Target from "./pages/Target";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Start each new page at the top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <div className="app">
          <ScrollToTop />
          <NavBar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/BrowseTopics" element={<Topics />} />
              <Route path="/topics/:topic" element={<Questions />} />
              <Route path="/Saved" element={<Saved />} />
              <Route path="/Target" element={<Target />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
