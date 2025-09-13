import React, { useState, useEffect } from "react";

export default function ProductModal({
  onClose,
  editingProduct,
  setProducts,
  products,
  productTypes,
  setProductTypes,
}) {
  const [formProduct, setFormProduct] = useState({
    type: "",
    name: "",
    cas: "",
    qty: "",
    unit: "",
    expiry: "",
    location: "",
    status: "Available",
  });
  const [addingType, setAddingType] = useState(false);
  const [newProductType, setNewProductType] = useState("");

  useEffect(() => {
    if (editingProduct) setFormProduct(editingProduct);
  }, [editingProduct]);

  const handleInputChange = (e) => {
    setFormProduct({ ...formProduct, [e.target.name]: e.target.value });
  };

  const handleSaveProduct = () => {
    if (!formProduct.name || !formProduct.type) {
      alert("Please fill in required fields");
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...formProduct, id: editingProduct.id }
            : p
        )
      );
    } else {
      setProducts([...products, { id: Date.now(), ...formProduct }]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="space-y-4">
          <div>
            <select
              name="type"
              value={formProduct.type}
              onChange={(e) => {
                if (e.target.value === "__add_new__") {
                  setFormProduct({ ...formProduct, type: "" });
                  setAddingType(true);
                } else {
                  setFormProduct({ ...formProduct, type: e.target.value });
                  setAddingType(false);
                }
              }}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Product Type</option>
              {productTypes.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
              <option value="__add_new__">+ Add New Type</option>
            </select>

            {addingType && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Enter new product type"
                  value={newProductType}
                  onChange={(e) => setNewProductType(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={() => {
                    if (newProductType.trim()) {
                      setProductTypes([...productTypes, newProductType.trim()]);
                      setFormProduct({
                        ...formProduct,
                        type: newProductType.trim(),
                      });
                      setNewProductType("");
                      setAddingType(false);
                    }
                  }}
                  className="px-4 py-2 bg-[var(--primary-color,#3b82f6)] text-white rounded-lg hover:shadow"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNewProductType("");
                    setAddingType(false);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            name="name"
            value={formProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="cas"
            value={formProduct.cas}
            onChange={handleInputChange}
            placeholder="CAS No"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <div className="flex gap-3">
            <input
              type="number"
              name="qty"
              value={formProduct.qty}
              onChange={handleInputChange}
              placeholder="Qty Available"
              className="w-1/2 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="unit"
              value={formProduct.unit}
              onChange={handleInputChange}
              placeholder="Unit (kg/L etc.)"
              className="w-1/2 px-3 py-2 border rounded-lg"
            />
          </div>
          <input
            type="date"
            name="expiry"
            value={formProduct.expiry}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="location"
            value={formProduct.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <select
            name="status"
            value={formProduct.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProduct}
            className="px-4 py-2 bg-[var(--primary-color,#3b82f6)] text-white rounded-lg shadow hover:shadow-md transition"
          >
            {editingProduct ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
