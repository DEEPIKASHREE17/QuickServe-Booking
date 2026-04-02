import React, { useState } from "react";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/paymentApi";

function RazorpayCheckout() {
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setMessage("");

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      const amountInPaise = Number(amount) * 100;

      const orderResponse = await createRazorpayOrder(amountInPaise);

      if (!orderResponse.success) {
        setMessage(orderResponse.message || "Failed to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "QuickServe",
        description: "Test Payment",
        order_id: orderResponse.orderId,
        handler: async function (response) {
          const verifyResponse = await verifyRazorpayPayment(response);

          if (verifyResponse.success) {
            setMessage("Payment successful and verified");
          } else {
            setMessage("Payment done but verification failed");
          }
        },
        prefill: {
          name: "Bhuvana",
          email: "bhuvana@example.com",
          contact: "9999999999",
        },
        notes: {
          project: "QuickServe",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setMessage("Payment popup closed");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while starting payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Razorpay Test Payment</h2>

        <label style={styles.label}>Amount in Rupees</label>
        <input
          type="number"
          value={amount}
          min="1"
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        <button onClick={handlePayment} style={styles.button} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#1f2937",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  message: {
    marginTop: "18px",
    textAlign: "center",
    color: "#111827",
    fontWeight: "500",
  },
};

export default RazorpayCheckout;
