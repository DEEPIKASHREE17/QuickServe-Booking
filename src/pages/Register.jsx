import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomPopup from "../components/CustomPopup";

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
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    redirectTo: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return { label: "", color: "#d1d5db", width: "0%" };
    }

    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      return { label: "Weak Password", color: "#ef4444", width: "33%" };
    }

    if (score <= 4) {
      return { label: "Medium Password", color: "#f59e0b", width: "66%" };
    }

    return { label: "Strong Password", color: "#10b981", width: "100%" };
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const isStrongEnough = () => {
    const password = formData.password;

    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const showPopup = (title, message, type = "success", redirectTo = "") => {
    setPopup({
      isOpen: true,
      title,
      message,
      type,
      redirectTo,
    });
  };

  const closePopup = () => {
    const redirectTo = popup.redirectTo;

    setPopup((prev) => ({
      ...prev,
      isOpen: false,
    }));

    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      showPopup("Registration Failed", "Please fill all required fields.", "error");
      return;
    }

    if (!isStrongEnough()) {
      showPopup(
        "Weak Password",
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        "error"
      );
      return;
    }

    if (formData.role === "PROVIDER" && (!formData.service || !formData.experience)) {
      showPopup(
        "Registration Failed",
        "Please fill provider service and experience.",
        "error"
      );
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.find((u) => u.email === formData.email);

    if (exists) {
      showPopup("Registration Failed", "User already exists with this email.", "error");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showPopup(
      "Registration Successful",
      "Your account has been created successfully.",
      "success",
      "/"
    );
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "30px",
            borderRadius: "18px",
            background: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#1f2a44",
            }}
          >
            Register
          </h2>

          <form onSubmit={handleRegister}>
            <label style={labelStyle}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Service Provider</option>
            </select>

            <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={inputStyle}
            />

            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={inputStyle}
            />

            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={inputStyle}
            />

            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter strong password"
                style={{ ...inputStyle, marginBottom: "0" }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#4f6bed",
                  fontWeight: "700",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: passwordStrength.width,
                    height: "100%",
                    background: passwordStrength.color,
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "700",
                  color: passwordStrength.color,
                }}
              >
                {passwordStrength.label}
              </p>

              <p
                style={{
                  marginTop: "6px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Use 8+ characters, uppercase, lowercase, number, and special character.
              </p>
            </div>

            {formData.role === "PROVIDER" && (
              <>
                <label style={labelStyle}>Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select service</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter">Painter</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Salon">Salon</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                </select>

                <label style={labelStyle}>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter experience"
                  style={inputStyle}
                />
              </>
            )}

            <button type="submit" style={primaryButton}>
              Register
            </button>

            <p style={{ textAlign: "center", marginTop: "18px" }}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                style={{
                  color: "#4f6bed",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>

      <CustomPopup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={closePopup}
      />
    </>
  );
}

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

const primaryButton = {
  width: "100%",
  marginTop: "10px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#4f6bed",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

export default Register;