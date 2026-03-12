import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const myBookings = allBookings.filter(
      (booking) => booking.customerEmail === user.email
    );
    setBookings(myBookings);
  }, [user.email]);

  const getCustomerStatus = (status) => {
    if (status === "Completed") return "Completed";
    return "Pending";
  };

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1>My Bookings</h1>

        <button className="btn btn-primary" onClick={() => navigate("/categories")}>
          Browse Services
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="card" style={{ padding: "25px" }}>
          <h3>No bookings available</h3>
          <p style={{ marginTop: "8px", color: "#6b7280" }}>
            Book a service to see it here.
          </p>
        </div>
      ) : (
        <div className="grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="card" style={{ padding: "22px" }}>
              <h3 style={{ marginBottom: "12px" }}>{booking.categoryName}</h3>

              <p style={textStyle}>
                <strong>Provider:</strong> {booking.providerName}
              </p>

              <p style={textStyle}>
                <strong>Selected Services:</strong>{" "}
                {booking.selectedServices && booking.selectedServices.length > 0
                  ? booking.selectedServices.map((item) => item.name).join(", ")
                  : booking.categoryName}
              </p>

              <p style={textStyle}>
                <strong>Date:</strong> {booking.bookingDate}
              </p>

              <p style={textStyle}>
                <strong>Time:</strong> {booking.bookingTime}
              </p>

              <p style={textStyle}>
                <strong>Location:</strong> {booking.location || "-"}
              </p>

              <p style={textStyle}>
                <strong>Payment:</strong> {booking.paymentMethod || "-"}
              </p>

              <p style={textStyle}>
                <strong>Price:</strong> ₹{booking.totalCost || booking.cost}
              </p>

              <p style={textStyle}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      getCustomerStatus(booking.status) === "Completed"
                        ? "#10b981"
                        : "#f59e0b",
                    fontWeight: "700",
                  }}
                >
                  {getCustomerStatus(booking.status)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const textStyle = {
  marginBottom: "8px",
  color: "#374151",
};

export default MyBookings;