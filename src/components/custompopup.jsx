function CustomPopup({
  isOpen,
  title,
  message,
  type = "success",
  onClose,
}) {
  if (!isOpen) return null;

  const themeMap = {
    success: {
      border: "#10b981",
      button: "#10b981",
      title: "#065f46",
      bg: "#ecfdf5",
    },
    error: {
      border: "#ef4444",
      button: "#ef4444",
      title: "#991b1b",
      bg: "#fef2f2",
    },
    info: {
      border: "#3b82f6",
      button: "#3b82f6",
      title: "#1d4ed8",
      bg: "#eff6ff",
    },
  };

  const theme = themeMap[type] || themeMap.success;

  return (
    <div style={overlayStyle}>
      <div
        style={{
          ...popupStyle,
          background: theme.bg,
          borderTop: `6px solid ${theme.border}`,
        }}
      >
        <h2 style={{ marginBottom: "10px", color: theme.title }}>{title}</h2>
        <p style={{ color: "#374151", lineHeight: "1.6", marginBottom: "24px" }}>
          {message}
        </p>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              background: theme.button,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  padding: "20px",
};

const popupStyle = {
  width: "100%",
  maxWidth: "430px",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
};

export default CustomPopup;