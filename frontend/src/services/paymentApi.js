const BASE_URL = "http://localhost:8081/api/payment";

export async function createRazorpayOrder(amount) {
  const response = await fetch(`${BASE_URL}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,
      currency: "INR",
      receipt: "receipt_" + new Date().getTime(),
    }),
  });

  return await response.json();
}

export async function verifyRazorpayPayment(paymentData) {
  const response = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpayOrderId: paymentData.razorpay_order_id,
      razorpayPaymentId: paymentData.razorpay_payment_id,
      razorpaySignature: paymentData.razorpay_signature,
    }),
  });

  return await response.json();
}
