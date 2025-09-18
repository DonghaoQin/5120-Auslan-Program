import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Insights from "./pages/Insights.jsx";
import LettersNumbers from "./pages/LettersNumbers.jsx";
import BasicWords from "./pages/BasicWords.jsx";
import MiniQuiz from "./pages/MiniQuiz.jsx";
import StoryBook from "./pages/StoryBook.jsx";

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
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
