import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", college_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  // 🔹 Fetch both departments + colleges
  const fetchData = async () => {
    try {
      const [resDept, resCol] = await Promise.all([
        api.get("/departments"),
        api.get("/colleges"),
      ]);
      setDepartments(resDept.data);
      setColleges(resCol.data);
    } catch (err) {
      console.error("Failed to fetch data", err.response?.data || err.message);
      setMsg("❌ Failed to load data");
    }
  };

  // 🔹 Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, form);
        setMsg("✅ Department updated!");
      } else {
        await api.post("/departments", form);
        setMsg("✅ Department created!");
      }
      setForm({ name: "", code: "", college_id: "" });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("❌ Failed to save department");
    }
  };

  // 🔹 Edit
  const handleEdit = (dept) => {
    setForm({
      name: dept.name,
      code: dept.code,
      college_id: dept.college_id,
    });
    setEditingId(dept.id);
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      await api.delete(`/departments/${id}`);
      setMsg("✅ Department deleted!");
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("❌ Failed to delete department");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Departments</h2>

      {msg && <p className="mb-4">{msg}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
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
        <select
          value={form.college_id}
          onChange={(e) => setForm({ ...form, college_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select College</option>
          {colleges.length > 0 ? (
            colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))
          ) : (
            <option disabled>No colleges found</option>
          )}
        </select>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            editingId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", code: "", college_id: "" });
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">College</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.length > 0 ? (
            departments.map((d) => (
              <tr key={d.id}>
                <td className="border p-2">{d.id}</td>
                <td className="border p-2">{d.name}</td>
                <td className="border p-2">{d.code}</td>
                <td className="border p-2">
                  {/* Show college name if eager loaded, else fallback */}
                  {d.college?.name ||
                    colleges.find((c) => c.id === d.college_id)?.name ||
                    "—"}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
