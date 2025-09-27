import { FaFlask, FaHistory, FaFileInvoice, FaExclamationTriangle } from "react-icons/fa";
import StatCard from "../../../components/StatCard/StatCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

export default function StoreDashboard() {
  // ====== Mock summary data (replace with API later) ======
  const totalProducts = 250;
  const issues = 120;
  const lowStock = 15;
  const pendingOrders = 8;

  // ====== Mock chart data ======
  const stockCategories = [
    { category: "Chemicals", items: 90 },
    { category: "Glassware", items: 70 },
    { category: "Instruments", items: 60 },
    { category: "Others", items: 30 },
  ];

  const issuesTrend = [
    { month: "Jan", issues: 15 },
    { month: "Feb", issues: 20 },
    { month: "Mar", issues: 18 },
    { month: "Apr", issues: 25 },
    { month: "May", issues: 22 },
    { month: "Jun", issues: 20 },
  ];

  // ====== Mock low stock items ======
  const lowStockItems = [
    { name: "Beaker 100ml", qty: 5 },
    { name: "HCl Solution", qty: 2 },
    { name: "Test Tubes", qty: 10 },
  ];

  // ====== Mock purchase orders ======
  const purchaseOrders = [
    { id: "PO-101", item: "Sodium Hydroxide", status: "Pending" },
    { id: "PO-102", item: "Microscope", status: "Delivered" },
    { id: "PO-103", item: "Safety Gloves", status: "Pending" },
  ];

  return (
    <div className="p-6 min-h-screen bg-[var(--background-color)] space-y-8">
      <h1 className="text-2xl font-bold">Store Dashboard</h1>

      {/* ====== Stat Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard icon={<FaFlask />} label="Total Products" value={totalProducts} color="text-blue-500" />
        <StatCard icon={<FaHistory />} label="Issues Recorded" value={issues} color="text-[var(--primary-color)]" />
        <StatCard icon={<FaExclamationTriangle />} label="Low Stock" value={lowStock} color="text-red-500" />
        <StatCard icon={<FaFileInvoice />} label="Pending Orders" value={pendingOrders} color="text-yellow-500" />
      </div>

      {/* ====== Stock Distribution Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">Stock Distribution by Category</h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart data={stockCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="items" fill="#52a4b0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Issues Trend Chart ====== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">Issues Trend (Last 6 Months)</h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={issuesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="issues" stroke="#a78bfa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Low Stock + Purchase Orders ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Low Stock Items</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Item</th>
                <th className="p-3">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Purchase Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Purchase Orders</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Item</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{po.id}</td>
                  <td className="p-3">{po.item}</td>
                  <td className="p-3">{po.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
