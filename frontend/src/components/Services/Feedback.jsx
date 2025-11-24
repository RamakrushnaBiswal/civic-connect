// CivicFeedbackForm.jsx
import React, { useState } from "react";

const feedbackTypes = [
  "Suggestion",
  "Complaint",
  "Appreciation",
  "Bug Report",
  "Other",
];

function Feedback() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
    photo: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setValues((v) => ({ ...v, photo: files[0] || null }));
    } else {
      setValues((v) => ({ ...v, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // send feedback to backend
    const payload = {
      name: values.name,
      email: values.email,
      message: values.message,
      metadata: { type: values.type }
    }

    fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to submit feedback')
      alert('Thank you — your feedback was submitted.')
      setValues({ name: '', email: '', type: '', message: '', photo: null })
    }).catch((err) => {
      console.error(err)
      alert('Failed to submit feedback. Please try again later.')
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <form
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Civic Connect Feedback
        </h2>

        <div>
          <label className="block text-gray-700">Type of Feedback</label>
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
          >
            <option value="">Select type</option>
            {feedbackTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-gray-700">Message</label>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
            placeholder="Write your feedback here..."
          />
        </div>

        <div>
          <label className="block text-gray-700">Add a Photo (optional)</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="mt-1 block w-full text-gray-600"
          />
          {values.photo && (
            <img
              src={URL.createObjectURL(values.photo)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Feedback;
