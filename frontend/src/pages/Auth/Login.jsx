import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [forceChange, setForceChange] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login attempt
  const handleLogin = (e) => {
    e.preventDefault();

    // 🚀 TODO: Replace with backend API response
    // Fake logic for demo:
    if (formData.username === "21CE001" && formData.password === "2003-09-06") {
      // Student first login (RollNo + DOB)
      setForceChange(true);
      setUserRole("student");
    } else if (formData.username === "F001" && formData.password === "temp@123") {
      // Faculty/Clerk first login (temp password)
      setForceChange(true);
      setUserRole("faculty");
    } else if (formData.username === "admin" && formData.password === "admin@123") {
      // Admin login (already active)
      setUserRole("admin");
      navigate("/"); // Admin Dashboard
    } else {
      // Normal existing user (already set password)
      setUserRole("student"); // Example role
      navigate("/"); // RoleBasedDashboard
    }
  };

  // Handle first-time password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    // 🚀 TODO: Call backend API to save new password
    console.log("New password set:", newPass);

    alert("Password updated! Please login again.");
    setForceChange(false);
    navigate("/login");
  };

  // Force password change screen
  if (forceChange) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handlePasswordChange}
          className="bg-white p-8 rounded-2xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-6 text-center">
            Set Your New Password
          </h2>

          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full p-3 mb-6 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Save Password
          </button>
        </form>
      </div>
    );
  }

  // Normal login form
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">ERP Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Roll No / Employee ID / Email"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:ring focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password / DOB / Temp Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg focus:ring focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
