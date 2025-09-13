import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

export default function IssuedExportModal({ onClose, role }) {
  const [rangeType, setRangeType] = useState("Monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const years = Array.from({ length: 7 }, (_, i) => year - 3 + i);

  const handleExport = () => {
    if (rangeType === "Custom" && (!fromDate || !toDate)) {
      alert("Please select both From and To dates ❌");
      return;
    }

    let rangeText = "";
    if (rangeType === "Monthly") {
      rangeText = `Month: ${month}, Year: ${year}`;
    } else if (rangeType === "Yearly") {
      rangeText = `Year: ${year}`;
    } else {
      rangeText = `From ${fromDate} to ${toDate}`;
    }

    if (role === "storeManager") {
      alert(
        `📦 Exporting Chemical Store Report\nFields: Date, Product, Batch, Qty, Unit, Issued To, Issued By, Remarks, CAS No., Expiry, Hazard\nRange: ${rangeText}`
      );
    } else if (role === "labAssistant") {
      alert(
        `🔬 Exporting Lab Assistant Report\nFields: Date, Product, Batch, Qty, Unit, Issued To, Issued By, Remarks, Return Date, Condition\nRange: ${rangeText}`
      );
    } else {
      alert(`Exporting Issued History Report\nRange: ${rangeText}`);
    }

    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center p-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Export Issued History
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form
            className="px-6 pb-6 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleExport();
            }}
          >
            {/* Range Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Range
              </label>
              <select
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom Date Range</option>
              </select>
            </div>

            {/* Monthly */}
            {rangeType === "Monthly" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
                  >
                    {[
                      "January","February","March","April","May","June",
                      "July","August","September","October","November","December"
                    ].map((m, i) => (
                      <option key={i+1} value={i+1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Yearly */}
            {rangeType === "Yearly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom */}
            {rangeType === "Custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color,#3b82f6)]"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--primary-color,#3b82f6)] text-white hover:shadow-md transition"
              >
                Export (Demo)
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
