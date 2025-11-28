const mongoose = require('mongoose');

const PersonnelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String },
  mustChangePassword: { type: Boolean, default: false },
  department: { type: String },
  phone: { type: String },
  availability: { type: String, default: 'Available' },
  currentWorkload: { type: Number, default: 0 },
  maxWorkload: { type: Number, default: 8 },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Personnel', PersonnelSchema);
