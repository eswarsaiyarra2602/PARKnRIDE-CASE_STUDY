import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
function App() {
  return (
    <div className="App">
      <Routes>
       <Route path="/" element={<HomePage/>} />
       <Route path="/admin" element={<AdminDashboard/>} />
    </Routes>
    </div>
  );
}

export default App;