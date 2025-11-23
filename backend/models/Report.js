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
  priority: { type: String, required: true, enum: ["Low", "Medium", "High", "Critical"]},
  status: { type: String, required: true,default:"pending", enum: ["pending", "in progress", "resolved", "closed"] },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  assignedTo: { type: String,default:null },
  assignedPersonnelId: { type: String, default: null },
  assignedDate: { type: Date, default: null },
  location: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  photo: { type: String,required: true },
  escalated: { type: Boolean, default: false },
  workflowStage: { type: String, default: "New",enum: ["New", "In Progress", "Under Review", "Resolved", "Closed"] },
  updates: [updateSchema]
},{ timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);