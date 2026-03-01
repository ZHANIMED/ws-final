// src/Pages/Register.js
import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../JS/Actions/user";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth, loadUser, errors } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Gestion propre des erreurs
  const errorMessages = useMemo(() => {
    if (!errors) return [];

    if (Array.isArray(errors)) {
      return errors.map((e) => e.msg || String(e));
    }

    if (errors.errors && Array.isArray(errors.errors)) {
      return errors.errors.map((e) => e.msg || String(e));
    }

    if (typeof errors === "string") return [errors];
    if (errors.msg) return [errors.msg];

    return [];
  }, [errors]);

  // ✅ Redirection vers FoodList après inscription
  useEffect(() => {
    if (isAuth) {
      navigate("/foodlist");
    }
  }, [isAuth, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      firstname: firstName.trim(),
      name: lastName.trim(),
      email: email.trim(),
      password,
    };

    dispatch(register(newUser));
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Register to get started</p>

        {errorMessages.length > 0 && (
          <div className="error-box" style={{ marginBottom: 12, color: "red" }}>
            {errorMessages.map((m, i) => (
              <p key={i} style={{ margin: 0 }}>
                {m}
              </p>
            ))}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter your firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="register-btn" type="submit" disabled={loadUser}>
            {loadUser ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <span
            className="link"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
