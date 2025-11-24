const mongoose = require('mongoose');

const PersonnelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String },
  department: { type: String },
  email: { type: String },
  phone: { type: String },
  availability: { type: String, default: 'Available' },
  currentWorkload: { type: Number, default: 0 },
  maxWorkload: { type: Number, default: 8 },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Personnel', PersonnelSchema);
