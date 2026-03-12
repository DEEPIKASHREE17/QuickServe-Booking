import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomPopup from "../components/CustomPopup";

function ProviderDashboard() {
  const provider = JSON.parse(localStorage.getItem("user") || "{}");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    redirectTo: "",
  });

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    const providerBookings = allBookings.filter(
      (booking) =>
        booking.providerEmail === provider.email ||
        booking.categoryName === provider.service
    );

    setBookings(providerBookings);
  }, [provider.email, provider.service]);

  const updateStatus = (id, newStatus) => {
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    const updatedBookings = allBookings.map((booking) =>
      booking.id === id ? { ...booking, status: newStatus } : booking
    );

    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    const providerBookings = updatedBookings.filter(
      (booking) =>
        booking.providerEmail === provider.email ||
        booking.categoryName === provider.service
    );

    setBookings(providerBookings);
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
      <div className="page-container">
        <div
          style={{
            background: "linear-gradient(135deg, #4f6bed 0%, #6d5dfc 100%)",
            borderRadius: "20px",
            padding: "28px",
            color: "white",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "10px" }}>Provider Dashboard</h1>
            <p style={{ marginBottom: "6px" }}>
              <strong>Name:</strong> {provider.name}
            </p>
            <p style={{ marginBottom: "6px" }}>
              <strong>Service:</strong> {provider.service}
            </p>
            <p>
              <strong>Experience:</strong> {provider.experience}
            </p>
          </div>

          <div>
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

        <h2 style={{ marginBottom: "18px" }}>Customer Requests</h2>

        {bookings.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h3>No customer bookings</h3>
          </div>
        ) : (
          <div className="grid">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: "#fff",
                  padding: "22px",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <h3 style={{ marginBottom: "12px" }}>{booking.categoryName}</h3>

                <p style={textStyle}>
                  <strong>Customer:</strong> {booking.customerName}
                </p>
                <p style={textStyle}>
                  <strong>Date:</strong> {booking.bookingDate}
                </p>
                <p style={textStyle}>
                  <strong>Time:</strong> {booking.bookingTime}
                </p>
                <p style={textStyle}>
                  <strong>Price:</strong> ₹{booking.totalCost || booking.cost}
                </p>
                <p style={textStyle}>
                  <strong>Status:</strong> {booking.status}
                </p>

                {booking.selectedServices && booking.selectedServices.length > 0 && (
                  <p style={textStyle}>
                    <strong>Selected Services:</strong>{" "}
                    {booking.selectedServices.map((item) => item.name).join(", ")}
                  </p>
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  {booking.status === "Pending" && (
                    <button
                      style={primaryButton}
                      onClick={() => updateStatus(booking.id, "Accepted")}
                    >
                      Accept
                    </button>
                  )}

                  {booking.status === "Accepted" && (
                    <button
                      style={primaryButton}
                      onClick={() => updateStatus(booking.id, "Completed")}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

const textStyle = {
  marginBottom: "8px",
  color: "#374151",
};

const primaryButton = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  background: "#4f6bed",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

export default ProviderDashboard;