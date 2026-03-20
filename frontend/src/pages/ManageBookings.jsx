import { useEffect, useState } from "react";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);
  }, []);

  const handleAccept = (id) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "Completed" } : booking
    );

    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "25px" }}>Manage Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card">
          <h3>No bookings found</h3>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="card"
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#f5f5f5",
              }}
            >
              <h3>{booking.categoryName}</h3>

              <p><b>Customer:</b> {booking.customerName}</p>
              <p><b>Description:</b> {booking.description}</p>
              <p><b>Cost:</b> ₹{booking.cost}</p>
              <p><b>Date:</b> {booking.bookingDate}</p>
              <p><b>Time:</b> {booking.bookingTime}</p>
              <p><b>Status:</b> {booking.status}</p>

              {booking.status === "Pending" && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => handleAccept(booking.id)}
                >
                  Accept
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageBookings;