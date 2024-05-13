import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerWithEmailAndPassword = async () => {
    if (!username || !email || !password) {
      alert("Please enter username, email, and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message); // Display registration success message
        navigate("/"); // Redirect to login page after registration
      } else {
        console.error("Registration failed:", responseData.detail);
        alert("Registration failed: " + responseData.detail);
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert("Registration failed: " + error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: "google_id_token_here", // Replace with actual Google ID token
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message); // Display registration success message
        navigate("/"); // Redirect to login page after registration
      } else {
        console.error("Google registration failed:", responseData.detail);
        alert("Google registration failed: " + responseData.detail);
      }
    } catch (error) {
      console.error("Google registration failed:", error.message);
      alert("Google registration failed: " + error.message);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn" onClick={registerWithEmailAndPassword}>
          Register
        </button>
        {/* Disable Google registration for now */}
        {/* <button className="register__btn register__google" onClick={handleGoogleRegister}>
          Register with Google
        </button> */}

        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Register;
