const mongoose = require('mongoose');

// const ReportSchema = new mongoose.Schema({
//   id: { type: String, required: true, unique: true },
//   name: String,
//   email: String,
//   phone: String,
//   category: String,
//   location: String,
//   description: String,
//   coordinates: {
//     lat: Number,
//     lng: Number,
//   },
//   photo: String,
// }, { timestamps: true });

// models/Report.js

const updateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  message: { type: String, required: true },
  author: { type: String, required: true },
});

const ReportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true },
  citizen: { type: String, required: true },
  citizenEmail: { type: String, required: true },
  citizenPhone: { type: String, required: true },
  date: { type: Date, required: true },
  assignedTo: { type: String },
  assignedPersonnelId: { type: String },
  assignedDate: { type: Date },
  location: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  photo: { type: String },
  images: [{ type: String }],
  escalated: { type: Boolean, default: false },
  slaDeadline: { type: Date },
  departmentId: { type: String, required: true },
  autoRouted: { type: Boolean, default: false },
  workflowStage: { type: String },
  updates: [updateSchema]
});

module.exports = mongoose.model('Report', ReportSchema);