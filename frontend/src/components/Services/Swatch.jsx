/* eslint-disable no-unused-vars */
// SwachhataActivityForm.jsx
import React, { useState } from "react";

function SwachhataActivityForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    mobile: "",
    address: "",
    zone: "",
    ward: "",
    title: "",
    description: "",
    video: "",
  });

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Submission logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Swachhata Activity</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            value={form.firstName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            value={form.lastName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Gender</label>
          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="transgender"
                checked={form.gender === "transgender"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Transgender
            </label>
          </div>
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
          <label className="block text-gray-700">Address</label>
          <textarea
            name="address"
            rows="2"
            required
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2 resize-none"
          />
        </div>

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
            <option value="Zone 1">Zone 1</option>
            <option value="Zone 2">Zone 2</option>
            <option value="Zone 3">Zone 3</option>
          </select>
        </div>

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
            <option value="Ward A">Ward A</option>
            <option value="Ward B">Ward B</option>
            <option value="Ward C">Ward C</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            rows="3"
            required
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2 resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-700">Social Media Link</label>
          <input
            type="url"
            name="video"
            placeholder="Paste link here"
            value={form.video}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"
          />
        </div>

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

export default SwachhataActivityForm;