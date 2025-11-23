const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const reportRoutes = require('./routes/reportRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Passport config
require('./config/passport');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(passport.initialize());

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api/reports', reportRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
