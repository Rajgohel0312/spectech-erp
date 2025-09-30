import { useState } from "react";
import api from "../../../utils/api";

export default function ImportStudents() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/clerk/import-students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(`✅ ${res.data.message}`);
    } catch (err) {
      setMsg("❌ Failed to import students");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Import Students</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
          required
        />
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          Upload CSV
        </button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
