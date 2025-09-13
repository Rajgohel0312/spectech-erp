import React, { useState } from "react";

export default function ProductIssueModal({ product, setProducts, products, onClose }) {
  const [issueQty, setIssueQty] = useState(1);

  const handleIssue = () => {
    if (issueQty <= 0 || issueQty > product.qty) {
      alert("Invalid issue quantity");
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...p, qty: Math.max(p.qty - issueQty, 0) } : p
      )
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Issue Product</h2>
        <p className="mb-4">
          Issue quantity for <strong>{product.name}</strong> (Available:{" "}
          {product.qty})
        </p>
        <input
          type="number"
          min="1"
          max={product.qty}
          value={issueQty}
          onChange={(e) => setIssueQty(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleIssue}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:shadow-md transition"
          >
            Issue
          </button>
        </div>
      </div>
    </div>
  );
}
