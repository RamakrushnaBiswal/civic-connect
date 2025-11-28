const mongoose = require('mongoose');
const PasswordResetSchema = new mongoose.Schema({
  personnelId: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
