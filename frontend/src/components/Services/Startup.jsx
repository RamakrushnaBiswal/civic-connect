// PermissionRequestForm.jsx
import React, { useState } from "react";

function PermissionRequestForm() {
  const [form, setForm] = useState({
    name: "",
    startup: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    ptype: "",
    customType: "",
    start: "",
    end: "",
    location: "",
    people: "",
    desc: "",
    idproof: null,
    support: null,
    agree: false,
  });

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.agree) {
      alert("You must confirm the information is correct.");
      return;
    }
    // Add your backend submission logic here
    alert("Form submitted!");
  }

  function handleReset() {
    setForm({
      name: "",
      startup: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      ptype: "",
      customType: "",
      start: "",
      end: "",
      location: "",
      people: "",
      desc: "",
      idproof: null,
      support: null,
      agree: false,
    });
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-6">Permission Request</h1>
      <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-8">
        {/* Applicant & Startup */}
        <fieldset className="border border-gray-200 p-6 rounded-lg">
          <legend className="text-xl font-semibold mb-4">Applicant & Startup</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Your Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="startup" className="block mb-1 font-medium">
                Startup / Organization <span className="text-red-600">*</span>
              </label>
              <input
                id="startup"
                name="startup"
                type="text"
                required
                value={form.startup}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="website" className="block mb-1 font-medium">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-1 font-medium">
                City / Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
        </fieldset>

        {/* Permission Details */}
        <fieldset className="border border-gray-300 p-6 rounded-lg">
          <legend className="text-xl font-semibold mb-4">Permission Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ptype" className="block mb-1 font-medium">
                Permission Type <span className="text-red-600">*</span>
              </label>
              <select
                id="ptype"
                name="ptype"
                required
                value={form.ptype}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select…</option>
                <option>Trade / Shop Act</option>
                <option>Event Permit</option>
                <option>Signage / Advertising</option>
                <option>Food (FSSAI)</option>
                <option>Fire NOC</option>
                <option>Extended Working Hours</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="customType" className="block mb-1 font-medium">
                If Other, specify
              </label>
              <input
                id="customType"
                name="customType"
                type="text"
                placeholder="Your permission type"
                value={form.customType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="start" className="block mb-1 font-medium">
                Start Date <span className="text-red-600">*</span>
              </label>
              <input
                id="start"
                name="start"
                type="date"
                required
                value={form.start}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="end" className="block mb-1 font-medium">
                End Date <span className="text-red-600">*</span>
              </label>
              <input
                id="end"
                name="end"
                type="date"
                required
                value={form.end}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="location" className="block mb-1 font-medium">
                Location / Venue <span className="text-red-600">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Full address"
                required
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label htmlFor="people" className="block mb-1 font-medium">
                Expected People
              </label>
              <input
                id="people"
                name="people"
                type="number"
                min="1"
                placeholder="e.g., 100"
                value={form.people}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="desc" className="block mb-1 font-medium">
              Brief Description
            </label>
            <textarea
              id="desc"
              name="desc"
              rows="4"
              placeholder="What activity/operation do you plan?"
              value={form.desc}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 resize-none"
            />
          </div>
        </fieldset>

        {/* Attachments */}
        <fieldset className="border border-gray-300 p-6 rounded-lg">
          <legend className="text-xl font-semibold mb-4">Attachments</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="idproof" className="block mb-1 font-medium">
                ID Proof (PDF/JPG/PNG)
              </label>
              <input
                id="idproof"
                name="idproof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="support" className="block mb-1 font-medium">
                Supporting Document (PDF)
              </label>
              <input
                id="support"
                name="support"
                type="file"
                accept=".pdf"
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </fieldset>

        {/* Declaration */}
        <fieldset className="border border-gray-300 p-6 rounded-lg">
          <legend className="text-xl font-semibold mb-4">Declaration</legend>
          <div className="flex items-center gap-2">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              required
              checked={form.agree}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="agree" className="required">
              I confirm the information is correct.
            </label>
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <button
            type="reset"
            className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Note: Once submitted, you will receive a confirmation email.
        </p>
      </form>
    </div>
  );
}

export default PermissionRequestForm;