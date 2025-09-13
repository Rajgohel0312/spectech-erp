import React from "react";

export default function ProductDeleteModal({ product, setProducts, products, onClose }) {
  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== product.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Delete Product</h2>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{product.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:shadow-md transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
