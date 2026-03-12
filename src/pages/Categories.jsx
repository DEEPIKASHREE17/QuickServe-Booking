import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomPopup from "../components/CustomPopup";

function Categories() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    redirectTo: "",
  });

  const services = [
    { id: 1, name: "Electrician", description: "Electrical repair services", symbol: "🔌", cost: 299 },
    { id: 2, name: "Plumber", description: "Plumbing repair services", symbol: "🚰", cost: 249 },
    { id: 3, name: "Carpenter", description: "Woodwork and furniture repair", symbol: "🪚", cost: 349 },
    { id: 4, name: "Painter", description: "House and wall painting services", symbol: "🎨", cost: 499 },
    { id: 5, name: "Cleaner", description: "Home and office cleaning services", symbol: "🧹", cost: 199 },
    { id: 6, name: "AC Repair", description: "Air conditioner installation and repair", symbol: "❄️", cost: 399 },
    { id: 7, name: "Salon", description: "Beauty and grooming services", symbol: "💇", cost: 299 },
    { id: 8, name: "Appliance Repair", description: "Fridge and washing machine repair", symbol: "🛠️", cost: 349 },
  ];

  const handleServiceClick = (service) => {
    navigate("/bookings", { state: service });
  };

  const handleLogout = () => {
    setPopup({
      isOpen: true,
      title: "Logout Successful",
      message: "You have been logged out successfully.",
      type: "info",
      redirectTo: "/",
    });
  };

  const closePopup = () => {
    const redirectTo = popup.redirectTo;

    if (redirectTo) {
      localStorage.removeItem("user");
    }

    setPopup((prev) => ({
      ...prev,
      isOpen: false,
    }));

    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  return (
    <>
      <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #4f6bed 0%, #6d5dfc 100%)",
            borderRadius: "20px",
            padding: "35px",
            color: "white",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2.3rem", marginBottom: "10px" }}>
            Welcome, {user.name || "Customer"}!
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.95 }}>
            Choose the service you want to book
          </p>

          <div style={{ marginTop: "20px" }}>
            <button
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "white",
                color: "#4f6bed",
                fontWeight: "700",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </button>

            <button
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#e5e7eb",
                color: "#111827",
                fontWeight: "700",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>

            <button
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#ef4444",
                color: "white",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <h2 style={{ marginBottom: "20px" }}>Available Services</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                cursor: "pointer",
                textAlign: "center",
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
                {service.symbol}
              </div>
              <h3 style={{ marginBottom: "10px", color: "#1f2a44" }}>{service.name}</h3>
              <p style={{ color: "#6b7280", marginBottom: "12px" }}>
                {service.description}
              </p>
              <p style={{ fontWeight: "700", color: "#111827" }}>
                Starting ₹{service.cost}
              </p>
            </div>
          ))}
        </div>
      </div>

      <CustomPopup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={closePopup}
      />
    </>
  );
}

export default Categories;