// DeathForm.jsx
import React, { useState } from "react";

function DeathForm() {
  const [form, setForm] = useState({
    informerName: "",
    informerMobile: "",
    informerEmail: "",
    informerRelation: "",
    dateOfDeath: "",
    deceasedName: "",
    deceasedUid: "",
    gender: "",
    fatherName: "",
    fatherUid: "",
    age: "",
    deathAddress: "",
    permanentAddress: "",
    placeOfDeath: "",
    zone: "",
    ward: "",
    state: "",
    deathProven: "",
    causeOfDeath: "",
    attachment: null,
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
    // Submit logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Death Form</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">Informer Name</label>
          <input type="text" name="informerName" required value={form.informerName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Mobile No</label>
          <input type="tel" name="informerMobile" required value={form.informerMobile}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Email</label>
          <input type="email" name="informerEmail" value={form.informerEmail}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Relation</label>
          <input type="text" name="informerRelation" value={form.informerRelation}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Date of Death</label>
          <input type="date" name="dateOfDeath" required value={form.dateOfDeath}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Name of Deceased Person</label>
          <input type="text" name="deceasedName" value={form.deceasedName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Deceased Person UID No</label>
          <input type="text" name="deceasedUid" value={form.deceasedUid}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Deceased Person Gender</label>
          <div className="flex gap-5">
            <label>
              <input type="radio" name="gender" value="Male"
                checked={form.gender === "Male"} onChange={handleChange}/> Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female"
                checked={form.gender === "Female"} onChange={handleChange}/> Female
            </label>
            <label>
              <input type="radio" name="gender" value="Transgender"
                checked={form.gender === "Transgender"} onChange={handleChange}/> Transgender
            </label>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Father's Name</label>
          <input type="text" name="fatherName" value={form.fatherName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Father's UID No</label>
          <input type="text" name="fatherUid" value={form.fatherUid}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Age of the Deceased</label>
          <input type="number" min="0" name="age" value={form.age}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Address at Time of Death</label>
          <input type="text" name="deathAddress" value={form.deathAddress}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Permanent Address</label>
          <input type="text" name="permanentAddress" value={form.permanentAddress}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Place of Death (Home/Hospital)</label>
          <input type="text" name="placeOfDeath" value={form.placeOfDeath}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Zone</label>
          <select name="zone" value={form.zone} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2">
            <option value="">Select Zone</option>
            <option>Zone 1</option>
            <option>Zone 2</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Ward</label>
          <select name="ward" value={form.ward} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2">
            <option value="">Select Ward</option>
            <option>Ward A</option>
            <option>Ward B</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">State</label>
          <input type="text" name="state" value={form.state}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Was Cause of Death Medically Proven?</label>
          <div className="flex gap-8">
            <label>
              <input type="radio" name="deathProven" value="Yes"
                checked={form.deathProven === "Yes"} onChange={handleChange}/> Yes
            </label>
            <label>
              <input type="radio" name="deathProven" value="No"
                checked={form.deathProven === "No"} onChange={handleChange}/> No
            </label>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Name of Disease / Cause of Death</label>
          <input type="text" name="causeOfDeath" value={form.causeOfDeath}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Attachment: Cause of Death by Doctor/Applicant</label>
          <input type="file" accept="image/*" name="attachment"
            onChange={handleChange}
            className="mt-1 block text-gray-600"/>
          {form.attachment && (
            <img src={URL.createObjectURL(form.attachment)} alt="Attachment Preview"
              className="mt-2 w-32 h-32 object-cover rounded shadow"/>
          )}
        </div>
        <button type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
}

export default DeathForm;