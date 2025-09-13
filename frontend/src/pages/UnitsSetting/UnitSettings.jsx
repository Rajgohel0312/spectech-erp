import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function UnitsSettings() {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [newSymbol, setNewSymbol] = useState("");

  // Load units from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("units")) || [
      { id: 1, name: "Gram", symbol: "gm" },
      { id: 2, name: "Kilogram", symbol: "kg" },
      { id: 3, name: "Liter", symbol: "L" },
      { id: 4, name: "Pieces", symbol: "pcs" },
    ];
    setUnits(saved);
  }, []);

  // Save to localStorage when units update
  useEffect(() => {
    localStorage.setItem("units", JSON.stringify(units));
  }, [units]);

  const addUnit = () => {
    if (!newUnit || !newSymbol) return alert("Enter unit name and symbol");
    setUnits([...units, { id: Date.now(), name: newUnit, symbol: newSymbol }]);
    setNewUnit("");
    setNewSymbol("");
  };

  const deleteUnit = (id) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 bg-[var(--background-color)] min-h-screen">
      <h1 className="text-2xl font-bold text-[var(--text-color)] mb-4">
        Units Management
      </h1>

      {/* Add Form */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Unit Name (e.g., Gram)"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1"
        />
        <input
          type="text"
          placeholder="Symbol (e.g., gm)"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-32"
        />
        <button
          onClick={addUnit}
          className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg shadow hover:shadow-md"
        >
          <FaPlus /> Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Unit Name</th>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.symbol}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteUnit(u.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
