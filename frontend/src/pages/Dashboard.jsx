import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role === "PROVIDER") {
      navigate("/provider-dashboard");
    }
  }, [user.role, navigate]);

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const customerBookings = bookings.filter((b) => b.customerEmail === user.email);
  const pending = customerBookings.filter((b) => b.status === "Pending" || b.status === "Accepted");
  const completed = customerBookings.filter((b) => b.status === "Completed");
  const totalSpent = customerBookings.reduce((s, b) => s + (b.totalCost || b.cost || 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={page}>
      {/* Hero */}
      <div style={hero}>
        <div style={heroBlobL} />
        <div style={heroBlobR} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={heroLabel}>{greeting}</p>
          <h1 style={heroTitle}>{user.name || "Customer"} 👋</h1>
          <p style={heroSub}>Here&apos;s a snapshot of your activity on QuickServe.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={statsRow}>
        {[
          { icon: "📋", label: "Total Bookings", value: customerBookings.length, color: "#38bdf8" },
          { icon: "⏳", label: "Pending", value: pending.length, color: "#f59e0b" },
          { icon: "✅", label: "Completed", value: completed.length, color: "#10b981" },
          { icon: "💰", label: "Total Spent", value: `₹${totalSpent}`, color: "#a78bfa" },
        ].map((stat) => (
          <div key={stat.label} style={statCard}>
            <span style={statIcon}>{stat.icon}</span>
            <span style={{ ...statNum, color: stat.color }}>{stat.value}</span>
            <span style={statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={sectionHeading}>Quick Actions</h2>
      <div style={actionsGrid}>
        <ActionCard
          icon="🔍" title="Browse Services" desc="Explore and book services near you."
          btnText="Explore Now" color="#38bdf8"
          onClick={() => navigate("/categories")}
        />
        <ActionCard
          icon="📋" title="My Bookings" desc="View and track all your bookings."
          btnText="View Bookings" color="#a78bfa"
          onClick={() => navigate("/my-bookings")}
        />
        <ActionCard
          icon="👤" title="My Profile" desc="Manage your account details."
          btnText="Go to Profile" color="#10b981"
          onClick={() => navigate("/profile")}
        />
        <ActionCard
          icon="🗂️" title="Booking Management" desc="Filter, cancel and track all your service requests in one place."
          btnText="Open Module 4" color="#f59e0b"
          onClick={() => navigate("/module4")}
        />
        <ActionCard
          icon="⚙️" title="Provider Portal" desc="Accept, complete, or reject incoming customer requests."
          btnText="Open Module 5" color="#e879f9"
          onClick={() => navigate("/module5")}
        />
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, btnText, color, onClick }) {
  return (
    <div style={aCard}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.4)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
    >
      <div style={{ ...aIcon, color }}>{icon}</div>
      <h3 style={aTitle}>{title}</h3>
      <p style={aDesc}>{desc}</p>
      <button onClick={onClick} style={{ ...aBtn, background: `${color}22`, color, border: `1px solid ${color}44` }}
        onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.color = color; }}
      >
        {btnText} →
      </button>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)",
  padding: "40px 32px", fontFamily: "'Inter','Poppins',sans-serif",
};
const hero = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px", padding: "48px 40px", marginBottom: "32px",
  position: "relative", overflow: "hidden",
};
const heroBlobL = {
  position: "absolute", top: "-60px", left: "-60px",
  width: "200px", height: "200px", borderRadius: "50%",
  background: "rgba(56,189,248,0.12)", filter: "blur(40px)",
};
const heroBlobR = {
  position: "absolute", bottom: "-40px", right: "-40px",
  width: "180px", height: "180px", borderRadius: "50%",
  background: "rgba(129,140,248,0.1)", filter: "blur(40px)",
};
const heroLabel = { fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "8px" };
const heroTitle = {
  fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, margin: "0 0 10px",
  background: "linear-gradient(90deg,#fff 30%,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
};
const heroSub = { color: "#94a3b8", fontSize: "16px", margin: 0 };
const statsRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "16px", marginBottom: "40px" };
const statCard = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px", padding: "20px 16px", display: "flex",
  flexDirection: "column", gap: "4px", backdropFilter: "blur(12px)",
};
const statIcon = { fontSize: "22px", marginBottom: "4px" };
const statNum = { fontSize: "28px", fontWeight: 800, color: "#fff" };
const statLabel = { fontSize: "12px", color: "#94a3b8", fontWeight: 500 };
const sectionHeading = { fontSize: "20px", fontWeight: 700, color: "#f1f5f9", marginBottom: "20px" };
const actionsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px" };
const aCard = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px", padding: "28px 24px",
  backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease", display: "flex", flexDirection: "column",
};
const aIcon = { fontSize: "36px", marginBottom: "14px" };
const aTitle = { fontSize: "18px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" };
const aDesc = { fontSize: "14px", color: "#94a3b8", margin: "0 0 24px", flexGrow: 1 };
const aBtn = {
  padding: "12px 20px", borderRadius: "10px", fontWeight: 700,
  fontSize: "14px", cursor: "pointer", transition: "all 0.2s ease",
  width: "fit-content",
};

export default Dashboard;