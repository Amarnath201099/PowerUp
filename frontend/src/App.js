import { BrowserRouter, Routes, Route } from "react-router-dom";

import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import About from "./pages/Adout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (accessible only when not logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/authentication" element={<Authentication />} />
        </Route>

        {/* Protected routes (accessible only when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/charging_stations" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
