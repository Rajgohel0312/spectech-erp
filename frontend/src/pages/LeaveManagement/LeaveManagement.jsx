import { useState, useEffect } from "react";
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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [requestTab, setRequestTab] = useState("Pending");
  const [viewCollege, setViewCollege] = useState("");
  const [uploadCollege, setUploadCollege] = useState("");
  const [collegeData, setCollegeData] = useState({});
  const [leaveType, setLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReplacement, setLeaveReplacement] = useState(""); // Delegation
  const [isHalfDay, setIsHalfDay] = useState(false); // Half-Day
  const [halfDaySlot, setHalfDaySlot] = useState("AM");
  const [leaveHistory, setLeaveHistory] = useState([]);

  // Filters / search
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Dummy data
  useEffect(() => {
    if (userRole === "clerk") {
      setEmployees([
        {
          "Name of Staff": "Dr. PRABHAT KASRA",
          CL: 12,
          SL: 45,
          VL: 46,
          LWP: 0,
        },
        { "Name of Staff": "Dr. ARTI PATEL", CL: 12, SL: 30, VL: 14, LWP: 0 },
      ]);
      setLeaveHistory([
        {
          employee: "Dr. PRABHAT KASRA",
          type: "CL",
          reason: "Family Function",
          from: "2025-07-05",
          to: "2025-07-06",
          status: "Pending",
        },
        {
          employee: "Dr. ARTI PATEL",
          type: "SL",
          reason: "Fever",
          from: "2025-08-10",
          to: "2025-08-11",
          status: "Approved",
        },
        {
          employee: "Dr. JAY SHAH",
          type: "VL",
          reason: "Vacation Trip",
          from: "2025-09-18",
          to: "2025-09-25",
          status: "Rejected",
        },
      ]);
    }
    if (userRole === "superClerk") {
      setCollegeData({
        "SPEC College of Engineering": [
          { "Name of Staff": "Engg Faculty 1", CL: 10, SL: 5, VL: 2, LWP: 0 },
          { "Name of Staff": "Engg Faculty 2", CL: 8, SL: 4, VL: 6, LWP: 1 },
        ],
        "SPEC College of Pharmacy": [
          { "Name of Staff": "Pharma Faculty 1", CL: 12, SL: 7, VL: 5, LWP: 0 },
        ],
      });
      setLeaveHistory([
        {
          employee: "Engg Faculty 1",
          type: "VL",
          reason: "Conference",
          from: "2025-10-12",
          to: "2025-10-14",
          status: "Pending",
        },
        {
          employee: "Pharma Faculty 1",
          type: "CL",
          reason: "Personal Work",
          from: "2025-11-02",
          to: "2025-11-02",
          status: "Approved",
        },
        {
          employee: "Engg Faculty 2",
          type: "SL",
          reason: "Medical Checkup",
          from: "2025-11-15",
          to: "2025-11-16",
          status: "Rejected",
        },
      ]);
    }
  }, [userRole]);

  // CSV Upload
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

  // Events (calendar)
  const [events, setEvents] = useState([
    { title: "CL", start: "2025-07-05", color: "green" },
    { title: "VL", start: "2025-07-20", color: "orange" },
    { title: "SL", start: "2025-08-10", color: "blue" },
  ]);

  // Chart (static demo)
  const chartData = [
    { name: "CL Used", value: 8 },
    { name: "SL Used", value: 5 },
    { name: "VL Used", value: 4 },
    { name: "Balance", value: 80 },
  ];

  // Apply Leave (Employee) with Delegation + Half-Day
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveType || !leaveFrom || !leaveTo) {
      toast.error("Please fill all required fields!");
      return;
    }
    const newLeave = {
      employee: "Self",
      type: leaveType,
      reason: leaveReason,
      replacement: leaveReplacement || "",
      halfDay: isHalfDay,
      slot: isHalfDay ? halfDaySlot : null,
      from: leaveFrom,
      to: leaveTo,
      status: "Pending",
    };
    setLeaveHistory((prev) => [...prev, newLeave]);
    setEvents((prev) => [
      ...prev,
      {
        title: leaveType,
        start: leaveFrom,
        end: leaveTo,
        color:
          leaveType === "CL"
            ? "green"
            : leaveType === "SL"
            ? "blue"
            : leaveType === "VL"
            ? "orange"
            : leaveType === "DL"
            ? "purple"
            : "red",
      },
    ]);
    toast.success("Leave Applied Successfully!");
    setLeaveType("");
    setLeaveReason("");
    setLeaveFrom("");
    setLeaveTo("");
    setLeaveReplacement("");
    setIsHalfDay(false);
    setHalfDaySlot("AM");
  };

  // Approve/Reject + Auto Balance Deduction
  const handleLeaveAction = (index, action) => {
    const updated = [...leaveHistory];
    const leave = updated[index];
    updated[index].status = action;

    if (action === "Approved") {
      // Deduct from clerk employee list
      setEmployees((prev) =>
        prev.map((emp) =>
          emp["Name of Staff"] === leave.employee
            ? {
                ...emp,
                [leave.type]: Math.max(
                  0,
                  (emp[leave.type] || 0) - (leave.halfDay ? 0.5 : 1)
                ),
              }
            : emp
        )
      );

      // Deduct from superClerk selected college if applicable
      if (userRole === "superClerk" && viewCollege) {
        setCollegeData((prev) => {
          const list = prev[viewCollege] || [];
          const updatedList = list.map((emp) =>
            emp["Name of Staff"] === leave.employee
              ? {
                  ...emp,
                  [leave.type]: Math.max(
                    0,
                    (emp[leave.type] || 0) - (leave.halfDay ? 0.5 : 1)
                  ),
                }
              : emp
          );
          return { ...prev, [viewCollege]: updatedList };
        });
      }
    }

    setLeaveHistory(updated);
    toast.success(`Leave ${action}`);
  };

  // Export report (Excel)
  const handleExport = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  // Filters
  const filteredEmployees = employees.filter((emp) =>
    (emp["Name of Staff"] || "")
      .toLowerCase()
      .includes(employeeSearch.toLowerCase())
  );

  const filteredCollegeEmployees = viewCollege
    ? (collegeData[viewCollege] || []).filter((emp) =>
        (emp["Name of Staff"] || "")
          .toLowerCase()
          .includes(employeeSearch.toLowerCase())
      )
    : [];

  const filteredRequests = leaveHistory.filter((req) => {
    const matchesTab = req.status === requestTab || requestTab === "All";
    const matchesSearch = searchTerm
      ? (req.employee || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesType = filterType ? req.type === filterType : true;
    const matchesFrom = filterFrom ? req.from >= filterFrom : true;
    const matchesTo = filterTo ? req.to <= filterTo : true;
    return (
      matchesTab && matchesSearch && matchesType && matchesFrom && matchesTo
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8 font-sans">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        Leave Management <span className="text-[#52a4b0]">({userRole})</span>
      </h1>

      {/* === SUPER CLERK === */}
      {userRole === "superClerk" && (
        <>
          {/* College Selection */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-wrap items-center gap-4">
            <label className="font-medium text-gray-700">Select College:</label>
            <select
              value={viewCollege}
              onChange={(e) => setViewCollege(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
            >
              <option value="">-- Select College --</option>
              {Object.keys(collegeData).map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Search staff..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
              <button
                onClick={() =>
                  handleExport(
                    viewCollege ? filteredCollegeEmployees : [],
                    `${viewCollege || "College"}_Staff_Leave.xlsx`
                  )
                }
                disabled={!viewCollege}
                className={`px-4 py-2 rounded-lg font-medium text-white transition ${
                  viewCollege
                    ? "bg-[#52a4b0] hover:bg-[#42939d]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Export Staff (Excel)
              </button>
            </div>
          </div>

          {/* Upload CSV */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-wrap items-center gap-4">
            <label className="font-medium text-gray-700">
              Upload CSV for College:
            </label>
            <select
              value={uploadCollege}
              onChange={(e) => setUploadCollege(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
            >
              <option value="">-- Select College --</option>
              <option value="SPEC College of Engineering">
                SPEC College of Engineering
              </option>
              <option value="SPEC College of Pharmacy">
                SPEC College of Pharmacy
              </option>
              <option value="SPEC MBA">SPEC MBA</option>
            </select>
            <input
              type="file"
              accept=".csv"
              disabled={!uploadCollege}
              onChange={(e) =>
                handleCSVUpload(e.target.files[0], uploadCollege)
              }
              className="file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#52a4b0] file:text-white hover:file:bg-[#42939d]"
            />
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
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

          {/* Employees of Selected College */}
          {viewCollege && (
            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">
                {viewCollege} - Staff Leave Records
              </h2>
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2">Sr</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">CL</th>
                    <th className="px-3 py-2">SL</th>
                    <th className="px-3 py-2">VL</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">LWP</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollegeEmployees.map((emp, idx) => (
                    <tr key={idx} className="text-center hover:bg-gray-50">
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">{emp["Name of Staff"]}</td>
                      <td className="px-3 py-2">{emp["CL"]}</td>
                      <td className="px-3 py-2">{emp["SL"]}</td>
                      <td className="px-3 py-2">{emp["VL"]}</td>
                      <td className="px-3 py-2">
                        {Number(emp["CL"] || 0) +
                          Number(emp["SL"] || 0) +
                          Number(emp["VL"] || 0)}
                      </td>
                      <td className="px-3 py-2">{emp["LWP"] || 0}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="bg-[#52a4b0] hover:bg-[#42939d] text-white px-3 py-1 rounded-lg transition"
                        >
                          View Calendar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* === CLERK === */}
      {userRole === "clerk" && (
        <div className="space-y-6">
          {/* Staff Records */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Staff Leave Records
              </h2>
              <div className="ml-auto flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                />
                <button
                  onClick={() =>
                    handleExport(filteredEmployees, "Staff_Leave.xlsx")
                  }
                  className="bg-[#52a4b0] hover:bg-[#42939d] text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Export Staff (Excel)
                </button>
              </div>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleCSVUpload(e.target.files[0])}
              className="mb-4 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#52a4b0] file:text-white hover:file:bg-[#42939d]"
            />
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2">Sr</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">CL</th>
                  <th className="px-3 py-2">SL</th>
                  <th className="px-3 py-2">VL</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">LWP</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, idx) => (
                  <tr key={idx} className="text-center hover:bg-gray-50">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{emp["Name of Staff"]}</td>
                    <td className="px-3 py-2">{emp["CL"]}</td>
                    <td className="px-3 py-2">{emp["SL"]}</td>
                    <td className="px-3 py-2">{emp["VL"]}</td>
                    <td className="px-3 py-2">
                      {Number(emp["CL"] || 0) +
                        Number(emp["SL"] || 0) +
                        Number(emp["VL"] || 0)}
                    </td>
                    <td className="px-3 py-2">{emp["LWP"] || 0}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="bg-[#52a4b0] hover:bg-[#42939d] text-white px-3 py-1 rounded-lg transition"
                      >
                        View Calendar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leave Requests Section */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Leave Requests
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Pending", "Approved", "Rejected", "All"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRequestTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    requestTab === tab
                      ? tab === "Pending"
                        ? "bg-blue-500 text-white"
                        : tab === "Approved"
                        ? "bg-green-500 text-white"
                        : tab === "Rejected"
                        ? "bg-red-500 text-white"
                        : "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters + Export */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
              >
                <option value="">All Types</option>
                <option value="CL">CL</option>
                <option value="SL">SL</option>
                <option value="VL">VL</option>
                <option value="DL">DL</option>
                <option value="LWP">LWP</option>
              </select>
              <input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
              <input
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
              />
              <button
                onClick={() =>
                  handleExport(filteredRequests, "Leave_Report.xlsx")
                }
                className="bg-[#52a4b0] hover:bg-[#42939d] text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Download Report (Excel)
              </button>
            </div>

            {/* Requests Table */}
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2">Employee</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Reason</th>
                  <th className="px-3 py-2">From</th>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Replacement</th>
                  <th className="px-3 py-2">Half-Day</th>
                  {requestTab !== "Approved" && requestTab !== "Rejected" && (
                    <th className="px-3 py-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, idx) => (
                  <tr key={idx} className="text-center hover:bg-gray-50">
                    <td className="px-3 py-2">{req.employee || "Self"}</td>
                    <td className="px-3 py-2">{req.type}</td>
                    <td className="px-3 py-2">{req.reason || "-"}</td>
                    <td className="px-3 py-2">{req.from}</td>
                    <td className="px-3 py-2">{req.to}</td>
                    <td className="px-3 py-2">{req.status}</td>
                    <td className="px-3 py-2">{req.replacement || "-"}</td>
                    <td className="px-3 py-2">
                      {req.halfDay ? req.slot : "No"}
                    </td>
                    {(requestTab === "Pending" || requestTab === "All") &&
                      req.status === "Pending" && (
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleLeaveAction(idx, "Approved")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg mr-2 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveAction(idx, "Rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                          >
                            Reject
                          </button>
                        </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === EMPLOYEE === */}
      {userRole === "employee" && (
        <>
          {/* Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "CL Balance", value: 10, color: "text-green-600" },
              { label: "SL Balance", value: 18, color: "text-blue-600" },
              { label: "VL Balance", value: 5, color: "text-orange-600" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <h3 className="font-semibold">{item.label}</h3>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Apply for Leave form */}
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Apply for Leave
            </h2>
            <form
              onSubmit={handleApplyLeave}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block font-medium">Leave Type *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                >
                  <option value="">-- Select --</option>
                  <option value="CL">Casual Leave</option>
                  <option value="SL">Sick Leave</option>
                  <option value="VL">Vacation Leave</option>
                  <option value="DL">Duty Leave</option>
                  <option value="LWP">Loss of Pay</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Reason</label>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block font-medium">From *</label>
                <input
                  type="date"
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium">To *</label>
                <input
                  type="date"
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                />
              </div>
              <div>
                <label className="block font-medium">Replacement Staff</label>
                <input
                  type="text"
                  value={leaveReplacement}
                  onChange={(e) => setLeaveReplacement(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                  placeholder="Enter colleague's name"
                />
              </div>
              <div>
                <label className="block font-medium">Half-Day</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isHalfDay}
                    onChange={(e) => setIsHalfDay(e.target.checked)}
                  />
                  {isHalfDay && (
                    <select
                      value={halfDaySlot}
                      onChange={(e) => setHalfDaySlot(e.target.value)}
                      className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#52a4b0] outline-none"
                    >
                      <option value="AM">Morning</option>
                      <option value="PM">Afternoon</option>
                    </select>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              My Leave Calendar
            </h2>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="600px"
            />
          </div>

          {/* Leave History */}
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              My Leave History
            </h2>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Reason</th>
                  <th className="px-3 py-2">Replacement</th>
                  <th className="px-3 py-2">Half-Day</th>
                  <th className="px-3 py-2">From</th>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, idx) => (
                  <tr key={idx} className="text-center hover:bg-gray-50">
                    <td className="px-3 py-2">{leave.type}</td>
                    <td className="px-3 py-2">{leave.reason || "-"}</td>
                    <td className="px-3 py-2">{leave.replacement || "-"}</td>
                    <td className="px-3 py-2">
                      {leave.halfDay ? leave.slot : "No"}
                    </td>
                    <td className="px-3 py-2">{leave.from}</td>
                    <td className="px-3 py-2">{leave.to}</td>
                    <td className="px-3 py-2">{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* === SELECTED EMPLOYEE CALENDAR (for clerk/superClerk) === */}
      {selectedEmployee &&
        (userRole === "clerk" || userRole === "superClerk") && (
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              {selectedEmployee["Name of Staff"]} - Leave Calendar
            </h2>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="600px"
            />
            <div className="mt-4 text-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium">
                + Add Extra Paid Leave
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
