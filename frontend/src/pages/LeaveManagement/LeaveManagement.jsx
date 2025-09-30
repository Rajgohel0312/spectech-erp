import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

const COLORS = ["#52a4b0", "#facc15", "#60a5fa", "#a78bfa"];

export default function LeaveManagement({ userRole }) {
  const [employees, setEmployees] = useState([]);
  const [collegeData, setCollegeData] = useState({});
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [requestTab, setRequestTab] = useState("Pending");

  // Employee apply form
  const [leaveType, setLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReplacement, setLeaveReplacement] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDaySlot, setHalfDaySlot] = useState("AM");

  const [balances, setBalances] = useState({ CL: 0, SL: 0, VL: 0 });
  const [events, setEvents] = useState([]);

  // Filters
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const token = localStorage.getItem("token");

  // === Fetch data from backend ===
  const fetchLeaves = async () => {
    try {
      if (userRole === "employee") {
        const res = await axios.get(
          "http://localhost:8000/api/leaves/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaveHistory(res.data);
        setEvents(
          res.data.map((l) => ({
            title: l.type,
            start: l.start_date,
            end: l.end_date,
            color:
              l.type === "casual"
                ? "green"
                : l.type === "sick"
                ? "blue"
                : l.type === "earned"
                ? "orange"
                : "red",
          }))
        );

        // fetch balances
        const balanceRes = await axios.get(
          "http://localhost:8000/api/leave-balance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBalances({
          CL: balanceRes.data.cl,
          SL: balanceRes.data.sl,
          VL: balanceRes.data.vl,
        });
      }
      if (userRole === "clerk") {
        const res = await axios.get("http://localhost:8000/api/clerk/leaves", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveHistory(res.data);
      }
      if (userRole === "superClerk") {
        const res = await axios.get(
          "http://localhost:8000/api/super-clerk/leaves",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaveHistory(res.data);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [userRole]);

  // === Apply Leave (Employee) ===
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/leaves/apply",
        {
          type: leaveType,
          start_date: leaveFrom,
          end_date: leaveTo,
          reason: leaveReason,
          replacement: leaveReplacement,
          half_day: isHalfDay,
          slot: isHalfDay ? halfDaySlot : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Leave applied successfully!");
      setLeaveType("");
      setLeaveReason("");
      setLeaveFrom("");
      setLeaveTo("");
      setLeaveReplacement("");
      setIsHalfDay(false);
      setHalfDaySlot("AM");
      fetchLeaves();
    } catch (err) {
      console.error("Error applying leave:", err);
      toast.error("Failed to apply leave.");
    }
  };

  // === Approve/Reject (Clerk/SuperClerk) ===
  const handleLeaveAction = async (leaveId, action) => {
    try {
      await axios.put(
        `http://localhost:8000/api/leaves/status/${leaveId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Leave ${action}`);
      fetchLeaves();
    } catch (err) {
      console.error("Error updating leave:", err);
      toast.error("Failed to update leave.");
    }
  };

  // === CSV Upload (SuperClerk/Clerk) ===
  const handleCSVUpload = (file, college) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (userRole === "clerk") {
          setEmployees(results.data);
          toast.success("CSV uploaded successfully!");
        } else if (userRole === "superClerk" && college) {
          setCollegeData((prev) => ({ ...prev, [college]: results.data }));
          toast.success(`CSV uploaded for ${college}!`);
        }
      },
    });
  };

  // === Export report ===
  const handleExport = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  // === Filters ===
  const filteredRequests = leaveHistory.filter((req) => {
    const matchesTab =
      req.status.toLowerCase() === requestTab.toLowerCase() ||
      requestTab === "All";
    const matchesSearch = searchTerm
      ? (req.employee?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    const matchesType = filterType ? req.type === filterType : true;
    const matchesFrom = filterFrom ? req.start_date >= filterFrom : true;
    const matchesTo = filterTo ? req.end_date <= filterTo : true;
    return (
      matchesTab && matchesSearch && matchesType && matchesFrom && matchesTo
    );
  });

  // === Chart summary ===
  const chartData = [
    {
      name: "CL Used",
      value: leaveHistory.filter((l) => l.type === "casual").length,
    },
    {
      name: "SL Used",
      value: leaveHistory.filter((l) => l.type === "sick").length,
    },
    {
      name: "VL Used",
      value: leaveHistory.filter((l) => l.type === "earned").length,
    },
    { name: "Balance", value: balances.CL + balances.SL + balances.VL },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8 font-sans">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-800">
        Leave Management <span className="text-[#52a4b0]">({userRole})</span>
      </h1>

      {/* === EMPLOYEE === */}
      {userRole === "employee" && (
        <>
          {/* Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["CL", "SL", "VL"].map((type) => (
              <div
                key={type}
                className="bg-white p-6 rounded-xl shadow text-center"
              >
                <h3 className="font-semibold">{type} Balance</h3>
                <p className="text-2xl font-bold text-[#52a4b0]">
                  {balances[type]}
                </p>
              </div>
            ))}
          </div>

          {/* Apply Leave */}
          <form
            onSubmit={handleApplyLeave}
            className="bg-white p-6 rounded-xl shadow mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="border p-2 rounded"
              required
            >
              <option value="">-- Select Leave Type --</option>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="earned">Earned Leave</option>
            </select>
            <input
              type="text"
              placeholder="Reason"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              value={leaveTo}
              onChange={(e) => setLeaveTo(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Replacement Staff"
              value={leaveReplacement}
              onChange={(e) => setLeaveReplacement(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex items-center gap-2">
              <label htmlFor="">Half Day</label>
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
              />
              {isHalfDay && (
                <select
                  value={halfDaySlot}
                  onChange={(e) => setHalfDaySlot(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="AM">Morning</option>
                  <option value="PM">Afternoon</option>
                </select>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded col-span-2"
            >
              Apply Leave
            </button>
          </form>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              My Leave Calendar
            </h2>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="600px"
            />
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="text-lg font-semibold mb-4">My Leave History</h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((l) => (
                  <tr key={l.id} className="text-center">
                    <td>{l.type}</td>
                    <td>{l.reason}</td>
                    <td>{l.start_date}</td>
                    <td>{l.end_date}</td>
                    <td>{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* === CLERK / SUPERCLERK === */}
      {(userRole === "clerk" || userRole === "superClerk") && (
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {["Pending", "Approved", "Rejected", "All"].map((tab) => (
              <button
                key={tab}
                onClick={() => setRequestTab(tab)}
                className={`px-4 py-2 rounded ${
                  requestTab === tab ? "bg-[#52a4b0] text-white" : "bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Reason</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="text-center">
                  <td>{req.employee?.name || "N/A"}</td>
                  <td>{req.type}</td>
                  <td>{req.reason}</td>
                  <td>{req.start_date}</td>
                  <td>{req.end_date}</td>
                  <td>{req.status}</td>
                  {req.status === "pending" && (
                    <td>
                      <button
                        onClick={() => handleLeaveAction(req.id, "approved")}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveAction(req.id, "rejected")}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Leave Usage Summary
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={() => handleExport(leaveHistory, "Leave_Report.xlsx")}
            className="mt-4 bg-[#52a4b0] text-white px-4 py-2 rounded"
          >
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}
