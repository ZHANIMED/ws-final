import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../JS/Actions/user";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth, loadUser, errors } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const errorMessages = useMemo(() => {
    if (!errors) return [];

    if (Array.isArray(errors)) return errors.map((e) => e.msg || String(e));
    if (errors.errors && Array.isArray(errors.errors))
      return errors.errors.map((e) => e.msg || String(e));
    if (typeof errors === "string") return [errors];
    if (errors.msg) return [errors.msg];

    return [];
  }, [errors]);

  // ✅ si login OK => FoodList
  useEffect(() => {
    if (isAuth) navigate("/foodlist");
  }, [isAuth, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        {errorMessages.length > 0 && (
          <div className="error-box" style={{ marginBottom: 12, color: "red" }}>
            {errorMessages.map((m, i) => (
              <p key={i} style={{ margin: 0 }}>
                {m}
              </p>
            ))}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          <button className="login-btn" type="submit" disabled={loadUser}>
            {loadUser ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span
            className="link"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;