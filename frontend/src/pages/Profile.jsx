import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    service: "",
    experience: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    setFormData({
      name: storedUser.name || "",
      email: storedUser.email || "",
      phone: storedUser.phone || "",
      role: storedUser.role || "",
      service: storedUser.service || "",
      experience: storedUser.experience || "",
    });
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      service: formData.service,
      experience: formData.experience,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(updatedUser);
    setMessage("Profile updated successfully");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)",
            borderRadius: "24px",
            padding: "32px",
            color: "white",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "28px",
            boxShadow: "0 10px 30px rgba(79,70,229,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "700",
                border: "2px solid rgba(255,255,255,0.35)",
              }}
            >
              {getInitials(user.name)}
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: "2rem" }}>
                {user.name || "User"}
              </h1>
              <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>
                {user.role === "PROVIDER" ? "Service Provider" : "Customer"}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              padding: "14px 18px",
              borderRadius: "16px",
              minWidth: "220px",
            }}
          >
            <div style={{ fontSize: "0.95rem", opacity: 0.9 }}>Account Email</div>
            <div style={{ marginTop: "6px", fontWeight: "600" }}>
              {user.email || "-"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "24px",
          }}
        >
          <div
            className="card"
            style={{
              padding: "24px",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "18px", color: "#1e293b" }}>
              Account Overview
            </h2>

            <div style={infoRow}>
              <span style={labelStyle}>Name</span>
              <span style={valueStyle}>{user.name || "-"}</span>
            </div>

            <div style={infoRow}>
              <span style={labelStyle}>Email</span>
              <span style={valueStyle}>{user.email || "-"}</span>
            </div>

            <div style={infoRow}>
              <span style={labelStyle}>Phone</span>
              <span style={valueStyle}>{user.phone || "-"}</span>
            </div>

            <div style={infoRow}>
              <span style={labelStyle}>Role</span>
              <span style={valueStyle}>
                {user.role === "PROVIDER" ? "Service Provider" : "Customer"}
              </span>
            </div>

            {user.role === "PROVIDER" && (
              <>
                <div style={infoRow}>
                  <span style={labelStyle}>Service</span>
                  <span style={valueStyle}>{user.service || "-"}</span>
                </div>

                <div style={infoRow}>
                  <span style={labelStyle}>Experience</span>
                  <span style={valueStyle}>{user.experience || "-"}</span>
                </div>
              </>
            )}
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, color: "#1e293b" }}>Edit Profile</h2>

              {message && (
                <div
                  style={{
                    background: "#ecfdf5",
                    color: "#065f46",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {message}
                </div>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div style={gridTwo}>
                <div>
                  <label style={fieldLabel}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label style={fieldLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label style={fieldLabel}>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label style={fieldLabel}>Role</label>
                  <input
                    type="text"
                    value={
                      formData.role === "PROVIDER"
                        ? "Service Provider"
                        : "Customer"
                    }
                    disabled
                    style={{ ...inputStyle, background: "#f1f5f9", color: "#475569" }}
                  />
                </div>

                {formData.role === "PROVIDER" && (
                  <>
                    <div>
                      <label style={fieldLabel}>Service</label>
                      <input
                        type="text"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Enter service"
                      />
                    </div>

                    <div>
                      <label style={fieldLabel}>Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Enter experience"
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginTop: "24px", textAlign: "right" }}>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #e2e8f0",
  gap: "16px",
};

const labelStyle = {
  color: "#64748b",
  fontWeight: "600",
};

const valueStyle = {
  color: "#0f172a",
  fontWeight: "600",
  textAlign: "right",
};

const fieldLabel = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid #dbe2ea",
  background: "#fff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

export default Profile;