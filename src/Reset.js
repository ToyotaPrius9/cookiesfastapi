import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        console.log(await response.json()); // Log response from backend
        alert("Password reset email sent. Please check your inbox.");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Password Reset Error:", errorData.detail);
        // Handle password reset error (display error message to user)
      }
    } catch (error) {
      console.error("Password Reset Error:", error.message);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button className="reset__btn" onClick={handlePasswordReset}>
          Send password reset email
        </button>

        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Reset;