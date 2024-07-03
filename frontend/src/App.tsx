import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage';
import CatNamePage from './pages/student/catNamePage'; // Import your target page component
import ExercisePage from './pages/student/exercisePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/catNamePage" element={<CatNamePage />} />
          <Route path='/student/exercisePage' element={<ExercisePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
