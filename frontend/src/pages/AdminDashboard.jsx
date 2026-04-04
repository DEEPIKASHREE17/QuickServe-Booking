import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8081/api/admin";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "success", show: false });
  const [modal, setModal] = useState({ show: false, title: "", desc: "", onConfirm: null });
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast({ msg: "", type: "success", show: false }), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/bookings`),
      ]);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setError("");
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load data from backend. Make sure the server is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setModal({
      show: true,
      title: "Delete User?",
      desc: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/user/${user.id}`);
          setUsers(users.filter((u) => u.id !== user.id));
          showToast("User deleted successfully!");
        } catch (err) {
          showToast("Failed to delete user.", "error");
        }
        setModal({ ...modal, show: false });
      }
    });
  };

  const handleBlockClick = (user) => {
    setModal({
      show: true,
      title: "Block Provider?",
      desc: `Are you sure you want to block ${user.name}? They will no longer be able to accept bookings.`,
      onConfirm: async () => {
        try {
          await axios.put(`${API_BASE_URL}/block-provider/${user.id}`);
          setUsers(users.map((u) => (u.id === user.id ? { ...u, blocked: true } : u)));
          showToast("Provider blocked successfully!");
        } catch (err) {
          showToast("Failed to block provider.", "error");
        }
        setModal({ ...modal, show: false });
      }
    });
  };

  if (loading) return <div style={loadingStyle}>Loading Dashboard...</div>;

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Admin Control Center 🛡️</h1>
        <p style={subtitle}>Manage platform users and monitor all service bookings.</p>
      </div>

      {error && <div style={errorBanner}>{error}</div>}

      <div style={section}>
        <h2 style={sectionTitle}>User Management</h2>
        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={tr}>
                  <td style={td}>{user.id}</td>
                  <td style={td}>{user.name}</td>
                  <td style={td}>{user.email}</td>
                  <td style={td}>
                    <span style={{ ...roleBadge, background: user.role === 'PROVIDER' ? '#818cf822' : '#38bdf822', color: user.role === 'PROVIDER' ? '#818cf8' : '#38bdf8' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ color: user.blocked ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td style={td}>
                    <div style={actionRow}>
                      {user.role === 'PROVIDER' && !user.blocked && (
                        <button onClick={() => handleBlockClick(user)} style={blockBtn}>Block</button>
                      )}
                      <button onClick={() => handleDeleteClick(user)} style={deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>System Wide Bookings</h2>
        <div style={grid}>
          {bookings.length === 0 ? <p style={{color: '#94a3b8'}}>No bookings found in the system.</p> : 
            bookings.map((b) => (
              <div key={b.id} style={bookingCard}>
                <div style={cardHeader}>
                  <h3 style={cardTitle}>{b.categoryName}</h3>
                  <span style={statusBadge(b.status)}>{b.status}</span>
                </div>
                <div style={cardBody}>
                  <p style={cardText}><strong>Customer:</strong> {b.customerName} ({b.customerEmail})</p>
                  <p style={cardText}><strong>Provider:</strong> {b.providerName || "Unassigned"}</p>
                  <p style={cardText}><strong>Date:</strong> {b.bookingDate} at {b.bookingTime}</p>
                  <p style={cardText}><strong>Total:</strong> ₹{b.totalCost || b.cost}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Custom Modal */}
      {modal.show && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={modalTitle}>{modal.title}</h3>
            <p style={modalDesc}>{modal.desc}</p>
            <div style={modalActions}>
              <button onClick={() => setModal({ ...modal, show: false })} style={modalCancel}>Cancel</button>
              <button onClick={modal.onConfirm} style={modalConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast */}
      {toast.show && (
        <div style={{ ...toastSt, background: toast.type === "error" ? "#ef4444" : "#10b981" }}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}

// Styling
const page = { minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", padding: "40px", fontFamily: "'Inter', sans-serif" };
const header = { marginBottom: "40px" };
const title = { fontSize: "32px", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(90deg, #fff, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
const subtitle = { color: "#94a3b8", fontSize: "16px" };
const section = { marginBottom: "48px" };
const sectionTitle = { fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "#f1f5f9", borderLeft: "4px solid #38bdf8", paddingLeft: "12px" };
const tableWrapper = { background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" };
const table = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const th = { padding: "16px 20px", background: "rgba(255,255,255,0.05)", fontSize: "13px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" };
const td = { padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "14px" };
const tr = { transition: "background 0.2s" };
const roleBadge = { padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 };
const actionRow = { display: "flex", gap: "8px" };
const blockBtn = { background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600 };
const deleteBtn = { background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600 };
const loadingStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#38bdf8", fontSize: "20px", fontWeight: 700 };
const errorBanner = { padding: "16px", background: "#ef444422", border: "1px solid #ef444444", color: "#fca5a5", borderRadius: "12px", marginBottom: "24px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" };
const bookingCard = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "20px" };
const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" };
const cardTitle = { fontSize: "18px", fontWeight: 700, margin: 0 };
const cardBody = { display: "flex", flexDirection: "column", gap: "8px" };
const cardText = { fontSize: "14px", color: "#cbd5e1", margin: 0 };
const statusBadge = (s) => ({
  padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
  background: s === 'Completed' ? '#10b98122' : s === 'Pending' ? '#f59e0b22' : '#38bdf822',
  color: s === 'Completed' ? '#10b981' : s === 'Pending' ? '#f59e0b' : '#38bdf8',
  border: `1px solid ${s === 'Completed' ? '#10b98144' : s === 'Pending' ? '#f59e0b44' : '#38bdf844'}`
});

// New component styles
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" };
const modalContent = { background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", maxWidth: "400px", width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" };
const modalTitle = { fontSize: "20px", fontWeight: 800, margin: "0 0 12px", color: "#f1f5f9" };
const modalDesc = { fontSize: "15px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 28px" };
const modalActions = { display: "flex", gap: "12px", justifyContent: "flex-end" };
const modalCancel = { padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };
const modalConfirm = { padding: "10px 20px", borderRadius: "10px", background: "#ef4444", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.3)", transition: "all 0.2s" };

const toastSt = { 
  position: "fixed", top: "24px", right: "24px", padding: "14px 24px", borderRadius: "12px", 
  color: "#fff", fontWeight: 700, fontSize: "14px", zIndex: 2000, 
  boxShadow: "0 12px 32px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "10px",
  animation: "toastIn 0.3s ease-out" 
};

export default AdminDashboard;
