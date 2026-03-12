import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

function Bookings() {
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackService = {
    name: "Salon",
    description: "Beauty and grooming services",
    cost: 299,
  };

  const service = location.state || fallbackService;

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [locationText, setLocationText] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const serviceOptionsMap = {
    Salon: [
      { name: "Facial", price: 299 },
      { name: "Eyebrows", price: 99 },
      { name: "Pedicure", price: 399 },
      { name: "Manicure", price: 349 },
      { name: "Hair Spa", price: 499 },
      { name: "Hair Cut", price: 199 },
    ],
    Electrician: [
      { name: "Fan Repair", price: 249 },
      { name: "Switch Board Repair", price: 199 },
      { name: "Light Installation", price: 149 },
      { name: "Wiring Check", price: 299 },
    ],
    Plumber: [
      { name: "Tap Repair", price: 199 },
      { name: "Pipe Leakage Fix", price: 299 },
      { name: "Wash Basin Repair", price: 249 },
      { name: "Toilet Fitting", price: 349 },
    ],
    Carpenter: [
      { name: "Door Repair", price: 299 },
      { name: "Furniture Assembly", price: 399 },
      { name: "Shelf Installation", price: 249 },
      { name: "Chair Repair", price: 199 },
    ],
    Painter: [
      { name: "Wall Painting", price: 999 },
      { name: "Door Painting", price: 399 },
      { name: "Touch Up Work", price: 299 },
      { name: "Ceiling Paint", price: 499 },
    ],
    Cleaner: [
      { name: "Home Cleaning", price: 599 },
      { name: "Bathroom Cleaning", price: 299 },
      { name: "Kitchen Cleaning", price: 399 },
      { name: "Sofa Cleaning", price: 349 },
    ],
    "AC Repair": [
      { name: "AC Service", price: 499 },
      { name: "Gas Filling", price: 999 },
      { name: "Water Leakage Fix", price: 399 },
      { name: "Installation", price: 1299 },
    ],
    "Appliance Repair": [
      { name: "Washing Machine Repair", price: 499 },
      { name: "Fridge Repair", price: 599 },
      { name: "Microwave Repair", price: 399 },
      { name: "TV Repair", price: 699 },
    ],
  };

  const options = serviceOptionsMap[service.name] || [
    { name: service.name, price: service.cost || 299 },
  ];

  const handleToggleItem = (item) => {
    const exists = selectedItems.find((selected) => selected.name === item.name);

    if (exists) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.name !== item.name)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  }, [selectedItems]);

  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const handleConfirmBooking = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one service activity");
      return;
    }

    if (!bookingDate || !bookingTime) {
      alert("Please select booking date and time");
      return;
    }

    if (!locationText.trim()) {
      alert("Please enter your location");
      return;
    }

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const matchedProvider = users.find(
      (u) => u.role === "PROVIDER" && u.service === service.name
    );

    const newBooking = {
      id: Date.now(),
      customerName: user.name || "User",
      customerEmail: user.email || "",
      providerName: matchedProvider ? matchedProvider.name : "Not Assigned",
      providerEmail: matchedProvider ? matchedProvider.email : "",
      providerService: matchedProvider ? matchedProvider.service : service.name,
      categoryName: service.name,
      description: service.description || "",
      selectedServices: selectedItems,
      totalCost: totalAmount,
      bookingDate,
      bookingTime: formatTimeTo12Hour(bookingTime),
      location: locationText,
      paymentMethod,
      status: "Pending",
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    existingBookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(existingBookings));

    alert("Booking confirmed successfully");
    navigate("/my-bookings");
  };

  const isSelected = (itemName) =>
    selectedItems.some((item) => item.name === itemName);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "22px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #ff5f8f 0%, #ff7aa2 100%)",
            color: "white",
            padding: "22px",
            borderRadius: "18px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, marginBottom: "6px" }}>Complete Booking</h2>
            <p style={{ margin: 0 }}>{service.name}</p>
          </div>

          <button
            onClick={() => navigate("/categories")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={sectionTitle}>Service Details</h3>
          <div style={boxStyle}>
            <p style={textRow}><strong>Service:</strong> {service.name}</p>
            <p style={textRow}><strong>Description:</strong> {service.description}</p>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={sectionTitle}>Select Service Activities</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            {options.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToggleItem(item)}
                style={{
                  padding: "15px 12px",
                  borderRadius: "12px",
                  border: isSelected(item.name)
                    ? "2px solid #ff5f8f"
                    : "1px solid #d1d5db",
                  background: isSelected(item.name) ? "#fff1f5" : "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                <div>{item.name}</div>
                <div style={{ marginTop: "6px", color: "#6b7280" }}>₹{item.price}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={sectionTitle}>Booking Details</h3>

          <label style={labelStyle}>Select Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Select Time</label>
          <input
            type="time"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Your Location</label>
          <input
            type="text"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="Enter your address"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={sectionTitle}>Payment Method</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {["Credit/Debit Card", "UPI", "Cash on Service", "Wallet"].map(
              (method, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border:
                      paymentMethod === method
                        ? "2px solid #ff5f8f"
                        : "1px solid #d1d5db",
                    background: paymentMethod === method ? "#fff1f5" : "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  {method}
                </button>
              )
            )}
          </div>
        </div>

        <div style={boxStyle}>
          <p style={textRow}>
            <strong>Selected Services:</strong>{" "}
            {selectedItems.length > 0
              ? selectedItems.map((item) => item.name).join(", ")
              : "None"}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Total Amount: ₹{totalAmount}
          </p>
        </div>

        <button
          onClick={handleConfirmBooking}
          style={{
            ...primaryButton,
            width: "100%",
            marginTop: "22px",
            background: "#ff5f8f",
          }}
        >
          Confirm Booking • ₹{totalAmount}
        </button>
      </div>
    </div>
  );
}

const sectionTitle = {
  marginBottom: "12px",
  color: "#111827",
};

const boxStyle = {
  background: "#fafafa",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "18px",
};

const textRow = {
  marginBottom: "8px",
  color: "#374151",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
};

const primaryButton = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#4f6bed",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

export default Bookings;