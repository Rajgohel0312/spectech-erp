export default function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
      <div className={`text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
