import React, { useState } from "react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // backend expects `username` not `email`
        body: JSON.stringify({ username: email, password })
      });

      const text = await response.text();
      // try to parse JSON response, fallback to raw text
      let payload = text;
      try { payload = JSON.parse(text); } catch (e) {}

      if (!response.ok) {
        const msg = typeof payload === 'string' ? payload : (payload.message || JSON.stringify(payload));
        alert(`Login failed: ${msg}`);
        return;
      }

      const okMsg = typeof payload === 'string' ? payload : (payload.username || payload.message || JSON.stringify(payload));
      alert(okMsg);
    } catch (err) {
      console.error('Login error', err);
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input 
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input 
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;