import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { generatePOpdf } from "../../utils/generatePOpdf";
import { defaultUnits } from "../../config/units";

export default function PurchaseOrderModal({ onClose }) {
  // 🔹 State (Form Fields)
  const [poNumber, setPoNumber] = useState("PO-" + Date.now()); // auto-generate PO number
  const [supplier, setSupplier] = useState(""); // supplier person name
  const [supplierCompany, setSupplierCompany] = useState(""); // supplier company name
  const [supplierAddress, setSupplierAddress] = useState(""); // supplier address
  const [hasGST, setHasGST] = useState(false); // GST checkbox
  const [gstNumber, setGstNumber] = useState(""); // GST number (if applicable)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // current date
  const [remarks, setRemarks] = useState(""); // remarks
  const [products, setProducts] = useState([{ name: "", qty: "", unit: "" }]); // multiple product rows
  const [units, setUnits] = useState(defaultUnits); // load units from config

  // 🔹 Load custom units if saved in localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("units"));
    if (saved) setUnits(saved);
  }, []);

  // Add product row
  const addProduct = () => {
    setProducts([...products, { name: "", qty: "", unit: "" }]);
  };

  // Update product row
  const updateProduct = (i, field, value) => {
    const updated = [...products];
    updated[i][field] = value;
    setProducts(updated);
  };

  // Remove product row
  const removeProduct = (i) => {
    setProducts(products.filter((_, idx) => idx !== i));
  };

  // 🔹 Generate PDF
  const handleGenerate = () => {
    // 👉 Collect all state values into a payload object
    const poData = {
      poNumber,
      supplier,
      supplierCompany,
      supplierAddress,
      hasGST,
      gstNumber,
      date,
      remarks,
      products: products.map((p) => ({
        name: p.name,
        quantityWithUnit: `${p.qty} ${p.unit}`,
      })),
    };

    // 👉 Pass payload to PDF generator
    generatePOpdf(poData);

    // 👉 Close modal after generating
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Create Purchase Order
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Supplier Info */}
            <input
              type="text"
              placeholder="Supplier Name"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Supplier Company Name"
              value={supplierCompany}
              onChange={(e) => setSupplierCompany(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            {/* GST Option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="gst-check"
                checked={hasGST}
                onChange={(e) => setHasGST(e.target.checked)}
                className="h-4 w-4 text-[var(--primary-color)]"
              />
              <label htmlFor="gst-check" className="text-sm text-gray-700">
                Supplier has GST
              </label>
            </div>

            {hasGST && (
              <input
                type="text"
                placeholder="GST Number"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            )}

            <input
              type="text"
              placeholder="Supplier Address"
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <input
              type="text"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            {/* Products Section */}
            <div>
              <h3 className="text-sm font-medium mb-2">Products</h3>
              {products.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-3 mb-2 items-center"
                >
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={p.name}
                    onChange={(e) => updateProduct(i, "name", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={p.qty}
                    onChange={(e) => updateProduct(i, "qty", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                  <select
                    value={p.unit}
                    onChange={(e) => updateProduct(i, "unit", e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select Unit</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.symbol}>
                        {u.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                onClick={addProduct}
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Product
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t p-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:shadow-md transition"
            >
              Generate PO
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
