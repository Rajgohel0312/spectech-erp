import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  const fetchUsers = async (page = 1) => {
    try {
      const res = await api.get("/admin/users", {
        params: { search, role, status, page, per_page: 5 },
      });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to load users");
    }
  };

  const toggleActivation = async (id) => {
    try {
      const res = await api.post(`/admin/toggle-activation/${id}`);
      setMsg(`✅ ${res.data.message}`);
      fetchUsers(pagination.current_page);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to update user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, status]);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name/email/ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-60"
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="superClerk">Super Clerk</option>
          <option value="clerk">Clerk</option>
          <option value="superAccountant">Super Accountant</option>
          <option value="accountant">Accountant</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {msg && <p className="mb-4">{msg}</p>}

      {/* User Table */}
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">College</th> {/* ✅ New column */}
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email || u.enrollment || u.employee_id}</td>
                <td className="border p-2">
                  {u.roles && u.roles.length > 0 ? u.roles.join(", ") : "-"}
                </td>
                <td className="border p-2">
                  {u.college ? `${u.college.name} (${u.college.code})` : "-"}
                </td>
                <td className="border p-2">
                  {u.is_active ? (
                    <span className="text-green-600 font-bold">Active</span>
                  ) : (
                    <span className="text-red-600 font-bold">Inactive</span>
                  )}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => toggleActivation(u.id)}
                    className={`px-3 py-1 rounded text-white ${
                      u.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={pagination.current_page <= 1}
          onClick={() => fetchUsers(pagination.current_page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.current_page} of {pagination.last_page}
        </span>
        <button
          disabled={pagination.current_page >= pagination.last_page}
          onClick={() => fetchUsers(pagination.current_page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
