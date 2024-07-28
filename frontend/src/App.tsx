import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import CatNamePage from "./pages/student/catNamePage"; // Import your target page component
import ExercisePage from "./pages/student/exercisePage";
import KittenListPage from "./pages/teacher/kittenListPage";
import ResultsPage from "./pages/student/resultsPage";
import FeedbackPage from "./pages/student/feedbackPage";
import LoginPage from "./pages/student/loginPage";

/**
 * @description - Routing for application
 * @returns - The main App component
 */
export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/catNamePage" element={<CatNamePage />} />
          <Route path="/student/exercisePage" element={<ExercisePage />} />
          <Route path="/student/loginPage" element={<LoginPage />} />
          <Route path="/student/resultsPage" element={<ResultsPage />} />
          <Route path="/teacher/kittenListPage" element={<KittenListPage />} />
          <Route path="/student/feedBackPage" element={<FeedbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}
