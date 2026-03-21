import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "", service: "", experience: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
    setFormData({ name: u.name || "", email: u.email || "", phone: u.phone || "", role: u.role || "", service: u.service || "", experience: u.experience || "" });
  }, []);

  const initials = (name = "") => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify(users.map((u) => (u.email === user.email ? updated : u))));
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const infoItems = [
    { label: "Name",       value: user.name || "—" },
    { label: "Email",      value: user.email || "—" },
    { label: "Phone",      value: user.phone || "—" },
    { label: "Role",       value: user.role === "PROVIDER" ? "Service Provider" : "Customer" },
    ...(user.role === "PROVIDER" ? [
      { label: "Service",    value: user.service || "—" },
      { label: "Experience", value: user.experience || "—" },
    ] : []),
  ];

  return (
    <div style={page}>
      {/* Hero banner */}
      <div style={hero}>
        <div style={heroBlob} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={avatarCircle}>{initials(user.name)}</div>
          <div>
            <p style={heroTag}>My Profile</p>
            <h1 style={heroName}>{user.name || "User"}</h1>
            <span style={roleBadge}>{user.role === "PROVIDER" ? "🛠️ Service Provider" : "👤 Customer"}</span>
          </div>
        </div>
      </div>

      <div style={twoCol}>
        {/* Overview card */}
        <div style={glassCard}>
          <h2 style={cardHead}>Account Overview</h2>
          {infoItems.map((item) => (
            <div key={item.label} style={infoRow}>
              <span style={infoLabel}>{item.label}</span>
              <span style={infoVal}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Edit card */}
        <div style={glassCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
            <h2 style={{ ...cardHead, marginBottom: 0 }}>Edit Profile</h2>
            {saved && <span style={savedBadge}>✅ Saved!</span>}
          </div>

          <form onSubmit={handleSave}>
            <div style={formGrid}>
              <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
              <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
              <div>
                <label style={fLabel}>Role</label>
                <input value={formData.role === "PROVIDER" ? "Service Provider" : "Customer"} disabled style={{ ...fInput, background: "rgba(255,255,255,0.03)", color: "#64748b" }} />
              </div>
              {formData.role === "PROVIDER" && (
                <>
                  <Field label="Service"    name="service"    value={formData.service}    onChange={handleChange} placeholder="Service type" />
                  <Field label="Experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 3 years" />
                </>
              )}
            </div>
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <button type="submit" style={saveBtn}
                onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#6366f1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#38bdf8,#818cf8)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label style={fLabel}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={fInput}
        onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

const page = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)", padding: "40px 32px", fontFamily: "'Inter','Poppins',sans-serif" };
const hero = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "36px 36px", marginBottom: "28px", position: "relative", overflow: "hidden" };
const heroBlob = { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(56,189,248,0.12)", filter: "blur(50px)" };
const avatarCircle = { width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#38bdf8,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 8px 24px rgba(56,189,248,0.3)" };
const heroTag = { fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "4px" };
const heroName = { fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, background: "linear-gradient(90deg,#fff 40%,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" };
const roleBadge = { padding: "5px 14px", borderRadius: "999px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", fontWeight: 600, fontSize: "13px" };
const twoCol = { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" };
const glassCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(16px)" };
const cardHead = { fontSize: "16px", fontWeight: 700, color: "#f1f5f9", marginBottom: "20px" };
const infoRow = { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", gap: "12px" };
const infoLabel = { fontSize: "13px", color: "#64748b", fontWeight: 600 };
const infoVal = { fontSize: "13px", color: "#cbd5e1", fontWeight: 600, textAlign: "right" };
const savedBadge = { padding: "6px 14px", borderRadius: "999px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontWeight: 600, fontSize: "13px" };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
const fLabel = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.5px" };
const fInput = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f1f5f9", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s ease" };
const saveBtn = { padding: "12px 28px", background: "linear-gradient(135deg,#38bdf8,#818cf8)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.25s", boxShadow: "0 4px 14px rgba(56,189,248,0.3)" };

export default Profile;