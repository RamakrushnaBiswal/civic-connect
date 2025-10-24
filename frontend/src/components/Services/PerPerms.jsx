// PetRegistrationForm.jsx
import React, { useState } from "react";

function PetRegistrationForm() {
  const [form, setForm] = useState({
    ownerName: "",
    mobile: "",
    address: "",
    petName: "",
    petCategory: "",
    petAgeYear: "",
    petAgeMonth: "",
    sex: "",
    rabiesDate: "",
    licenceType: "",
    petPhoto: null,
    certValidityStart: "2025-07-22",
    certValidityEnd: "2026-07-21",
  });

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm(f => ({ ...f, [name]: files[0] || null }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Add submission logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Pet Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Owner Details */}
        <div>
          <label className="block text-gray-700">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Mobile No.</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Pet Details */}
        <div>
          <label className="block text-gray-700">Pet Name</label>
          <input
            type="text"
            name="petName"
            value={form.petName}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Pet Category</label>
          <input
            type="text"
            name="petCategory"
            value={form.petCategory}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Age</label>
          <div className="flex gap-4">
            <select
              name="petAgeYear"
              value={form.petAgeYear}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 flex-1"
            >
              <option value="">Select Year</option>
              <option>2024</option>
              <option>2023</option>
            </select>
            <select
              name="petAgeMonth"
              value={form.petAgeMonth}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 flex-1"
            >
              <option value="">Select Month</option>
              <option>January</option>
              <option>February</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Sex</label>
          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                name="sex"
                value="Male"
                checked={form.sex === "Male"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={form.sex === "Female"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Female
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Rabies Vaccination Date</label>
          <input
            type="date"
            name="rabiesDate"
            value={form.rabiesDate}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Licence</label>
          <select
            name="licenceType"
            value={form.licenceType}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select</option>
            <option>New Apply</option>
            <option>Renewal</option>
          </select>
        </div>

        {/* Pet Photo */}
        <div>
          <label className="block text-gray-700">Pet Photo</label>
          <input
            type="file"
            name="petPhoto"
            accept="image/*"
            onChange={handleChange}
            className="block mt-1 text-gray-600"
          />
          {form.petPhoto && (
            <img
              src={URL.createObjectURL(form.petPhoto)}
              alt="Pet Preview"
              className="mt-2 w-32 h-32 object-cover rounded shadow"
            />
          )}
        </div>

        {/* Certificate Validity */}
        <div>
          <label className="block text-gray-700 mb-1">Certificate Validity</label>
          <div className="flex gap-4">
            <input
              type="date"
              name="certValidityStart"
              value={form.certValidityStart}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 flex-1"
            />
            <input
              type="date"
              name="certValidityEnd"
              value={form.certValidityEnd}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 flex-1"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="mb-1">Note 1: Inspection will be done by the Municipal Corporation within 15 days. Incorrect info may result in a fine up to 10x.</p>
          <p className="mb-1">Note 2: Registration is valid for one year from the date of registration.</p>
          <p className="mb-1">Note 3: Certificate is not valid for banned breeds.</p>
          <p>Note 4: A penalty will be levied for false information.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default PetRegistrationForm;
