import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

// Pages
import RoleBasedDashboard from "./pages/Dashboard/RoleBasedDashboard";
import Students from "./pages/AcademicManagement/Students";
import Courses from "./pages/AcademicManagement/Courses";
import Exams from "./pages/AcademicManagement/Exams";
import Attendance from "./pages/AcademicManagement/Attendance";
import MyAttendance from "./pages/AcademicManagement/MyAttendance";
import ProductMaster from "./pages/ProductMaster/ProductMaster";
import IssuedHistory from "./pages/IssuedHistory/IssuedHistory";
import PurchaseOrders from "./pages/Store/PurchaseOrders";
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";
import FeeStructure from "./pages/Finance/FeeStructure";
import Payments from "./pages/Finance/Payments";
import PendingFees from "./pages/Finance/PendingFees";
import FinanceReports from "./pages/Finance/FinanceReports";
import MyFees from "./pages/Finance/MyFees";
import MyReceipts from "./pages/Finance/MyReceipts";
// User Management
import AddSuperUser from "./pages/UserManagement/Admin/AddSuperUser";
import ManageUsers from "./pages/UserManagement/Admin/ManageUsers";
import AddClerk from "./pages/UserManagement/SuperClerk/AddClerk";
import AddAccountant from "./pages/UserManagement/SuperAccountant/AddAccountant";
import ImportStudents from "./pages/UserManagement/Clerk/ImportStudents";
import AddEmployee from "./pages/UserManagement/SuperClerk/AddEmployee";
// Institution
import Colleges from "./pages/CollegeManagement/Colleges";
import Departments from "./pages/CollegeManagement/Departments";

// Auth
import Login from "./pages/Auth/Login";

// Seed utils
import { seedAttendance } from "./utils/seedAttendance";
import { seedFees } from "./utils/seedFees";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import { useAuth } from "./pages/Auth/AuthContext";
import AddStore from "./pages/UserManagement/Admin/AddStore";
import AddLabAssistant from "./pages/UserManagement/Admin/AddLabAssistant";

function App() {
  const { roles } = useAuth();

  let userRole = null;
  if (roles.length > 0) {
    userRole = typeof roles[0] === "string" ? roles[0] : roles[0]?.name || null;
  }

  const studentRollNo = "CSE1-001";

  if (!localStorage.getItem("attendanceRecords")) seedAttendance();
  if (
    !localStorage.getItem("feeRecords") ||
    !localStorage.getItem("feeStructure")
  )
    seedFees();

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout userRole={userRole} />}>
            {/* Dashboard */}
            <Route
              path="/"
              element={<RoleBasedDashboard userRole={userRole} />}
            />

            {/* Academic */}
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
              element={
                <Attendance userRole={userRole} facultyName="Dr. Patel" />
              }
            />
            <Route
              path="/academic/my-attendance"
              element={
                <MyAttendance
                  userRole={userRole}
                  studentRollNo={studentRollNo}
                />
              }
            />

            {/* Store */}
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

            {/* HR */}
            <Route
              path="/leave-management"
              element={<LeaveManagement userRole={userRole} />}
            />

            {/* Finance */}
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

            {/* User Management */}
            <Route
              path="/user-management/add-super"
              element={<AddSuperUser />}
            />
            <Route path="/user-management/manage" element={<ManageUsers />} />
            <Route path="/user-management/add-clerk" element={<AddClerk />} />
            <Route
              path="/user-management/add-accountant"
              element={<AddAccountant />}
            />
            <Route
              path="/user-management/import-students"
              element={<ImportStudents />}
            />

            {/* Institution */}
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/departments" element={<Departments />} />
            <Route
              path="/user-management/add-employee"
              element={<AddEmployee />}
            />
            <Route path="/user-management/add-store" element={<AddStore />} />
            <Route
              path="/user-management/add-lab-assistant"
              element={<AddLabAssistant />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
