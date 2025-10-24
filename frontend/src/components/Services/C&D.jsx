// AddEngineerForm.jsx
import React, { useState } from "react";

function AddEngineerForm() {
  const [form, setForm] = useState({
    name: "",
    aadhaar: "",
    age: "",
    experience: "",
    expertise: "",
    photo: null,
    extra: "",
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
    // Add your submission logic here
    alert("Engineer added!");
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">C&D Activity</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter engineer's full name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="aadhaar" className="block mb-1 font-medium">Aadhaar Number</label>
          <input
            type="text"
            id="aadhaar"
            name="aadhaar"
            placeholder="Enter Aadhaar Number"
            required
            value={form.aadhaar}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="age" className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Enter age"
            required
            value={form.age}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block mb-1 font-medium">Experience (in years)</label>
          <input
            type="number"
            id="experience"
            name="experience"
            placeholder="Enter experience"
            required
            value={form.experience}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="expertise" className="block mb-1 font-medium">Expertise</label>
          <select
            id="expertise"
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select Expertise</option>
            <option value="water">Water Supply</option>
            <option value="electricity">Electricity</option>
            <option value="animal">Animal Control</option>
            <option value="road">Road Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="photo" className="block mb-1 font-medium">Upload Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="block text-gray-600"
          />
          {form.photo && (
            <img
              src={URL.createObjectURL(form.photo)}
              alt="Engineer Preview"
              className="mt-2 w-32 h-32 object-cover rounded shadow"
            />
          )}
        </div>

        <div>
          <label htmlFor="extra" className="block mb-1 font-medium">Additional Info</label>
          <textarea
            id="extra"
            name="extra"
            rows="4"
            placeholder="Enter additional information..."
            value={form.extra}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add Engineer
        </button>
      </form>
    </div>
  );
}

export default AddEngineerForm;