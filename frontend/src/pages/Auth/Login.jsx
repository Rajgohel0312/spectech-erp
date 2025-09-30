import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [forceChange, setForceChange] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);
      const { token, roles, must_change_password, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem("user", JSON.stringify(user));

      if (must_change_password) {
        setForceChange(true);
      } else {
        navigate("/"); // redirect safely
      }
    } catch (err) {
      alert("Invalid credentials or account inactive!");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await api.post("/change-password", {
        new_password: newPass,
        new_password_confirmation: confirmPass,
      });

      alert("Password updated! Please login again.");
      localStorage.clear();
      setForceChange(false);
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Error updating password!");
    }
  };

  if (forceChange) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handlePasswordChange} className="bg-white p-8 rounded-2xl shadow-md w-96">
          <h2 className="text-xl font-bold mb-6 text-center">Set Your New Password</h2>
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
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Save Password
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">ERP Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Roll No / Employee ID / Email"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password / DOB / Temp Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
