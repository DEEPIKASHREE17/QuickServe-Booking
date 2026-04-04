import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    role: "CUSTOMER", 
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    service: "", 
    experience: "",
    adminKey: "" // Added for admin registration
  });
  const [flash, setFlash] = useState({ msg: "", type: "success" });

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const getStrength = (pw) => {
    if (!pw) return { label: "", color: "#334155", width: "0%" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 2) return { label: "Weak", color: "#ef4444", width: "33%" };
    if (s <= 4) return { label: "Medium", color: "#f59e0b", width: "66%" };
    return { label: "Strong", color: "#10b981", width: "100%" };
  };

  const strength = useMemo(() => getStrength(formData.password), [formData.password]);

  const isStrong = () => {
    const p = formData.password;
    return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
  };

  const showFlash = (msg, type = "success", redirectTo = "") => {
    setFlash({ msg, type });
    setTimeout(() => {
      setFlash({ msg: "", type: "success" });
      if (redirectTo) navigate(redirectTo);
    }, 2500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      showFlash("Please fill all required fields.", "error"); return;
    }
    if (!isStrong()) {
      showFlash("Password must be 8+ chars with uppercase, lowercase, number, and special char.", "error"); return;
    }
    if (formData.role === "PROVIDER" && (!formData.service || !formData.experience)) {
      showFlash("Please fill provider service and experience.", "error"); return;
    }
    if (formData.role === "ADMIN" && !formData.adminKey) {
      showFlash("Please enter the Admin Passcode.", "error"); return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/auth/register", formData);
      
      if (response.data === "User registered successfully") {
        // Sync with local mock users (for existing frontend logic)
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push({ id: Date.now(), ...formData });
        localStorage.setItem("users", JSON.stringify(users));
        
        showFlash("Your account has been created successfully. 🎉", "success", "/");
      }
    } catch (err) {
      showFlash(err.response?.data || "Registration failed.", "error");
    }
  };

  return (
    <>
      <div style={page}>
        <div style={{ ...blob, top: "-80px", left: "-80px" }} />
        <div style={{ ...blob, bottom: "-80px", right: "-60px", background: "rgba(129,140,248,0.12)", width: "280px", height: "280px" }} />

        <div style={card}>
          <div style={logoWrap}><span>⚡</span></div>
          <h1 style={title}>Create Account</h1>
          <p style={sub}>Join QuickServe today</p>

          {flash.msg && (
            <div style={{ ...flashBox, ...(flash.type === "error" ? flashError : {}) }}>
              {flash.msg}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ width: "100%" }}>
            {/* Role toggle */}
            <div style={roleRow}>
              {["CUSTOMER", "PROVIDER", "ADMIN"].map((r) => (
                <button key={r} type="button" onClick={() => setFormData((p) => ({ ...p, role: r }))}
                  style={{ ...roleBtn, ...(formData.role === r ? roleActive : {}) }}
                >
                  {r === "CUSTOMER" ? "👤 Customer" : r === "PROVIDER" ? "🛠️ Provider" : "🛡️ Admin"}
                </button>
              ))}
            </div>

            <Field label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
            <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
            <Field label="Phone" name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />

            {formData.role === "ADMIN" && (
              <Field label="Admin Passcode" name="adminKey" type="password" value={formData.adminKey} onChange={handleChange} placeholder="Enter secret admin key" />
            )}

            {/* Password field */}
            <label style={label}>Password</label>
            <div style={{ position: "relative", marginBottom: "4px" }}>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                onChange={handleChange} placeholder="Enter strong password" style={{ ...inputSt, paddingRight: "60px", marginBottom: 0 }}
                onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
              />
              <span onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>{showPassword ? "🙈" : "👁️"}</span>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <div style={{ marginBottom: "18px" }}>
                <div style={strengthTrack}>
                  <div style={{ ...strengthFill, width: strength.width, background: strength.color }} />
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: strength.color, fontWeight: 600 }}>{strength.label} Password</p>
              </div>
            )}

            {formData.role === "PROVIDER" && (
              <>
                <label style={label}>Service</label>
                <select name="service" value={formData.service} onChange={handleChange} style={{ ...inputSt, colorScheme: "dark" }}>
                  <option value="" style={optSt}>Select service</option>
                  {["Electrician","Plumber","Carpenter","Painter","Cleaner","AC Repair","Salon","Appliance Repair"].map(s => (
                    <option key={s} value={s} style={optSt}>{s}</option>
                  ))}
                </select>
                <Field label="Experience" name="experience" type="text" value={formData.experience} onChange={handleChange} placeholder="e.g. 3 years" />
              </>
            )}

            <button type="submit" style={submitBtn}
              onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#6366f1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#38bdf8,#818cf8)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Create Account
            </button>
          </form>

          <p style={foot}>Already have an account?{" "}
            <span onClick={() => navigate("/")} style={link}>Sign In</span>
          </p>
        </div>
      </div>
    </>
  );
}

function Field({ label: lbl, name, type, value, onChange, placeholder }) {
  return (
    <>
      <label style={label}>{lbl}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={inputSt}
        onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
      />
    </>
  );
}

const page = {
  minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
  background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)",
  padding: "20px", fontFamily: "'Inter','Poppins',sans-serif",
  position: "relative", overflow: "hidden",
};
const blob = { position: "absolute", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(56,189,248,0.12)", filter: "blur(50px)", pointerEvents: "none" };
const card = {
  width: "100%", maxWidth: "480px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "24px", padding: "36px", backdropFilter: "blur(20px)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  display: "flex", flexDirection: "column", alignItems: "center",
  position: "relative", zIndex: 1,
};
const logoWrap = { width: "54px", height: "54px", borderRadius: "14px", background: "linear-gradient(135deg,#38bdf8,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "16px", boxShadow: "0 6px 20px rgba(56,189,248,0.3)" };
const title = { fontSize: "24px", fontWeight: 800, color: "#f1f5f9", margin: "0 0 4px" };
const sub = { fontSize: "14px", color: "#94a3b8", marginBottom: "24px" };
const roleRow = { display: "flex", gap: "10px", marginBottom: "20px", width: "100%" };
const roleBtn = { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" };
const roleActive = { background: "rgba(56,189,248,0.15)", border: "1px solid #38bdf8", color: "#38bdf8" };
const label = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.5px", width: "100%" };
const inputSt = { width: "100%", padding: "12px 14px", marginBottom: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f1f5f9", fontSize: "15px", outline: "none", boxSizing: "border-box", transition: "all 0.2s ease" };
const eyeBtn = { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "16px" };
const strengthTrack = { width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "999px", overflow: "hidden", marginTop: "8px" };
const strengthFill = { height: "100%", borderRadius: "999px", transition: "all 0.3s ease" };
const submitBtn = { width: "100%", padding: "14px", marginTop: "8px", background: "linear-gradient(135deg,#38bdf8,#818cf8)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease", boxShadow: "0 4px 16px rgba(56,189,248,0.3)" };
const foot = { marginTop: "20px", color: "#64748b", fontSize: "14px" };
const link = { color: "#38bdf8", cursor: "pointer", fontWeight: 700 };
const optSt = { background: "#1e293b", color: "#f1f5f9" };
const flashBox = { width: "100%", boxSizing: "border-box", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontWeight: 600, fontSize: "13px", textAlign: "center" };
const flashError = { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" };

export default Register;