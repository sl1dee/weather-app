import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import Details from "./pages/details";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
          </Routes>
          <Routes>
              <Route path="/details/:id" element={<Details/>} />
          </Routes>
      </Router>
  );
}

export default App;
