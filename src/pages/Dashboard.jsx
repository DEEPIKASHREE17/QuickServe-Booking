import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  const customerBookings = bookings.filter(
    (booking) => booking.customerEmail === user.email
  );

  const pendingBookings = customerBookings.filter(
    (booking) => booking.status === "Pending" || booking.status === "Accepted"
  );

  const completedBookings = customerBookings.filter(
    (booking) => booking.status === "Completed"
  );

  return (
    <div>
      <section
        style={{
          background: "linear-gradient(135deg, var(--primary-color) 0%, #4a5568 100%)",
          color: "white",
          padding: "60px 40px",
          borderRadius: "var(--border-radius)",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "white", fontSize: "2.5rem", marginBottom: "10px" }}>
          Hello, {user.name || "Customer"}!
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: "0.9" }}>
          Book services and track booking status.
        </p>
      </section>

      <div className="grid">
        <div className="card" onClick={() => navigate("/categories")} style={cardStyle}>
          <div style={iconStyle}>🔍</div>
          <h3>Browse Services</h3>
          <p style={pStyle}>Find and book nearby services.</p>
          <button className="btn btn-primary" style={{ marginTop: "20px" }}>Explore</button>
        </div>

        <div className="card" onClick={() => navigate("/my-bookings")} style={cardStyle}>
          <div style={iconStyle}>📋</div>
          <h3>My Bookings</h3>
          <p style={pStyle}>View all your bookings.</p>
          <button className="btn btn-primary" style={{ marginTop: "20px" }}>Open</button>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={iconStyle}>⏳</div>
          <h3>Pending</h3>
          <p style={pStyle}>Waiting for service completion.</p>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>
            {pendingBookings.length}
          </div>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={iconStyle}>✅</div>
          <h3>Completed</h3>
          <p style={pStyle}>Finished services.</p>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
            {completedBookings.length}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { cursor: "pointer", textAlign: "center" };
const iconStyle = { fontSize: "3rem", marginBottom: "20px" };
const pStyle = { color: "var(--text-secondary)" };

export default Dashboard;