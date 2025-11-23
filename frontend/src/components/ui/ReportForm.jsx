import React, { useState, useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { v4 as uuidv4 } from 'uuid';


const categories = [
  "Animal Control",
  "Engineering",
  "Sanitation",
  "Healthcare",
  "Jalkal",
  "Property",
  "Street",
  "Udyan",
];
const priorities = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

const MAPTILER_KEY = "ssjepsOfxXaqATsEknxl";

const mapStyles = [
  {
    label: "Streets",
    value: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
  },
  {
    label: "Satellite",
    value: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
  },
  {
    label: "Basic",
    value: `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_KEY}`,
  },
  {
    label: "Dataviz",
    value: `https://api.maptiler.com/maps/dataviz/style.json?key=${MAPTILER_KEY}`,
  },
  {
    label: "Winter",
    value: `https://api.maptiler.com/maps/winter/style.json?key=${MAPTILER_KEY}`,
  },
];

const ReportForm = () => {
  const [form, setForm] = useState({
    name: "",
    title:"",
    priority: "",
    email: "",
    phone: "",
    category: "",
    location: "",
    description: "",
  });
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [mapStyle, setMapStyle] = useState(mapStyles[0].value);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  // Initialize map on first render
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    maptilersdk.config.apiKey = MAPTILER_KEY;

    mapInstance.current = new maptilersdk.Map({
      container: mapRef.current,
      style: mapStyle,
      center: [77.209, 28.6139], // Default: Delhi
      zoom: 10,
    });

    // Click to set marker
    mapInstance.current.on("click", (e) => {
      setCoords([e.lngLat.lng, e.lngLat.lat]);
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new maptilersdk.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(mapInstance.current);
    });
  }, []);

  // Update map style when user changes it
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Search for location
  const handleSearch = async () => {
    if (!form.location) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          form.location
        )}.json?key=${MAPTILER_KEY}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        setCoords([lng, lat]);
        mapInstance.current.flyTo({ center: [lng, lat], zoom: 14 });
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new maptilersdk.Marker()
          .setLngLat([lng, lat])
          .addTo(mapInstance.current);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  // Use browser location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords([longitude, latitude]);
      mapInstance.current.flyTo({ center: [longitude, latitude], zoom: 15 });
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new maptilersdk.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapInstance.current);
      setLoading(false);
    });
  };

  // Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", uuidv4()); //complain id
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("title", form.title);
    formData.append("phone", form.phone);
    formData.append("category", form.category); //dept
    formData.append("location", form.location);
    formData.append("priority", form.priority);
    formData.append("description", form.description);
    formData.append("coordinates", JSON.stringify(coords));
    if (photo) formData.append("photo", photo);//uploadeed photo

    console.log(...formData);
    console.log(photo);

    // Here you would typically send the data to the backend server
    fetch("http://localhost:5000/api/reports/add-report", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response)
        }
        return response.json();
      })
      .then((data) => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });


    // Reset form
    setForm({
      name: "",
      email: "",
      title:"",
      priority: "",
      phone: "",
      category: "",
      location: "",
      description: "",
    });
    setCoords(null);
    setPhoto(null);
    if (markerRef.current) markerRef.current.remove();

    // Reset map to default
    mapInstance.current.flyTo({ center: [77.209, 28.6139], zoom: 10 });
  };

  return (
    <section className="max-w-2xl mx-auto py-12 px-4" id="report">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Report an Issue
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-blue-100"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title of the Issue"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
          required
        />
        <label htmlFor="photo-upload" className="block font-semibold mb-2">
          Take Photo
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*;capture=camera"
          name="photo"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full px-5 py-10 rounded-lg border bg-gray-200 border-gray-200 focus:border-blue-500 outline-none"
        />
        {photo && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg shadow"
            />
            <div className="text-xs text-gray-500 mt-1">
              {photo.name} ({Math.round(photo.size / 1024)} KB)
            </div>
          </div>
        )}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
          required
        >
          <option value="" disabled>
            Select Issue Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
          required
        >
          <option value="" disabled>
            Select Issue Priority
          </option>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        {/* Location Input */}
        <label className="block font-semibold mb-2">Location</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Search for a location..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
            required
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            🔍
          </button>
        </div>

        {/* Current location */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-100 transition mb-2"
        >
          <span>📍</span> Use Current Location
        </button>

        {/* Style switcher */}
        <div className="flex flex-wrap gap-2 mb-2">
          {mapStyles.map((style) => (
            <button
              key={style.label}
              type="button"
              onClick={() => setMapStyle(style.value)}
              className={`px-3 py-1 rounded ${
                mapStyle === style.value
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="w-full h-64 rounded-lg bg-gray-100 mb-2 relative">
          <div ref={mapRef} className="w-full h-full rounded-lg" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
              <span className="text-blue-600 font-semibold">
                Loading Map...
              </span>
            </div>
          )}
        </div>

        {/* Coordinates */}
        {coords && (
          <div className="text-sm text-green-700 mb-2">
            Selected Coordinates: {coords[1]}, {coords[0]}
          </div>
        )}

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none min-h-[100px]"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Submit Report
        </button>
      </form>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold animate-fade-in">
          Query submitted!
        </div>
      )}
    </section>
  );
};

export default ReportForm;
