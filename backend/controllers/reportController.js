const Report = require("../models/Report");
const Personnel = require("../models/Personnel");
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
      priority,
      location,
      title,
      description,
      coordinates,
    } = req.body;

    // console.log(req.file);
    // console.log("Coordinates:", coordinates);
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
      title,
      priority,
      category,
      location,
      description,
      coordinates: coords,
      photo: imageUrl,
    });
    // console.log(newReport);
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
    const updateData = req.body;
    console.log("Update data received:", updateData);

    // First try to find by custom `id` field
    let report = await Report.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateData },
      { new: true }
    );

    // If not found by custom id, and the provided id looks like a Mongo ObjectId, try by _id
    if (!report) {
      const maybeObjectId = req.params.id
      const isLikelyObjectId = /^[0-9a-fA-F]{24}$/.test(maybeObjectId)
      if (isLikelyObjectId) {
        report = await Report.findByIdAndUpdate(maybeObjectId, { $set: updateData }, { new: true })
      }
    }

    console.log("Updated report:", report);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report updated successfully", report });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Assign a report to a person and append an assignment update
exports.assignReport = async (req, res) => {
  try {
    const { assignedTo, note, assignedBy, assignedPersonnelId } = req.body;

    if (!assignedTo && !assignedPersonnelId) {
      return res.status(400).json({ message: 'assignedTo or assignedPersonnelId is required' });
    }

    const updateEntry = {
      author: assignedBy || 'Admin',
      date: new Date().toISOString(),
      message: note || `Assigned to ${assignedTo || assignedPersonnelId}`,
    };

    // Find the report first so we can track previous assignee
    let report = await Report.findOne({ id: req.params.id });
    if (!report) {
      const maybeObjectId = req.params.id
      const isLikelyObjectId = /^[0-9a-fA-F]{24}$/.test(maybeObjectId)
      if (isLikelyObjectId) {
        report = await Report.findById(maybeObjectId)
      }
    }

    if (!report) return res.status(404).json({ message: 'Report not found' })

    const prevAssignedPersonnelId = report.assignedPersonnelId || null

    // Update report fields
    report.assignedTo = assignedTo || report.assignedTo
    if (assignedPersonnelId) report.assignedPersonnelId = assignedPersonnelId
    report.workflowStage = 'assigned'
    report.updates = report.updates || []
    report.updates.push(updateEntry)

    await report.save()

    // Update personnel workloads if personnel IDs provided
    try {
      if (assignedPersonnelId) {
        await Personnel.findOneAndUpdate({ id: assignedPersonnelId }, { $inc: { currentWorkload: 1 } })
      }
      if (prevAssignedPersonnelId && prevAssignedPersonnelId !== assignedPersonnelId) {
        // decrement previous assignee's workload but not below zero
        await Personnel.findOneAndUpdate({ id: prevAssignedPersonnelId }, { $inc: { currentWorkload: -1 } })
      }
    } catch (pErr) {
      console.warn('Failed to update personnel workloads:', pErr.message)
    }

    res.json({ message: 'Report assigned', report })
  } catch (error) {
    console.error('Error assigning report:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Unassign a report (remove assignee and adjust workloads)
exports.unassignReport = async (req, res) => {
  try {
    const { note, unassignedBy } = req.body || {}

    // Find report by custom id or _id
    let report = await Report.findOne({ id: req.params.id });
    if (!report) {
      const maybeObjectId = req.params.id
      const isLikelyObjectId = /^[0-9a-fA-F]{24}$/.test(maybeObjectId)
      if (isLikelyObjectId) {
        report = await Report.findById(maybeObjectId)
      }
    }

    if (!report) return res.status(404).json({ message: 'Report not found' })

    const prevAssignedPersonnelId = report.assignedPersonnelId || null
    const prevAssignedTo = report.assignedTo || null

    const updateEntry = {
      author: unassignedBy || 'Admin',
      date: new Date().toISOString(),
      message: note || `Unassigned from ${prevAssignedTo || prevAssignedPersonnelId || 'assignee'}`,
    }

    // Reset assignment fields
    report.assignedTo = 'Unassigned'
    report.assignedPersonnelId = null
    report.workflowStage = 'pending-assignment'
    report.updates = report.updates || []
    report.updates.push(updateEntry)

    await report.save()

    // Adjust previous assignee workload if applicable
    try {
      if (prevAssignedPersonnelId) {
        const person = await Personnel.findOne({ id: prevAssignedPersonnelId })
        if (person) {
          const newWorkload = Math.max(0, (person.currentWorkload || 0) - 1)
          person.currentWorkload = newWorkload
          await person.save()
        }
      }
    } catch (pErr) {
      console.warn('Failed to adjust previous assignee workload:', pErr.message)
    }

    res.json({ message: 'Report unassigned', report })
  } catch (error) {
    console.error('Error unassigning report:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
