import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductMaster from "./pages/ProductMaster/ProductMaster";
import IssuedHistory from "./pages/IssuedHistory/IssuedHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (no sidebar) */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}

        {/* Protected routes (with sidebar/topbar via Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product-master" element={<ProductMaster />} />
          <Route
            path="/issue-history"
            element={<IssuedHistory userRole="labAssistant" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
