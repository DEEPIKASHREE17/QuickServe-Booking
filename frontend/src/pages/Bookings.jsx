import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const SERVICE_OPTIONS = {
  Salon:            [{ name: "Facial", price: 299 },{ name: "Eyebrows", price: 99 },{ name: "Pedicure", price: 399 },{ name: "Manicure", price: 349 },{ name: "Hair Spa", price: 499 },{ name: "Hair Cut", price: 199 }],
  Electrician:      [{ name: "Fan Repair", price: 249 },{ name: "Switch Board Repair", price: 199 },{ name: "Light Installation", price: 149 },{ name: "Wiring Check", price: 299 }],
  Plumber:          [{ name: "Tap Repair", price: 199 },{ name: "Pipe Leakage Fix", price: 299 },{ name: "Wash Basin Repair", price: 249 },{ name: "Toilet Fitting", price: 349 }],
  Carpenter:        [{ name: "Door Repair", price: 299 },{ name: "Furniture Assembly", price: 399 },{ name: "Shelf Installation", price: 249 },{ name: "Chair Repair", price: 199 }],
  Painter:          [{ name: "Wall Painting", price: 999 },{ name: "Door Painting", price: 399 },{ name: "Touch Up Work", price: 299 },{ name: "Ceiling Paint", price: 499 }],
  Cleaner:          [{ name: "Home Cleaning", price: 599 },{ name: "Bathroom Cleaning", price: 299 },{ name: "Kitchen Cleaning", price: 399 },{ name: "Sofa Cleaning", price: 349 }],
  "AC Repair":      [{ name: "AC Service", price: 499 },{ name: "Gas Filling", price: 999 },{ name: "Water Leakage Fix", price: 399 },{ name: "Installation", price: 1299 }],
  "Appliance Repair":[{ name: "Washing Machine Repair", price: 499 },{ name: "Fridge Repair", price: 599 },{ name: "Microwave Repair", price: 399 },{ name: "TV Repair", price: 699 }],
};

const PAYMENT_METHODS = [
  { id: "Credit/Debit Card", icon: "💳" },
  { id: "UPI",               icon: "📱" },
  { id: "Cash on Service",   icon: "💵" },
  { id: "Wallet",            icon: "👛" },
];

function Bookings() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const service = location.state || { name: "Salon", description: "Beauty and grooming services", cost: 299 };
  const options = SERVICE_OPTIONS[service.name] || [{ name: service.name, price: service.cost || 299 }];

  const [selectedItems, setSelectedItems] = useState([]);
  const [bookingDate,   setBookingDate]   = useState("");
  const [bookingTime,   setBookingTime]   = useState("");
  const [addressForm,   setAddressForm]   = useState({
    country: "India", fullName: user.name || "", mobile: "", pincode: "",
    flatHouse: "", areaStreet: "", landmark: "", townCity: "", state: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [flash, setFlash] = useState({ msg: "", type: "error" });

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const showFlash = (msg, type = "error", redirect = false) => {
    setFlash({ msg, type });
    setTimeout(() => {
      setFlash({ msg: "", type: "error" });
      if (redirect) navigate("/my-bookings");
    }, 2000);
  };

  const totalAmount = useMemo(() => selectedItems.reduce((s, i) => s + i.price, 0), [selectedItems]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.find((x) => x.name === item.name) ? prev.filter((x) => x.name !== item.name) : [...prev, item]
    );
  };
  const isSelected = (name) => selectedItems.some((x) => x.name === name);

  const to12 = (t) => { if (!t) return ""; const [h, m] = t.split(":"); let hr = parseInt(h); const ampm = hr >= 12 ? "PM" : "AM"; hr = hr % 12 || 12; return `${hr}:${m} ${ampm}`; };

  const confirmBooking = () => {
    if (!selectedItems.length)    { showFlash("Please select at least one service."); return; }
    if (!bookingDate || !bookingTime) { showFlash("Please select date and time."); return; }
    
    // Address Validation
    const reqFields = ["fullName", "mobile", "pincode", "flatHouse", "areaStreet", "townCity", "state"];
    if (reqFields.some(f => !addressForm[f].trim())) {
      showFlash("Please fill in all mandatory address fields."); return;
    }
    
    if (!paymentMethod)           { showFlash("Please select payment method."); return; }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const prov  = users.find((u) => u.role === "PROVIDER" && u.service === service.name);

    const formattedAddress = `${addressForm.flatHouse}, ${addressForm.areaStreet}${addressForm.landmark ? ', ' + addressForm.landmark : ''}, ${addressForm.townCity}, ${addressForm.state} - ${addressForm.pincode} (${addressForm.country}). Contact: ${addressForm.fullName}, ${addressForm.mobile}`;

    const booking = {
      id: Date.now(),
      customerName: addressForm.fullName || user.name || "Customer", customerEmail: user.email || "",
      providerName: prov ? prov.name : "Not Assigned", providerEmail: prov ? prov.email : "",
      providerService: prov ? prov.service : service.name,
      categoryName: service.name, description: service.description || "",
      selectedServices: selectedItems, totalCost: totalAmount,
      bookingDate, bookingTime: to12(bookingTime),
      location: formattedAddress, paymentMethod, status: "Pending",
    };

    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    existing.push(booking);
    localStorage.setItem("bookings", JSON.stringify(existing));
    showFlash("Booking confirmed! 🎉", "success", true);
  };

  return (
    <div style={page}>
      <div style={container}>
        {/* Header */}
        <div style={header}>
          <div>
            <p style={headerSub}>New Booking</p>
            <h2 style={headerTitle}>{service.name}</h2>
          </div>
          <button onClick={() => navigate("/categories")} style={closeBtn}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >✕</button>
        </div>

        {flash.msg && (
          <div style={{ ...flashBox, ...(flash.type === "error" ? flashError : {}) }}>
            {flash.msg}
          </div>
        )}

        {/* Service info */}
        <Section title="Service Details">
          <div style={infoBox}>
            <span style={infoBadge}>{service.name}</span>
            <p style={infoDesc}>{service.description}</p>
          </div>
        </Section>

        {/* Service options */}
        <Section title="Select Activities">
          <div style={optGrid}>
            {options.map((item, i) => {
              const sel = isSelected(item.name);
              return (
                <button key={i} type="button" onClick={() => toggleItem(item)}
                  style={{ ...optBtn, borderColor: sel ? "#38bdf8" : "rgba(255,255,255,0.1)", background: sel ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"; e.currentTarget.style.background = "rgba(56,189,248,0.06)"; } }}
                  onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
                >
                  {sel && <span style={checkMark}>✓</span>}
                  <div style={optName}>{item.name}</div>
                  <div style={optPrice}>₹{item.price}</div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Booking details */}
        <Section title="Booking Details">
          <div style={detGrid}>
            <div>
              <label style={lbl}>Date</label>
              <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={inp}
                onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={lbl}>Time</label>
              <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} style={inp}
                onFocus={e => { e.target.style.borderColor = "#38bdf8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>
        </Section>
        
        <Section title="Service Address">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={lbl}>Country/Region</label>
              <select name="country" value={addressForm.country} onChange={handleAddressChange} style={inp}>
                <option value="India" style={{ background: "#1e293b", color: "#f1f5f9" }}>India</option>
              </select>
            </div>
            
            <div style={detGrid}>
              <div>
                <label style={lbl}>Full name</label>
                <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} style={inp} placeholder="First and Last name" />
              </div>
              <div>
                <label style={lbl}>Mobile number</label>
                <input type="text" name="mobile" value={addressForm.mobile} onChange={handleAddressChange} style={inp} placeholder="10-digit mobile number" />
              </div>
            </div>

            <div>
              <label style={lbl}>Pincode</label>
              <input type="text" name="pincode" value={addressForm.pincode} onChange={handleAddressChange} style={inp} placeholder="6 digits [0-9] PIN code" />
            </div>

            <div>
              <label style={lbl}>Flat, House no., Building, Company, Apartment</label>
              <input type="text" name="flatHouse" value={addressForm.flatHouse} onChange={handleAddressChange} style={inp} />
            </div>

            <div>
              <label style={lbl}>Area, Street, Sector, Village</label>
              <input type="text" name="areaStreet" value={addressForm.areaStreet} onChange={handleAddressChange} style={inp} />
            </div>

            <div>
              <label style={lbl}>Landmark (Optional)</label>
              <input type="text" name="landmark" value={addressForm.landmark} onChange={handleAddressChange} style={inp} placeholder="E.g. near apollo hospital" />
            </div>

            <div style={detGrid}>
              <div>
                <label style={lbl}>Town/City</label>
                <input type="text" name="townCity" value={addressForm.townCity} onChange={handleAddressChange} style={inp} />
              </div>
              <div>
                <label style={lbl}>State</label>
                <select name="state" value={addressForm.state} onChange={handleAddressChange} style={inp}>
                  <option value="" disabled style={{ background: "#1e293b", color: "#94a3b8" }}>Choose a state</option>
                  <option value="Andhra Pradesh" style={{ background: "#1e293b", color: "#f1f5f9" }}>Andhra Pradesh</option>
                  <option value="Karnataka" style={{ background: "#1e293b", color: "#f1f5f9" }}>Karnataka</option>
                  <option value="Kerala" style={{ background: "#1e293b", color: "#f1f5f9" }}>Kerala</option>
                  <option value="Maharashtra" style={{ background: "#1e293b", color: "#f1f5f9" }}>Maharashtra</option>
                  <option value="Tamil Nadu" style={{ background: "#1e293b", color: "#f1f5f9" }}>Tamil Nadu</option>
                  <option value="Telangana" style={{ background: "#1e293b", color: "#f1f5f9" }}>Telangana</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        {/* Payment */}
        <Section title="Payment Method">
          <div style={pmGrid}>
            {PAYMENT_METHODS.map(({ id, icon }) => {
              const sel = paymentMethod === id;
              return (
                <button key={id} type="button" onClick={() => setPaymentMethod(id)}
                  style={{ ...pmBtn, borderColor: sel ? "#38bdf8" : "rgba(255,255,255,0.1)", background: sel ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)", color: sel ? "#38bdf8" : "#94a3b8" }}
                >
                  <span style={{ fontSize: "22px", marginBottom: "6px" }}>{icon}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{id}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Summary */}
        <div style={summaryBox}>
          <div>
            <p style={sumLabel}>Selected</p>
            <p style={sumVal}>{selectedItems.length > 0 ? selectedItems.map(i => i.name).join(", ") : "None"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={sumLabel}>Total</p>
            <p style={{ ...sumVal, fontSize: "24px", color: "#38bdf8" }}>₹{totalAmount}</p>
          </div>
        </div>

        <button onClick={confirmBooking} style={confirmBtn}
          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#0ea5e9,#6366f1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(56,189,248,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#38bdf8,#818cf8)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(56,189,248,0.35)"; }}
        >
          Confirm Booking • ₹{totalAmount}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h3 style={secTitle}>{title}</h3>
      {children}
    </div>
  );
}

const page = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1a1f3a 50%,#0f172a 100%)", padding: "30px 20px", fontFamily: "'Inter','Poppins',sans-serif" };
const container = { maxWidth: "800px", margin: "0 auto", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(16px)" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" };
const headerSub = { fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "4px" };
const headerTitle = { fontSize: "24px", fontWeight: 800, color: "#f1f5f9", margin: 0 };
const closeBtn = { width: "38px", height: "38px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "16px", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 };
const secTitle = { fontSize: "14px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" };
const infoBox = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" };
const infoBadge = { padding: "6px 14px", borderRadius: "999px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", fontWeight: 700, fontSize: "13px", flexShrink: 0 };
const infoDesc = { color: "#94a3b8", fontSize: "14px", margin: 0 };
const optGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "12px" };
const optBtn = { padding: "16px 12px", borderRadius: "14px", border: "1px solid", cursor: "pointer", textAlign: "center", transition: "all 0.2s", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" };
const checkMark = { position: "absolute", top: "8px", right: "10px", color: "#38bdf8", fontWeight: 900, fontSize: "14px" };
const optName = { fontSize: "13px", fontWeight: 700, color: "#f1f5f9", marginBottom: "6px" };
const optPrice = { fontSize: "13px", color: "#94a3b8", fontWeight: 600 };
const detGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" };
const lbl = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.5px" };
const inp = { padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f1f5f9", fontSize: "14px", outline: "none", transition: "all 0.2s", width: "100%", boxSizing: "border-box" };
const pmGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "12px" };
const pmBtn = { padding: "14px", borderRadius: "14px", border: "1px solid", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", transition: "all 0.2s" };
const summaryBox = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px" };
const sumLabel = { fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" };
const sumVal = { fontSize: "14px", color: "#cbd5e1", fontWeight: 600, margin: 0 };
const confirmBtn = { width: "100%", padding: "16px", background: "linear-gradient(135deg,#38bdf8,#818cf8)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "17px", fontWeight: 800, cursor: "pointer", transition: "all 0.25s", boxShadow: "0 6px 20px rgba(56,189,248,0.35)" };
const flashBox = { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontWeight: 600, fontSize: "14px", textAlign: "center" };
const flashError = { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" };

export default Bookings;