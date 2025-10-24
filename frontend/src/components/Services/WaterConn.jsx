// WaterConnectionForm.jsx
import React, { useState } from "react";

function WaterConnectionForm() {
  const [form, setForm] = useState({
    name: "",
    father: "",
    address: "",
    mobile: "",
    email: "",
    connection: "",
    idproof: null,
    remarks: "",
  });

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Application submitted!");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Water Connection Application Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Applicant Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="father" className="block mb-1 font-medium">
            Father’s / Husband’s Name:
          </label>
          <input
            type="text"
            id="father"
            name="father"
            value={form.father}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="address" className="block mb-1 font-medium">
            Full Address:
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 resize-none"
          ></textarea>
        </div>

        <div>
          <label htmlFor="mobile" className="block mb-1 font-medium">
            Mobile Number:
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            pattern="[0-9]{10}"
            required
            value={form.mobile}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email ID:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="connection" className="block mb-1 font-medium">
            Type of Connection:
          </label>
          <select
            id="connection"
            name="connection"
            required
            value={form.connection}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">--Select--</option>
            <option value="domestic">Domestic</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        <div>
          <label htmlFor="idproof" className="block mb-1 font-medium">
            Upload ID Proof (Aadhar, Voter ID, etc.):
          </label>
          <input
            type="file"
            id="idproof"
            name="idproof"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
            className="w-full text-gray-600"
          />
          {form.idproof && (
            <p className="mt-2 text-sm text-gray-700">Selected file: {form.idproof.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="remarks" className="block mb-1 font-medium">
            Remarks (if any):
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows="2"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default WaterConnectionForm;