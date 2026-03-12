import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (!foundUser) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(foundUser));

    if (foundUser.role === "PROVIDER") {
      navigate("/provider-dashboard");
    } else {
      navigate("/categories");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Login</h2>

        <form onSubmit={handleLogin}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter email"
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter password"
          />

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "18px" }}>
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#4f6bed", cursor: "pointer", fontWeight: "600" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f7fb",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "450px",
  padding: "30px",
  borderRadius: "16px",
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#1f2a44",
};

const labelStyle = {
  fontWeight: "600",
  display: "block",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#4f6bed",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

export default Login;