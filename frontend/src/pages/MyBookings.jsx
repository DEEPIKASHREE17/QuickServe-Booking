import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/bookings")
      .then((res) => {
        console.log("DATA:", res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  }, []);

  const getStatus = (status) =>
    status === "Completed" ? "Completed" : "Pending";

  const statusColor = (status) =>
    status === "Completed" ? "#10b981" : "#f59e0b";

  const statusBg = (status) =>
    status === "Completed"
      ? "rgba(16,185,129,0.12)"
      : "rgba(245,158,11,0.12)";

  // ── Rate ───────────────────────────────────────────────────────────
  const rateBooking = (booking, rating) => {
    // Optimistic UI
    const updated = bookings.map((b) => b.id === booking.id ? { ...b, rating } : b);
    setBookings(updated);

    // Sync localStorage bookings
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify(all.map((b) => b.id === booking.id ? { ...b, rating } : b)));

    // Update Provider's overall rating in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) => {
      // Find provider by name or email
      if (u.role === "PROVIDER" && (u.email === booking.providerEmail || u.name === booking.providerName)) {
        const count = u.ratingCount || 0;
        const currentSum = (u.rating || 0) * count;
        const newCount = count + 1;
        const newRating = (currentSum + rating) / newCount;
        return { ...u, rating: Number(newRating.toFixed(1)), ratingCount: newCount };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.subtitle}>Dashboard</p>
          <h1 style={styles.title}>My Bookings</h1>
        </div>
        <button style={styles.browseBtn} onClick={() => navigate("/categories")}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#6366f1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(56,189,248,0.45)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg,#38bdf8,#818cf8)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(56,189,248,0.3)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          + Browse Services
        </button>
      </div>

      {/* Stats bar */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{bookings.length}</span>
          <span style={styles.statLabel}>Total Bookings</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statNum, color: "#f59e0b" }}>
            {bookings.filter(b => getStatus(b.status) === "Pending").length}
          </span>
          <span style={styles.statLabel}>Pending</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statNum, color: "#10b981" }}>
            {bookings.filter(b => getStatus(b.status) === "Completed").length}
          </span>
          <span style={styles.statLabel}>Completed</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statNum, color: "#38bdf8" }}>
            ₹{bookings.reduce((sum, b) => sum + (b.totalCost || b.cost || 0), 0)}
          </span>
          <span style={styles.statLabel}>Total Spent</span>
        </div>
      </div>

      {/* Booking list */}
      {bookings.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>No Bookings Yet</h3>
          <p style={styles.emptyText}>
            Your bookings will appear here once you book a service.
          </p>
          <button style={styles.emptyBtn} onClick={() => navigate("/categories")}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#6366f1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(135deg,#38bdf8,#818cf8)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {bookings.map((booking, i) => (
            <div
              key={booking.id || i}
              style={styles.card}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              }}
            >
              {/* Card top */}
              <div style={styles.cardTop}>
                <div style={styles.serviceIcon}>
                  {getCategoryEmoji(booking.categoryName)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.cardTitle}>{booking.categoryName}</h3>
                  <p style={styles.cardProvider}>
                    {booking.providerName || "Provider TBD"}
                  </p>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    color: statusColor(booking.status),
                    background: statusBg(booking.status),
                    border: `1px solid ${statusColor(booking.status)}44`,
                  }}
                >
                  {getStatus(booking.status) === "Pending" ? "⏳" : "✅"}{" "}
                  {getStatus(booking.status)}
                </span>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Details grid */}
              <div style={styles.detailsGrid}>
                <Detail icon="🛠️" label="Services"
                  value={
                    booking.selectedServices?.length > 0
                      ? booking.selectedServices.map(s => s.name).join(", ")
                      : booking.categoryName
                  }
                />
                <Detail icon="📅" label="Date" value={formatDate(booking.bookingDate)} />
                <Detail icon="⏰" label="Time" value={booking.bookingTime} />
                <Detail icon="📍" label="Location" value={booking.location || "—"} />
                <Detail icon="💳" label="Payment" value={booking.paymentMethod || "—"} />
                <Detail icon="💰" label="Price"
                  value={`₹${booking.totalCost || booking.cost || 0}`}
                  highlight
                />
              </div>

              {getStatus(booking.status) === "Completed" && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    {booking.rating ? "Your Rating" : "Rate Provider"}
                  </p>
                  <StarRating value={booking.rating || 0} onChange={val => rateBooking(booking, val)} readonly={!!booking.rating} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Detail row sub-component */
function Detail({ icon, label, value, highlight }) {
  return (
    <div style={detailStyles.wrap}>
      <span style={detailStyles.icon}>{icon}</span>
      <div>
        <p style={detailStyles.label}>{label}</p>
        <p style={{ ...detailStyles.value, ...(highlight ? { color: "#38bdf8", fontWeight: 700 } : {}) }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: "20px", lineHeight: 1,
            color: star <= (hover || value) ? "#f59e0b" : "rgba(255,255,255,0.15)",
            transition: "color 0.2s"
          }}
        >
          ★
        </span>
      ))}
      {readonly && value > 0 && <span style={{ marginLeft: "6px", fontSize: "14px", color: "#f59e0b", fontWeight: 700 }}>{value.toFixed(1)}</span>}
    </div>
  );
}

function getCategoryEmoji(name = "") {
  const n = name.toLowerCase();
  if (n.includes("plumb")) return "🔧";
  if (n.includes("electric")) return "⚡";
  if (n.includes("clean")) return "🧹";
  if (n.includes("paint")) return "🎨";
  if (n.includes("carpet")) return "🪣";
  if (n.includes("pest")) return "🐛";
  if (n.includes("garden") || n.includes("lawn")) return "🌿";
  if (n.includes("lock")) return "🔐";
  if (n.includes("ac") || n.includes("cool")) return "❄️";
  return "🛎️";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ── Styles ── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)",
    padding: "40px 32px",
    fontFamily: "'Inter','Poppins',sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "36px",
  },
  subtitle: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#38bdf8",
    marginBottom: "4px",
  },
  title: {
    fontSize: "clamp(24px,4vw,36px)",
    fontWeight: 800,
    background: "linear-gradient(90deg,#fff 30%,#38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  browseBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg,#38bdf8,#818cf8)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(56,189,248,0.3)",
    transition: "all 0.25s ease",
    width: "auto",
    margin: 0,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: "16px",
    marginBottom: "36px",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    backdropFilter: "blur(12px)",
  },
  statNum: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#fff",
  },
  statLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  emptyCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "64px 32px",
    textAlign: "center",
    backdropFilter: "blur(12px)",
  },
  emptyIcon: {
    fontSize: "56px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: "15px",
    marginBottom: "28px",
  },
  emptyBtn: {
    padding: "13px 32px",
    background: "linear-gradient(135deg,#38bdf8,#818cf8)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    width: "auto",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
    gap: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "24px",
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
  },
  serviceIcon: {
    width: "48px",
    height: "48px",
    background: "rgba(56,189,248,0.12)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
    border: "1px solid rgba(56,189,248,0.2)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: 0,
  },
  cardProvider: {
    fontSize: "13px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: "0.3px",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    marginBottom: "18px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 12px",
  },
};

const detailStyles = {
  wrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  icon: {
    fontSize: "16px",
    marginTop: "1px",
    flexShrink: 0,
  },
  label: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "2px",
  },
  value: {
    fontSize: "13px",
    color: "#cbd5e1",
    fontWeight: 500,
  },
};

export default MyBookings;