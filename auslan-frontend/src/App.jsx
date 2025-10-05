import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/NavBar.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Insights from "./pages/Insights.jsx";
import LettersNumbers from "./pages/LettersNumbers.jsx";
import BasicWords from "./pages/BasicWords.jsx";
import MiniQuiz from "./pages/MiniQuiz.jsx";
import StoryBook from "./pages/StoryBook.jsx";

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // Optional: smooth scrolling animation
    });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/";
  return (
    <div className="app">
      <ScrollToTop />
      {!hideNav && <NavBar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/learn/letters-numbers" element={<LettersNumbers />} />
          <Route path="/learn/words" element={<BasicWords />} />
          <Route path="/quiz" element={<MiniQuiz />} />
          <Route path="/story-book" element={<StoryBook />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
