import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Reports from "./pages/Reports";
import HealthAI from "./pages/HealthAI";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Hospitals from "./pages/Hospitals";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
     
   <Route element={<ProtectedRoute />}>
      <Route path="/reports" element={<Reports />} />

      <Route path="/health-ai" element={<HealthAI />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/assistant" element={<Assistant />} />

      <Route path="/hospitals" element={<Hospitals />} />

      <Route path="/profile" element={<Profile />} />

      </Route>
       <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;