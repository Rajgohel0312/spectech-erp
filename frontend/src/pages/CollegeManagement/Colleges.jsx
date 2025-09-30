import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });

  const fetchColleges = async () => {
    const res = await api.get("/colleges");
    setColleges(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/colleges", form);
    setForm({ name: "", code: "" });
    fetchColleges();
  };

  useEffect(() => { fetchColleges(); }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Colleges</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
