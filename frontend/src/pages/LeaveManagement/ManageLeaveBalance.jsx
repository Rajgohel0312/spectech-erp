import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ManageLeaveBalance() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [balances, setBalances] = useState({ cl: 0, sl: 0, vl: 0 });
  const token = localStorage.getItem("token");

  // Fetch employees (Admin/SuperClerk API)
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("API response:", res.data);
        setEmployees(res.data.data || []); // ✅ actual employee array is in res.data.data
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch current balances for selected employee
  const fetchBalance = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/leave-balance/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalances({
        cl: res.data.cl,
        sl: res.data.sl,
        vl: res.data.vl,
      });
    } catch (err) {
      console.error("Error fetching balance:", err);
      toast.error("Could not load balances for this employee.");
      setBalances({ cl: 0, sl: 0, vl: 0 });
    }
  };

  // When employee changes
  const handleEmployeeChange = (id) => {
    setSelectedId(id);
    if (id) fetchBalance(id);
  };

  // Save updated balances
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/leave-balance/${selectedId}`,
        balances,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Leave balance updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update balance");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <h1 className="text-2xl font-bold">Manage Leave Balances</h1>

      {/* Select employee */}
      <div>
        <label className="block mb-2 font-medium">Select Employee</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedId}
          onChange={(e) => handleEmployeeChange(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {Array.isArray(employees) &&
            employees
              .filter(
                (emp) =>
                  emp.roles.includes("employee") ||
                  emp.roles.includes("superClerk") ||
                  emp.roles.includes("clerk") ||
                  emp.roles.includes("superAccountant") ||
                  emp.roles.includes("accountant") ||
                  emp.roles.includes("faculty") ||
                  emp.roles.includes("employee") ||
                  emp.roles.includes("labAssistant") ||
                  emp.roles.includes("store") // ✅ only show these
              )
              .map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                  {emp.employee_id ? ` | ID: ${emp.employee_id}` : ""}
                </option>
              ))}
        </select>
      </div>

      {/* Input balances */}
      {selectedId && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Casual Leave (CL)</label>
            <input
              type="number"
              placeholder="CL"
              value={balances.cl}
              onChange={(e) =>
                setBalances({ ...balances, cl: Number(e.target.value) })
              }
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Sick Leave (SL)</label>
            <input
              type="number"
              placeholder="SL"
              value={balances.sl}
              onChange={(e) =>
                setBalances({ ...balances, sl: Number(e.target.value) })
              }
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Vacation Leave (VL)</label>
            <input
              type="number"
              placeholder="VL"
              value={balances.vl}
              onChange={(e) =>
                setBalances({ ...balances, vl: Number(e.target.value) })
              }
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!selectedId}
        className="bg-[#52a4b0] text-white px-4 py-2 rounded mt-4"
      >
        Save Balance
      </button>
    </div>
  );
}
