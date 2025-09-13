import React from "react";

export default function ProductViewModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Product Details</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Type:</strong> {product.type}</p>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>CAS No:</strong> {product.cas}</p>
          <p><strong>Qty Available:</strong> {product.qty} {product.unit}</p>
          <p><strong>Expiry:</strong> {product.expiry}</p>
          <p><strong>Location:</strong> {product.location}</p>
          <p><strong>Status:</strong> {product.status}</p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
