import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutauthapi } from '../../services/axiosInstance'; // Import the logoutauthapi method
import { logout } from "../../slices/auth/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = async () => {
    try {
      if (token) {
        // Use the logoutauthapi method
        await logoutauthapi(token);
        dispatch(logout()); // Clear Redux state
        localStorage.removeItem("token"); // Clear local storage
        navigate("/login", { replace: true }); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout error:", error.response || error.message);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <p
      onClick={handleLogout}
    >
      Logout
    </p>
  );
};

export default Logout;
