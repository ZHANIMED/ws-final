import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile = () => {
  const navigate = useNavigate();

  const { user, isAuth } = useSelector((state) => state.user);

  // 🔐 Si pas connecté → redirection login
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.firstname?.[0]}
            {user.name?.[0]}
          </div>

          <div>
            <h2 className="profile-title">Profile</h2>
            <p className="profile-subtitle">
              {user.isAdmin ? "Administrator Account" : "User Account"}
            </p>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="label">Name</span>
            <span className="value">
              {user.firstname} {user.name}
            </span>
          </div>

          <div className="info-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="info-row">
            <span className="label">Role</span>
            <span className="value">
              {user.isAdmin ? "Admin" : "Normal User"}
            </span>
          </div>
        </div>

        <button className="profile-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;