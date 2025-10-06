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
import Flashcard from "./pages/Flashcard.jsx"; 

// Component: scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();

  // Hide NavBar on login ("/") and on flashcard page (mobile view)
  const hideNav = location.pathname === "/" || location.pathname === "/flashcard";

  return (
    <div className="app">
      <ScrollToTop />
      {/* Only show NavBar on main app pages */}
      {!hideNav && <NavBar />}

      <div className="container">
        <Routes>
          {/*  Public pages */}
          <Route path="/" element={<Login />} />

          {/*  Main app pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/learn/letters-numbers" element={<LettersNumbers />} />
          <Route path="/learn/words" element={<BasicWords />} />
          <Route path="/quiz" element={<MiniQuiz />} />
          <Route path="/story-book" element={<StoryBook />} />

          {/*  Mobile QR Flashcard page (independent, no NavBar) */}
          <Route path="/flashcard" element={<Flashcard />} />

          {/*  Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}