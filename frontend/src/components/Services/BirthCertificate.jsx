// BirthRegistrationForm.jsx
import React, { useState } from "react";

function BirthRegistrationForm() {
  const [form, setForm] = useState({
    informerName: "",
    informerAddress: "",
    informerMobile: "",
    informerEmail: "",
    informerRelation: "",
    childDob: "",
    childGender: "",
    childName: "",
    fatherName: "",
    fatherUid: "",
    permanentAddress: "",
    placeOfBirth: "",
    zone: "",
    ward: "",
    state: "",
    deliveryType: "",
    birthWeight: "",
    pregnancyWeeks: "",
    dischargeCard: null,
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
    // Add submit logic here
    alert("Form submitted!");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Birth Registration Form</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">Informer Name</label>
          <input type="text" required name="informerName" value={form.informerName} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Address</label>
          <input type="text" required name="informerAddress" value={form.informerAddress} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Mobile Number</label>
          <input type="tel" required name="informerMobile" value={form.informerMobile} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Email</label>
          <input type="email" name="informerEmail" value={form.informerEmail} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Informer Relation</label>
          <input type="text" name="informerRelation" value={form.informerRelation} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Child Date of Birth</label>
          <input type="date" required name="childDob" value={form.childDob} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Child Gender</label>
          <div className="flex gap-5">
            <label>
              <input type="radio" name="childGender" value="Male"
                checked={form.childGender === "Male"} onChange={handleChange}/> Male
            </label>
            <label>
              <input type="radio" name="childGender" value="Female"
                checked={form.childGender === "Female"} onChange={handleChange}/> Female
            </label>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Child Name</label>
          <input type="text" name="childName" value={form.childName} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Father's Name</label>
          <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Father's UID No</label>
          <input type="text" name="fatherUid" value={form.fatherUid} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Permanent Address</label>
          <input type="text" name="permanentAddress" value={form.permanentAddress} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Place of Birth (Home/Hospital)</label>
          <input type="text" name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange}
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
          <input type="text" name="state" value={form.state} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Delivery Process</label>
          <div className="flex gap-5">
            <label>
              <input type="radio" name="deliveryType" value="Normal"
                checked={form.deliveryType === "Normal"} onChange={handleChange}/> Normal
            </label>
            <label>
              <input type="radio" name="deliveryType" value="Cesarean"
                checked={form.deliveryType === "Cesarean"} onChange={handleChange}/> Cesarean
            </label>
            <label>
              <input type="radio" name="deliveryType" value="Forceps/Vacuum"
                checked={form.deliveryType === "Forceps/Vacuum"} onChange={handleChange}/> Forceps/Vacuum
            </label>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Birth Weight</label>
          <input type="text" name="birthWeight" value={form.birthWeight} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Pregnancy Time in Weeks</label>
          <input type="number" name="pregnancyWeeks" min="1" value={form.pregnancyWeeks} onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2"/>
        </div>
        <div>
          <label className="block text-gray-700">Upload Hospital Discharge Card/Acknowledgement</label>
          <input className="file-input" type="file" accept="image/*" name="dischargeCard" onChange={handleChange}/>
          {form.dischargeCard && (
            <img src={URL.createObjectURL(form.dischargeCard)} alt="Discharge Card Preview"
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

export default BirthRegistrationForm;