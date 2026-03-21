import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SERVICES = [
  { id: 1, name: "Electrician",      symbol: "⚡", desc: "Electrical repair services",           cost: 299, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Plumber",          symbol: "🔧", desc: "Plumbing repair services",              cost: 249, image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Carpenter",        symbol: "🪚", desc: "Woodwork and furniture repair",         cost: 349, image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Painter",          symbol: "🎨", desc: "House and wall painting services",      cost: 499, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Cleaner",          symbol: "🧹", desc: "Home and office cleaning services",    cost: 199, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "AC Repair",        symbol: "❄️", desc: "AC installation and repair",           cost: 399, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400" },
  { id: 7, name: "Salon",            symbol: "💇", desc: "Beauty and grooming services",          cost: 299, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400" },
  { id: 8, name: "Appliance Repair", symbol: "🛠️", desc: "Fridge and washing machine repair",   cost: 349, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" },
];

const CARD_ACCENTS = ["#38bdf8","#a78bfa","#34d399","#f59e0b","#f472b6","#60a5fa","#fb923c","#4ade80"];

function Categories() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [flash, setFlash] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (user.role === "PROVIDER") {
      navigate("/provider-dashboard");
    }
  }, [user.role, navigate]);

  const handleLogout = () => {
    setFlash("You have been logged out successfully.");
    setTimeout(() => {
      setFlash("");
      localStorage.removeItem("user");
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <div style={page}>
        {/* Top nav bar */}
        <div style={topBar}>
          <div style={brand}>
            <span style={brandIcon}>⚡</span>
            <span style={brandName}>QuickServe</span>
          </div>
          <div style={navBtns}>
            <NavBtn label="📋 My Bookings" onClick={() => navigate("/my-bookings")} />
            <NavBtn label="👤 Profile"     onClick={() => navigate("/profile")} />
            <button style={logoutBtn} onClick={handleLogout}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={hero}>
          <div style={heroBlob} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={heroTag}>SERVICES</p>
            <h1 style={heroTitle}>Hi, {user.name || "there"}! 👋</h1>
            <p style={heroSub}>What service can we help you with today?</p>
          </div>
        </div>

        {flash && <div style={flashBox}>{flash}</div>}

        {/* Services grid */}
        <div style={grid}>
          {SERVICES.map((svc, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            const hovered = hoveredCard === svc.id;
            return (
              <div
                key={svc.id}
                onClick={() => navigate("/bookings", { state: svc })}
                onMouseEnter={() => setHoveredCard(svc.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  ...card,
                  borderColor: hovered ? `${accent}66` : "rgba(255,255,255,0.07)",
                  transform: hovered ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: hovered ? `0 20px 48px rgba(0,0,0,0.45), 0 0 0 1px ${accent}33` : "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <div style={cardImageWrap}>
                  <img src={svc.image} alt={svc.name} style={cardImage} loading="lazy" />
                  <div style={{ ...iconWrap, background: `${accent}E6`, border: `2px solid #fff`, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                    {svc.symbol}
                  </div>
                </div>
                <div style={cardContent}>
                  <h3 style={cardTitle}>{svc.name}</h3>
                  <p style={cardDesc}>{svc.desc}</p>
                  <div style={cardFooter}>
                    <span style={cardPrice}>from ₹{svc.cost}</span>
                    <span style={{ ...bookNow, color: accent }}>Book →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function NavBtn({ label, onClick }) {
  return (
    <button style={navBtn} onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,189,248,0.15)"; e.currentTarget.style.color = "#38bdf8"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8"; }}
    >
      {label}
    </button>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)",
  padding: "24px 32px 48px", fontFamily: "'Inter','Poppins',sans-serif",
};
const topBar = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  marginBottom: "32px", flexWrap: "wrap", gap: "12px",
};
const brand = { display: "flex", alignItems: "center", gap: "10px" };
const brandIcon = {
  width: "36px", height: "36px", borderRadius: "10px",
  background: "linear-gradient(135deg,#38bdf8,#818cf8)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "18px",
};
const brandName = { fontSize: "20px", fontWeight: 800, color: "#f1f5f9" };
const navBtns = { display: "flex", gap: "10px", flexWrap: "wrap" };
const navBtn = {
  padding: "9px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)", color: "#94a3b8",
  fontWeight: 600, fontSize: "13px", cursor: "pointer", transition: "all 0.2s ease",
};
const logoutBtn = {
  padding: "9px 16px", borderRadius: "10px",
  border: "1px solid rgba(239,68,68,0.3)",
  background: "rgba(239,68,68,0.12)", color: "#f87171",
  fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s ease",
};
const hero = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px", padding: "40px 36px", marginBottom: "32px",
  position: "relative", overflow: "hidden",
};
const heroBlob = {
  position: "absolute", top: "-60px", right: "-60px",
  width: "240px", height: "240px", borderRadius: "50%",
  background: "rgba(56,189,248,0.12)", filter: "blur(50px)",
};
const heroTag = { fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#38bdf8", marginBottom: "8px" };
const heroTitle = {
  fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, margin: "0 0 8px",
  background: "linear-gradient(90deg,#fff 40%,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
};
const heroSub = { color: "#94a3b8", fontSize: "16px", margin: 0 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "24px" };
const card = {
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px", overflow: "hidden",
  backdropFilter: "blur(16px)", cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex", flexDirection: "column",
};
const cardImageWrap = { width: "100%", height: "160px", position: "relative" };
const cardImage = { width: "100%", height: "100%", objectFit: "cover" };
const iconWrap = { 
  position: "absolute", bottom: "-20px", left: "20px",
  width: "48px", height: "48px", borderRadius: "14px", 
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
};
const cardContent = { padding: "28px 20px 20px", display: "flex", flexDirection: "column", flexGrow: 1 };
const cardTitle = { fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" };
const cardDesc = { fontSize: "13px", color: "#94a3b8", margin: "0 0 20px", flexGrow: 1, lineHeight: 1.5 };
const cardFooter = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const cardPrice = { fontSize: "14px", fontWeight: 700, color: "#cbd5e1" };
const bookNow = { fontSize: "13px", fontWeight: 700 };
const flashBox = { background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontWeight: 600, fontSize: "14px" };

export default Categories;