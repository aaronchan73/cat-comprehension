import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage';
import CatNamePage from './pages/student/catNamePage'; // Import your target page component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/catNamePage" element={<CatNamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
