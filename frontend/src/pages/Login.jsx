import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", formData);
      
      if (response.data === "Login successful") {
        // Fetch user profile to get the role
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        // For now, we still need to know who the user is. 
        // Ideally the login API should return the user object.
        // Let's assume the backend login returns "Login successful" for now as per UserService.java
        
        // We'll search for the user by email to get their role for redirection
        // In a real app, the backend would return a JWT and user info.
        const foundUser = users.find(u => u.email === formData.email);
        
        if (foundUser) {
          localStorage.setItem("user", JSON.stringify(foundUser));
          if (foundUser.role === "ADMIN") {
            navigate("/admin-dashboard");
          } else if (foundUser.role === "PROVIDER") {
            navigate("/provider-dashboard");
          } else {
            navigate("/categories");
          }
        } else {
          // Fallback if user exists in DB but not in our mock localStorage (unlikely in this setup)
          setError("User data sync error. Please contact admin.");
        }
      }
    } catch (err) {
      setError(err.response?.data || "Login failed. Check your connection.");
    }
  };

  return (
    <div style={page}>
      {/* Background blobs */}
      <div style={{ ...blob, top: "-80px", left: "-80px", background: "rgba(56,189,248,0.15)" }} />
      <div style={{ ...blob, bottom: "-100px", right: "-60px", background: "rgba(129,140,248,0.12)", width: "350px", height: "350px" }} />

      <div style={card}>
        {/* Logo */}
        <div style={logoWrap}>
          <span style={logoIcon}>⚡</span>
        </div>
        <h1 style={title}>Welcome back</h1>
        <p style={subtitle}>Sign in to QuickServe</p>

        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <label style={label}>Email</label>
          <input
            type="email" name="email" value={formData.email}
            onChange={handleChange} placeholder="you@example.com"
            style={input}
            onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
          />

          <label style={label}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"} name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter password"
              style={{ ...input, paddingRight: "54px" }}
              onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
            />
            <span onClick={() => setShowPass(!showPass)} style={eyeBtn}>
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" style={primaryBtn}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#6366f1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#38bdf8,#818cf8)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Sign In
          </button>
        </form>

        <p style={footText}>
          Don&apos;t have an account?{" "}
          <span onClick={() => navigate("/register")} style={link}>Register</span>
        </p>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex", justifyContent: "center", alignItems: "center",
  background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)",
  padding: "20px", fontFamily: "'Inter','Poppins',sans-serif", position: "relative", overflow: "hidden",
};
const blob = {
  position: "absolute", width: "300px", height: "300px",
  borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
};
const card = {
  width: "100%", maxWidth: "420px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "24px", padding: "40px 36px",
  backdropFilter: "blur(20px)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  display: "flex", flexDirection: "column", alignItems: "center",
  position: "relative", zIndex: 1,
};
const logoWrap = {
  width: "60px", height: "60px", borderRadius: "16px",
  background: "linear-gradient(135deg,#38bdf8,#818cf8)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "28px", marginBottom: "20px",
  boxShadow: "0 8px 24px rgba(56,189,248,0.35)",
};
const logoIcon = { display: "flex" };
const title = { fontSize: "26px", fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px" };
const subtitle = { fontSize: "14px", color: "#94a3b8", marginBottom: "28px" };
const errorBox = {
  width: "100%", padding: "12px 16px", borderRadius: "12px",
  background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
  color: "#fca5a5", fontSize: "14px", marginBottom: "16px", textAlign: "center",
};
const label = { display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.5px", width: "100%" };
const input = {
  width: "100%", padding: "13px 14px", marginBottom: "18px",
  borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)", color: "#f1f5f9",
  fontSize: "15px", outline: "none", boxSizing: "border-box",
  transition: "all 0.2s ease",
};
const eyeBtn = {
  position: "absolute", right: "14px", top: "50%", transform: "translateY(-60%)",
  cursor: "pointer", fontSize: "16px",
};
const primaryBtn = {
  width: "100%", padding: "14px", marginTop: "8px",
  background: "linear-gradient(135deg,#38bdf8,#818cf8)",
  border: "none", borderRadius: "12px", color: "#fff",
  fontSize: "16px", fontWeight: 700, cursor: "pointer",
  transition: "all 0.25s ease", boxShadow: "0 4px 16px rgba(56,189,248,0.3)",
};
const footText = { marginTop: "24px", color: "#64748b", fontSize: "14px" };
const link = { color: "#38bdf8", cursor: "pointer", fontWeight: 700 };

export default Login;