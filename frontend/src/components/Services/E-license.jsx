// ApplyLicenseForm.jsx
import React, { useState } from "react";

const licenseTypes = [
  "5 Star Hotel",
  "Restaurant",
  "Bar",
  "3 Star Hotel",
  "Beer Shop",
  "Mini bus",
  "Taxi Center",
];
const zones = ["Zone A", "Zone B", "Zone C"];
const wards = ["Ward 1", "Ward 2", "Ward 3"];
const years = ["2025", "2024", "2023", "2022"];

function ApplyLicenseForm() {
  const [form, setForm] = useState({
    licenseType: "",
    mobile: "",
    holderName: "",
    fatherHusbandName: "",
    address: "",
    farmAddress: "",
    zone: "",
    ward: "",
    establishmentImage: null,
    establishmentYear: "",
    authorityImage: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Submit logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Apply for New License</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* License Type */}
        <div>
          <label className="block text-gray-700">License Type</label>
          <select
            name="licenseType"
            required
            value={form.licenseType}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select License Type</option>
            {licenseTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        {/* Mobile */}
        <div>
          <label className="block text-gray-700">Mobile</label>
          <input
            type="tel"
            name="mobile"
            required
            placeholder="Enter Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* License Holder Name */}
        <div>
          <label className="block text-gray-700">Licence Holder Name</label>
          <input
            type="text"
            name="holderName"
            required
            value={form.holderName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* Father/Husband Name */}
        <div>
          <label className="block text-gray-700">Father / Husband Name</label>
          <input
            type="text"
            name="fatherHusbandName"
            required
            value={form.fatherHusbandName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* Farm Address */}
        <div>
          <label className="block text-gray-700">Farm Address</label>
          <input
            type="text"
            name="farmAddress"
            required
            value={form.farmAddress}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* Zone */}
        <div>
          <label className="block text-gray-700">Zone</label>
          <select
            name="zone"
            required
            value={form.zone}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select Zone</option>
            {zones.map((z) => <option key={z}>{z}</option>)}
          </select>
        </div>
        {/* Ward */}
        <div>
          <label className="block text-gray-700">Ward</label>
          <select
            name="ward"
            required
            value={form.ward}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select Ward</option>
            {wards.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        {/* Picture of Establishment */}
        <div>
          <label className="block text-gray-700">Picture of the Establishment</label>
          <input
            type="file"
            accept="image/*"
            name="establishmentImage"
            capture="environment"
            onChange={handleChange}
            className="mt-1 block text-gray-600"
          />
          {form.establishmentImage && (
            <img src={URL.createObjectURL(form.establishmentImage)} alt="Establishment" className="mt-2 h-20 w-full object-cover rounded" />
          )}
        </div>
        {/* Establishment Year */}
        <div>
          <label className="block text-gray-700">Establishment Year</label>
          <select
            name="establishmentYear"
            required
            value={form.establishmentYear}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          >
            <option value="">Establishment Year</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        {/* Picture of Authority Letter */}
        <div>
          <label className="block text-gray-700">Picture of Authority Letter</label>
          <input
            type="file"
            accept="image/*"
            name="authorityImage"
            capture="environment"
            onChange={handleChange}
            className="mt-1 block text-gray-600"
          />
          {form.authorityImage && (
            <img src={URL.createObjectURL(form.authorityImage)} alt="Authority Letter" className="mt-2 h-20 w-full object-cover rounded" />
          )}
        </div>
        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Next
        </button>
      </form>
    </div>
  );
}

export default ApplyLicenseForm;
