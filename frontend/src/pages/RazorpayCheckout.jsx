import React, { useState } from "react";

function RazorpayCheckout() {
  const [amount, setAmount] = useState(500);
  const [bookingId, setBookingId] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const createOrder = async () => {
    const response = await fetch(`http://localhost:8081/api/payment/${bookingId}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount) * 100
      }),
    });

    return await response.json();
  };

  const verifyPayment = async (paymentResponse) => {
    const response = await fetch(`http://localhost:8081/api/payment/${bookingId}/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
      }),
    });

    return await response.json();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setMessage("");

      const isLoaded = await loadRazorpayScript();

      if (!isLoaded) {
        setMessage("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      const orderData = await createOrder();

      if (!orderData.success) {
        setMessage(orderData.message || "Order creation failed");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "QuickServe",
        description: "Test Payment",
        order_id: orderData.orderId,
        handler: async function (response) {
          const verifyData = await verifyPayment(response);

          if (verifyData.success) {
            setMessage("Payment successful and verified");
          } else {
            setMessage("Payment completed but verification failed");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          app: "QuickServe",
        },
        theme: {
          color: "#0f172a",
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
      console.error("Payment error:", error);
      setMessage("Something went wrong during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Razorpay Test Payment</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Booking ID</label>
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Enter Amount (₹)</label>
          <input
            type="number"
            value={amount}
            min="1"
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
        </div>

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
    background: "#f8fafc",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#0f172a",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
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