import { useState, useEffect } from "react";
import api from "../../../utils/api";

export default function AddLabAssistant() {
  const [form, setForm] = useState({
    name: "",
    employee_id: "",
    email: "",
    college_id: "",
  });
  const [msg, setMsg] = useState("");
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await api.get("/colleges");
        setColleges(res.data);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/create-lab-assistant", form);
      setMsg(
        `✅ Lab Assistant created. Temp Password: ${res.data.temp_password}`
      );
      setForm({ name: "", employee_id: "", email: "", college_id: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("❌ Failed to create lab assistant");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Lab Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <select
          value={form.college_id}
          onChange={(e) => setForm({ ...form, college_id: e.target.value })}
          className="border p-2 mb-4 w-full"
          required
        >
          <option value="">Select College</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
