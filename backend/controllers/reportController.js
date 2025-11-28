const Report = require("../models/Report");
const { sendMail } = require('../utils/mailer');
const Personnel = require("../models/Personnel");
const User = require('../models/User');
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
      slaDeadline: req.body.slaDeadline ? new Date(req.body.slaDeadline) : null,
    });
    // console.log(newReport);
    try {
      await newReport.save();

      // Send notification email to the report submitter
      try {
        const subject = `Civic-Connect: Report Received (${newReport.id})`;
        const text = `Your report has been received.\n\nTitle: ${newReport.title}\nIssue: ${newReport.description}\nStatus: ${newReport.status}\n\nWe'll notify you when the status changes.`;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const html = `<p>Hi ${newReport.name || ''},</p>
          <p>Thank you for reporting the issue. We have received your report and will track it with the following details:</p>
          <ul>
            <li><strong>Report ID:</strong> ${newReport.id}</li>
            <li><strong>Title:</strong> ${newReport.title}</li>
            <li><strong>Issue:</strong> ${newReport.description}</li>
            <li><strong>Status:</strong> ${newReport.status}</li>
          </ul>
          <p>We will notify you about any updates to the status of this report. You can view this report here: <a href="${frontendUrl}/reports/${newReport.id}">${frontendUrl}/reports/${newReport.id}</a></p>
          <p>Regards,<br/>Civic-Connect Team</p>`;

        if (newReport.email) {
          await sendMail({ to: newReport.email, subject, text, html });
        }
      } catch (mailErr) {
        console.warn('Warning: failed to send report submission email', mailErr && mailErr.message ? mailErr.message : mailErr);
      }

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

// Get reports for the authenticated user
exports.getMyReports = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const reports = await Report.find({ email: user.email });
    res.json({ reports });
  } catch (error) {
    console.error('Error fetching my reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

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

    // First find the report so we can compare/notify
    let report = await Report.findOne({ id: req.params.id });
    if (!report) {
      const maybeObjectId = req.params.id;
      const isLikelyObjectId = /^[0-9a-fA-F]{24}$/.test(maybeObjectId);
      if (isLikelyObjectId) report = await Report.findById(maybeObjectId);
    }

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const prevStatus = report.status;
    const prevWorkflow = report.workflowStage;

    // Apply incoming updates to the report instance
    Object.keys(updateData).forEach((key) => {
      // Convert incoming SLA to Date if provided as string
      if (key === 'slaDeadline' && updateData[key]) {
        report[key] = new Date(updateData[key])
      } else {
        report[key] = updateData[key]
      }
    });

    // If not found by custom id, and the provided id looks like a Mongo ObjectId, try by _id
    if (!report) {
      const maybeObjectId = req.params.id
      const isLikelyObjectId = /^[0-9a-fA-F]{24}$/.test(maybeObjectId)
      if (isLikelyObjectId) {
        report = await Report.findByIdAndUpdate(maybeObjectId, { $set: updateData }, { new: true })
      }
    }

    console.log("Updated report:", report);

    // If status changed, append update entry and notify reporter
    try {
      if (updateData.status && updateData.status !== prevStatus) {
        const statusUpdate = {
          date: new Date().toISOString(),
          message: `Status changed to ${updateData.status}`,
          author: updateData.author || 'Admin'
        }
        report.updates = report.updates || []
        report.updates.push(statusUpdate)

        const subject = `Civic-Connect: Report ${report.id} status changed to ${report.status}`;
        const text = `The status of your report (ID: ${report.id}) has been updated to: ${report.status}.\n\nTitle: ${report.title}\nPlease visit the portal for more information.`;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const html = `<p>Hi ${report.name || ''},</p>
          <p>The status of your report <strong>${report.id}</strong> has been changed to <strong>${report.status}</strong>.</p>
          <p><strong>Title:</strong> ${report.title}</p>
          <p>View details: <a href="${frontendUrl}/reports/${report.id}">${frontendUrl}/reports/${report.id}</a></p>
          <p>Thank you for reporting the issue — we'll keep you updated.</p>`;
        if (report.email) await sendMail({ to: report.email, subject, text, html });
      }
      // If workflow stage changed, notify reporter too
      if (updateData.workflowStage && updateData.workflowStage !== prevWorkflow) {
        const wfUpdate = {
          date: new Date().toISOString(),
          message: `Workflow stage changed to ${updateData.workflowStage}`,
          author: updateData.author || 'Admin'
        }
        report.updates = report.updates || []
        report.updates.push(wfUpdate)

        const subject = `Civic-Connect: Report ${report.id} stage updated to ${report.workflowStage}`;
        const text = `The workflow stage of your report (ID: ${report.id}) has been updated to: ${report.workflowStage}.`;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const html = `<p>Hi ${report.name || ''},</p>
          <p>The workflow stage of your report <strong>${report.id}</strong> has been updated to <strong>${report.workflowStage}</strong>.</p>
          <p>View details: <a href="${frontendUrl}/reports/${report.id}">${frontendUrl}/reports/${report.id}</a></p>`;
        if (report.email) await sendMail({ to: report.email, subject, text, html });
      }
    } catch (mailErr) {
      console.warn('Failed to send update notification email', mailErr && mailErr.message ? mailErr.message : mailErr);
    }

    // Save with appended updates (if any) and send final response
    await report.save();
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

    // Send notification emails: to reporter and to assigned personnel (if available)
    try {
      const subjectReporter = `Civic-Connect: Report ${report.id} assigned`;
      const textReporter = `Your report (ID: ${report.id}) has been assigned to ${report.assignedTo || 'a personnel'}.`;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const htmlReporter = `<p>Hello ${report.name || ''},</p><p>Your report <strong>${report.id}</strong> has been assigned to <strong>${report.assignedTo || 'a personnel'}</strong>.</p><p>View details: <a href="${frontendUrl}/reports/${report.id}">${frontendUrl}/reports/${report.id}</a></p>`;
      if (report.email) await sendMail({ to: report.email, subject: subjectReporter, text: textReporter, html: htmlReporter });

      if (assignedPersonnelId) {
        const person = await Personnel.findOne({ id: assignedPersonnelId });
        if (person && person.email) {
          const subjectPersonnel = `Civic-Connect: New assignment - Report ${report.id}`;
          const textPersonnel = `You have been assigned to the report (ID: ${report.id}) titled: ${report.title}`;
          const htmlPersonnel = `<p>Hi ${person.name || ''},</p><p>You have been assigned to the following report:</p><ul><li><strong>Report ID:</strong> ${report.id}</li><li><strong>Title:</strong> ${report.title}</li><li><strong>Description:</strong> ${report.description}</li></ul><p>View details: <a href="${frontendUrl}/reports/${report.id}">${frontendUrl}/reports/${report.id}</a></p>`;
          await sendMail({ to: person.email, subject: subjectPersonnel, text: textPersonnel, html: htmlPersonnel });
        }
      }
    } catch (mailErr) {
      console.warn('Warning: failed to send assignment email(s)', mailErr && mailErr.message ? mailErr.message : mailErr);
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

    // Notify reporter that the report was unassigned
    try {
      const subjectReporter = `Civic-Connect: Report ${report.id} unassigned`;
      const textReporter = `Your report (ID: ${report.id}) has been unassigned.`;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const htmlReporter = `<p>Hello ${report.name || ''},</p><p>Your report <strong>${report.id}</strong> has been unassigned.</p><p>View details: <a href="${frontendUrl}/reports/${report.id}">${frontendUrl}/reports/${report.id}</a></p>`;
      if (report.email) await sendMail({ to: report.email, subject: subjectReporter, text: textReporter, html: htmlReporter });
    } catch (mailErr) {
      console.warn('Warning: failed to send unassignment email', mailErr && mailErr.message ? mailErr.message : mailErr);
    }

    res.json({ message: 'Report unassigned', report })
  } catch (error) {
    console.error('Error unassigning report:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// For personnel: get assigned reports
exports.getAssignedReportsForPersonnel = async (req, res) => {
  try {
    if (!req.personnel || !req.personnel.id) return res.status(401).json({ message: 'Unauthorized' });
    const assignedId = req.personnel.id;
    const reports = await Report.find({ assignedPersonnelId: assignedId });
    res.json({ reports });
  } catch (error) {
    console.error('Error fetching assigned reports for personnel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Personnel updates status for their assigned report
exports.updateStatusByPersonnel = async (req, res) => {
  try {
    const { status, note } = req.body;
    const id = req.params.id;
    let report = await Report.findOne({ id });
    if (!report) {
      const isLikelyObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isLikelyObjectId) report = await Report.findById(id);
    }
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (!req.personnel || req.personnel.id !== report.assignedPersonnelId) {
      return res.status(403).json({ message: 'Forbidden: not assigned to this report' });
    }
    const prevStatus = report.status;
    if (status && status !== prevStatus) {
      report.status = status;
      report.updates = report.updates || [];
      report.updates.push({ date: new Date().toISOString(), author: req.personnel.id, message: note || `Status changed to ${status}` });
    }
    await report.save();
    // notify reporter
    try {
      if (report.email) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const subject = `Civic-Connect: Your report ${report.id} status updated by worker`;
        const text = `Hello ${report.name || ''},\n\nThe status of your report ${report.id} has been updated to ${report.status} by a field worker.`;
        const html = `<p>Hello ${report.name || ''},</p><p>The status of your report <strong>${report.id}</strong> has been updated to <strong>${report.status}</strong> by a field worker.</p><p>View details: <a href="${frontendUrl}/reports/${report.id}">${frontendUrl}/reports/${report.id}</a></p>`;
        await sendMail({ to: report.email, subject, text, html });
      }
    } catch (e) { console.warn('Failed to send notification (personnel update):', e); }
    res.json({ message: 'Status updated', report });
  } catch (error) {
    console.error('Error updating report status by personnel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
