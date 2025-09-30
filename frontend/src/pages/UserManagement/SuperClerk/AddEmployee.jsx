import { useState, useEffect } from "react";
import api from "../../../utils/api";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "",
    employee_id: "",
    email: "",
    college_id: "",
    department_id: "",
  });
  const [msg, setMsg] = useState("");
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCol = await api.get("/colleges");
        setColleges(resCol.data);

        const resDept = await api.get("/departments");
        setDepartments(resDept.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/super-clerk/create-employee", form);
      setMsg(`✅ Employee created. Temp Password: ${res.data.temp_password}`);
      setForm({
        name: "",
        employee_id: "",
        email: "",
        college_id: "",
        department_id: "",
      });
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create employee");
    }
  };

  // filter departments by selected college
  const filteredDepartments = form.college_id
    ? departments.filter((d) => d.college_id == form.college_id)
    : [];

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        Add Employee (College & Department wise)
      </h2>
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

        {/* College Dropdown */}
        <select
          value={form.college_id}
          onChange={(e) =>
            setForm({ ...form, college_id: e.target.value, department_id: "" })
          }
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Select College</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>

        {/* Department Dropdown */}
        <select
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
          className="border p-2 mb-4 w-full"
          required
          disabled={!form.college_id}
        >
          <option value="">Select Department</option>
          {filteredDepartments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.code})
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
