const Report = require("../models/Report");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("Cloudinary Config:", cloudinary.config());

exports.addReport = async (req, res) => {
  // console.log("Request body:", req);
  try {
    const {
      id,
      name,
      email,
      phone,
      category,
      location,
      description,
      coordinates,
    } = req.body;

    // console.log(req.file);
    console.log("Coordinates:", coordinates);
    let coordsArray;

try {
  coordsArray = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
} catch (e) {
  return res.status(400).json({ message: "Coordinates is not a valid JSON string" });
}

if (!Array.isArray(coordsArray) || coordsArray.length !== 2) {
  return res.status(400).json({ message: "Coordinates format is invalid" });
}
    console.log("Parsed Coordinates:", coordsArray);

    const coords = {
      lat: coordsArray[1],
      lng: coordsArray[0],
    };

    let imageUrl = null;

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "reports", // optional folder name
        use_filename: true,
        unique_filename: false,
      });

      imageUrl = result.secure_url;
    }

    // console.log("Image URL:", imageUrl);

    const newReport = new Report({
      id,
      name,
      email,
      phone,
      category,
      location,
      description,
      coordinates: coords,
      photo: imageUrl,
    });
    console.log(newReport);
    try {
      await newReport.save();
      res
        .status(201)
        .json({ message: "Report added successfully", report: newReport });
    } catch (err) {
      console.error("Error saving report:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.showReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single report by id
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ id: req.params.id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update report status or other fields
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report updated successfully", report });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
