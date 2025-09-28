import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductMaster from "./pages/ProductMaster/ProductMaster";
import IssuedHistory from "./pages/IssuedHistory/IssuedHistory";
import PurchaseOrders from "./pages/Store/PurchaseOrders";
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";

import Students from "./pages/AcademicManagement/Students";
import Courses from "./pages/AcademicManagement/Courses";
import Exams from "./pages/AcademicManagement/Exams";
import RoleBasedDashboard from "./pages/Dashboard/RoleBasedDashboard";
import Attendance from "./pages/AcademicManagement/Attendance";
import MyAttendance from "./pages/AcademicManagement/MyAttendance";
import { seedAttendance } from "./utils/seedAttendance";

// Finance Pages
import FeeStructure from "./pages/Finance/FeeStructure";
import Payments from "./pages/Finance/Payments";
import PendingFees from "./pages/Finance/PendingFees";
import FinanceReports from "./pages/Finance/FinanceReports";
import MyFees from "./pages/Finance/MyFees";
import MyReceipts from "./pages/Finance/MyReceipts";
// Seed
import { seedFees } from "./utils/seedFees";

import Login from "./pages/Auth/Login";
// import ActivateAccount from "./pages/Auth/ActivateAccount";

function App() {
  // ✅ Hardcode role for now (later from login system)
  const userRole = "superClerk";
  /**
   * Roles:
   * - admin
   * - faculty
   * - student
   * - labAssistant
   * - store
   * - clerk
   * - superClerk
   * - employee
   * - superAccountant
   * - accountant
   */
  const studentRollNo = "CSE1-001";

  // ✅ Ensure Attendance seed
  if (!localStorage.getItem("attendanceRecords")) {
    seedAttendance();
  }

  // ✅ Ensure Fees seed
  if (
    !localStorage.getItem("feeRecords") ||
    !localStorage.getItem("feeStructure")
  ) {
    seedFees();
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/activate" element={<ActivateAccount />} /> */}

        <Route element={<Layout userRole={userRole} />}>
          {/* ====== Dashboard ====== */}
          <Route
            path="/"
            element={<RoleBasedDashboard userRole={userRole} />}
          />

          {/* ====== Academic Management ====== */}
          <Route
            path="/academic/students"
            element={<Students userRole={userRole} />}
          />
          <Route
            path="/academic/courses"
            element={<Courses userRole={userRole} />}
          />
          <Route
            path="/academic/exams"
            element={<Exams userRole={userRole} />}
          />
          <Route
            path="/academic/attendance"
            element={<Attendance userRole={userRole} facultyName="Dr. Patel" />}
          />
          <Route
            path="/academic/my-attendance"
            element={
              <MyAttendance userRole={userRole} studentRollNo={studentRollNo} />
            }
          />

          {/* ====== Store Management ====== */}
          <Route
            path="/product-master"
            element={<ProductMaster userRole={userRole} />}
          />
          <Route
            path="/issue-history"
            element={<IssuedHistory userRole={userRole} />}
          />
          <Route
            path="/store/purchase-orders"
            element={<PurchaseOrders userRole={userRole} />}
          />

          {/* ====== HR & Payroll ====== */}
          <Route
            path="/leave-management"
            element={<LeaveManagement userRole={userRole} />}
          />

          {/* ====== Finance & Fees ====== */}
          <Route path="/finance/fee-structure" element={<FeeStructure />} />
          <Route path="/finance/payments" element={<Payments />} />
          <Route path="/finance/pending" element={<PendingFees />} />
          <Route path="/finance/reports" element={<FinanceReports />} />
          <Route
            path="/finance/my-fees"
            element={<MyFees studentRollNo={studentRollNo} />}
          />
          <Route
            path="/finance/my-receipts"
            element={<MyReceipts studentRollNo={studentRollNo} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
