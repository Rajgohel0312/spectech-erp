import { useState } from "react";
import api from "../../../utils/api";

export default function AddSuperUser() {
  const [form, setForm] = useState({ name: "", email: "", role: "superClerk" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/create-super", form);
      setMsg(`✅ Created ${form.role}. Temp Password: ${res.data.temp_password}`);
    } catch (err) {
      setMsg("❌ Failed to create user");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Super User</h2>
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
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 mb-4 w-full"
        >
          <option value="superClerk">Super Clerk</option>
          <option value="superAccountant">Super Accountant</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
