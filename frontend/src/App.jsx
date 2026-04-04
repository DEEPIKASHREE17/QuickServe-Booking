import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Bookings from "./pages/Bookings";
import MyBookings from "./pages/MyBookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import Profile from "./pages/Profile";
import Module4 from "./pages/Module4";
import Module5 from "./pages/Module5";
import RazorpayCheckout from "./pages/RazorpayCheckout";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/module4" element={<Module4 />} />
        <Route path="/module5" element={<Module5 />} />
        <Route path="/payment" element={<RazorpayCheckout />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;