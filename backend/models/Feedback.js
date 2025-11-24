const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: false },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  comments: [
    {
      author: { type: String },
      message: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  resolved: { type: Boolean, default: false },
  resolutionNotes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
