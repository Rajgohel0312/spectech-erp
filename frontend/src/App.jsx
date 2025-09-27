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
function App() {
  // ✅ Hardcode role for now (later from login system)
  const userRole = "student";
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
   */
  const studentRollNo = "CSE1-001";

  if (!localStorage.getItem("attendanceRecords")) {
    seedAttendance();
  }
  return (
    <Router>
      <Routes>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
