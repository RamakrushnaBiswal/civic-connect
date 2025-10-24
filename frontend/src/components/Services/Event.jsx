// EventPermissionForm.jsx
import React, { useState } from "react";

function EventPermissionForm() {
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    mobile: "",
    address: "",
    eventName: "",
    eventStartDate: "",
    eventEndDate: "",
    eventType: "",
    gatheringCount: "",
    organizerName: "",
    aadharNumber: "",
    aadharLocation: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Add submission logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Event Permission</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Father's Name</label>
          <input
            type="text"
            name="fatherName"
            required
            value={form.fatherName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Mobile</label>
          <input
            type="tel"
            name="mobile"
            required
            value={form.mobile}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Applicant Address</label>
          <input
            type="text"
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            name="eventName"
            required
            value={form.eventName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Event Date</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="eventStartDate"
              required
              value={form.eventStartDate}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 flex-1"
            />
            <span className="text-gray-600">To</span>
            <input
              type="date"
              name="eventEndDate"
              required
              value={form.eventEndDate}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Type of Event</label>
          <input
            type="text"
            name="eventType"
            placeholder="e.g., Religious, Cultural, Sports"
            required
            value={form.eventType}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Total No. of Gathering</label>
          <input
            type="number"
            name="gatheringCount"
            required
            value={form.gatheringCount}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
            min="1"
          />
        </div>
        <div>
          <label className="block text-gray-700">Organizer Name</label>
          <input
            type="text"
            name="organizerName"
            value={form.organizerName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Aadhar Details</h3>
        <div>
          <label className="block text-gray-700">Aadhar Card Number</label>
          <input
            type="text"
            name="aadharNumber"
            maxLength="12"
            pattern="\d{12}"
            placeholder="Enter 12-digit Aadhar number"
            required
            value={form.aadharNumber}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
            title="Please enter exactly 12 digits."
          />
        </div>
        <div>
          <label className="block text-gray-700">Aadhar Card Location</label>
          <input
            type="text"
            name="aadharLocation"
            placeholder="Enter location from Aadhar card"
            required
            value={form.aadharLocation}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
}

export default EventPermissionForm;