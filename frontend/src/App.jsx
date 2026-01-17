// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ServerDashboard from "./components/serverdashboard";
import CreateCar from "./components/createcar";
import UpdateCar from "./components/updatecar";
import DeleteCar from "./components/deletecar";
import SearchCar from "./components/searchcar";
import "./custom.css"; // Kita akan buat file ini untuk styling tambahan

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Redirect Root ke /pbl0902 */}
        <Route path="/" element={<Navigate to="/pbl0902" replace />} />
        
        {/* Halaman Utama */}
        <Route path="/pbl0902" element={<Home />} />
        
        {/* Dashboard per Microservice */}
        <Route path="/pbl0902/ms/:msId" element={<ServerDashboard />} />

        {/* CRUD Routes dengan prefix pbl0902 */}
        <Route path="/pbl0902/create/:msId" element={<CreateCar />} />
        <Route path="/pbl0902/read/:msId" element={<ServerDashboard />} />
        <Route path="/pbl0902/update/:msId" element={<UpdateCar />} />
        <Route path="/pbl0902/delete/:msId" element={<DeleteCar />} />
        <Route path="/pbl0902/search/:msId" element={<SearchCar />} />
      </Routes>
    </div>
  );
}

export default App;