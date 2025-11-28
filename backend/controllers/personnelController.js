const Personnel = require('../models/Personnel');
const { sendMail } = require('../utils/mailer');
const Report = require('../models/Report');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');
require('dotenv').config();

// List personnel
exports.listPersonnel = async (req, res) => {
  try {
    let personnel = await Personnel.find().select('-password');

    // If empty, seed with a small default set for developer convenience
    if (!personnel || personnel.length === 0) {
      const seed = [
        { id: 'p1', name: 'Alice Gomez', role: 'Technician', department: 'public-works', email: 'alice@example.com', phone: '555-0101', availability: 'Available', currentWorkload: 2, maxWorkload: 8, skills: ['electrical','inspection'] },
        { id: 'p2', name: 'Rahul Singh', role: 'Inspector', department: 'sanitation', email: 'rahul@example.com', phone: '555-0102', availability: 'Busy', currentWorkload: 5, maxWorkload: 8, skills: ['waste','inspection'] },
        { id: 'p3', name: 'Maria Perez', role: 'Engineer', department: 'road-maintenance', email: 'maria@example.com', phone: '555-0103', availability: 'Available', currentWorkload: 1, maxWorkload: 6, skills: ['roads','planning'] },
      ]
      // give seeded users a default password 'password123'
      for (const p of seed) {
        const hashed = await bcrypt.hash('password123', 10);
        p.password = hashed;
      }
      await Personnel.insertMany(seed)
      personnel = await Personnel.find()
    }

    res.json({ personnel });
  } catch (error) {
    console.error('Error listing personnel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Update personnel (partial)
exports.updatePersonnel = async (req, res) => {
  try {
    const updates = req.body;
    // If password is provided, hash it before saving
    let plainPassword = null
    if (updates.password) {
      plainPassword = updates.password
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const person = await Personnel.findOneAndUpdate({ id: req.params.id }, { $set: updates }, { new: true }).select('-password');
    if (!person) return res.status(404).json({ message: 'Personnel not found' });
    // Send password reset email if admin provided a new password and opted to send
    try {
      if (plainPassword && updates.sendPasswordReset !== false && person.email && !updates.sendResetLink) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const subject = `Civic-Connect: Your worker password has been reset`;
        const text = `Hello ${person.name || ''},\n\nYour password has been updated by an administrator.\n\nID: ${person.id}\nNew Password: ${plainPassword}\nPlease login: ${frontendUrl}/owner/login\n\nIt is recommended that you change your password after your first login.`
        const html = `<p>Hello ${person.name || ''},</p><p>Your password has been updated by an administrator.</p><ul><li><strong>ID:</strong> ${person.id}</li><li><strong>New Password:</strong> ${plainPassword}</li></ul><p>Please <a href="${frontendUrl}/owner/login">login</a> and change your password as soon as possible.</p>`
        await sendMail({ to: person.email, subject, text, html })
      }
      if (updates.sendResetLink === true && person.email) {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour
        await PasswordReset.create({ personnelId: person.id, tokenHash, expiresAt });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const subject = `Civic-Connect: Set up your account`;
        const link = `${frontendUrl}/owner/reset-password?token=${token}&email=${encodeURIComponent(person.email)}`;
        const text = `Hello ${person.name || ''},\n\nAn account has been updated for you on Civic-Connect. Please set your password by visiting: ${link}\n\nThis link will expire in one hour.`
        const html = `<p>Hello ${person.name || ''},</p><p>An account has been updated for you on Civic-Connect. Please <a href="${link}">set your password</a>. This link will expire in one hour.</p>`
        try {
          await sendMail({ to: person.email, subject, text, html })
        } catch (e) {
          console.warn('Failed to send worker setup link email', e && e.message ? e.message : e)
        }
      }
    } catch (e) {
      console.warn('Failed to send reset credentials email', e && e.message ? e.message : e)
    }

    res.json({ person });
  } catch (error) {
    console.error('Error updating personnel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Seed personnel with provided list (for dev)
exports.seedPersonnel = async (req, res) => {
  try {
    const seed = req.body && req.body.personnel;
    if (!Array.isArray(seed)) return res.status(400).json({ message: 'Provide `personnel` array in body' });

    // Upsert each by id
    const results = [];
    for (const p of seed) {
      const doc = await Personnel.findOneAndUpdate({ id: p.id }, { $set: p }, { upsert: true, new: true });
      results.push(doc);
    }

    res.json({ message: 'Personnel seeded', personnel: results });
  } catch (error) {
    console.error('Error seeding personnel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Increment/decrement workload by delta
exports.changeWorkload = async (req, res) => {
  try {
    const { delta } = req.body; // number
    if (typeof delta !== 'number') return res.status(400).json({ message: 'Provide numeric delta in body' });

    const person = await Personnel.findOneAndUpdate({ id: req.params.id }, { $inc: { currentWorkload: delta } }, { new: true });
    if (!person) return res.status(404).json({ message: 'Personnel not found' });
    res.json({ person });
  } catch (error) {
    console.error('Error changing workload:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Create a new personnel record
exports.createPersonnel = async (req, res) => {
  try {
    const payload = req.body || {}
    const { id, name, role, department, email, phone, availability, currentWorkload, maxWorkload, avatar, skills } = payload

    if (!name) return res.status(400).json({ message: 'Name is required' })

    const newId = id || `p${Date.now()}`

    // Prevent duplicate id
    const exists = await Personnel.findOne({ id: newId })
    if (exists) return res.status(409).json({ message: 'Personnel with this id already exists' })

    const person = new Personnel({
      id: newId,
      name,
      role,
      department,
      email,
      phone,
      availability: availability || 'Available',
      currentWorkload: typeof currentWorkload === 'number' ? currentWorkload : 0,
      maxWorkload: typeof maxWorkload === 'number' ? maxWorkload : 8,
      avatar,
      skills,
    })
    // if password provided, hash it
    if (payload.password) {
      person.password = await bcrypt.hash(payload.password, 10)
      // If admin set a password and wants them to change it on first login
      if (payload.mustChangePassword !== false) person.mustChangePassword = true
    }
    // If admin wants to send a reset link (passwordless setup), force change-on-first-login
    if (payload.sendResetLink === true) {
      person.mustChangePassword = true
    }

    await person.save()
    const { password: _, ...personPublic } = person.toObject()

    // Send credentials to user if requested and email exists
    try {
      if (payload.password && payload.sendCredentials !== false && person.email && !payload.sendResetLink) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const subject = `Civic-Connect: Your worker credentials`;
        const text = `Hello ${person.name || ''},\n\nAn account has been created for you on Civic-Connect.\n\nID: ${person.id}\nPassword: ${payload.password}\nPlease login: ${frontendUrl}/owner/login\n\nIt is recommended that you change your password after your first login.`
        const html = `<p>Hello ${person.name || ''},</p><p>An account has been created for you on Civic-Connect.</p><ul><li><strong>ID:</strong> ${person.id}</li><li><strong>Password:</strong> ${payload.password}</li></ul><p>Please <a href="${frontendUrl}/owner/login">login</a> and change your password as soon as possible.</p>`
        await sendMail({ to: person.email, subject, text, html })
      }
      // Option: admin wants to send reset link instead of plaintext password
      if (payload.sendResetLink === true && person.email) {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour
        await PasswordReset.create({ personnelId: person.id, tokenHash, expiresAt });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const subject = `Civic-Connect: Set up your account`;
        const link = `${frontendUrl}/owner/reset-password?token=${token}&email=${encodeURIComponent(person.email)}`;
        const text = `Hello ${person.name || ''},\n\nAn account has been created for you on Civic-Connect. Please set your password by visiting: ${link}\n\nThis link will expire in one hour.`
        const html = `<p>Hello ${person.name || ''},</p><p>An account has been created for you on Civic-Connect. Please <a href="${link}">set your password</a>. This link will expire in one hour.</p>`
        try {
          await sendMail({ to: person.email, subject, text, html })
        } catch (e) {
          console.warn('Failed to send worker setup link email', e && e.message ? e.message : e)
        }
      }
    } catch (e) {
      console.warn('Failed to send worker credentials email', e && e.message ? e.message : e)
    }

    res.status(201).json({ message: 'Personnel created', person: personPublic })
  } catch (error) {
    console.error('Error creating personnel:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Login route for personnel (workers)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const person = await Personnel.findOne({ email: email.trim() });
    if (!person || !person.password) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, person.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: person.id, role: 'personnel' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, personnel: { id: person.id, name: person.name, email: person.email, mustChangePassword: person.mustChangePassword } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get reports assigned to this personnel
exports.getAssignedReports = async (req, res) => {
  try {
    if (!req.personnel || !req.personnel.id) return res.status(401).json({ message: 'Unauthorized' });
    const assignedId = req.personnel.id;
    const reports = await Report.find({ assignedPersonnelId: assignedId });
    res.json({ reports });
  } catch (error) {
    console.error('Error fetching assigned reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Logged in personnel change password (requires personnelAuth)
exports.changePassword = async (req, res) => {
  try {
    if (!req.personnel || !req.personnel.id) return res.status(401).json({ message: 'Unauthorized' });
    const { oldPassword, newPassword } = req.body;
    const person = await Personnel.findOne({ id: req.personnel.id });
    if (!person) return res.status(404).json({ message: 'Personnel not found' });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
    // If mustChangePassword is set, don't require oldPassword
    if (!person.mustChangePassword) {
      if (!oldPassword) return res.status(400).json({ message: 'Old password required' });
      const match = await bcrypt.compare(oldPassword, person.password);
      if (!match) return res.status(401).json({ message: 'Old password invalid' });
    }
    person.password = await bcrypt.hash(newPassword, 10);
    person.mustChangePassword = false;
    await person.save();
    res.json({ message: 'Password changed' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Request password reset token (email contains link)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const person = await Personnel.findOne({ email: email.trim() });
    // Avoid leaking whether an account exists: always respond success message
    if (!person) return res.json({ message: 'Password reset sent if the account exists' });
    // Generate token and store its hash
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour
    await PasswordReset.create({ personnelId: person.id, tokenHash, expiresAt });
    // send email with link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const subject = `Civic-Connect: Password reset request`;
    const link = `${frontendUrl}/owner/reset-password?token=${token}&email=${encodeURIComponent(person.email)}`;
    const text = `Hello ${person.name || ''},\n\nA request to reset your password has been received. Please click the link to set a new password: ${link}\n\nIf you did not request this, please contact the administrator.`;
    const html = `<p>Hello ${person.name || ''},</p><p>A request to reset your password has been received. Please <a href="${link}">click here</a> to set a new password. This link will expire in one hour.</p>`;
    try {
      await sendMail({ to: person.email, subject, text, html });
    } catch (e) {
      console.warn('Failed to send password reset email', e && e.message ? e.message : e)
    }
    res.json({ message: 'Password reset sent if the account exists' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Reset password using token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and newPassword required' });
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const pr = await PasswordReset.findOne({ tokenHash });
    if (!pr || pr.used || pr.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired token' });
    const person = await Personnel.findOne({ id: pr.personnelId });
    if (!person) return res.status(404).json({ message: 'Personnel not found' });
    person.password = await bcrypt.hash(newPassword, 10);
    person.mustChangePassword = false;
    await person.save();
    pr.used = true;
    await pr.save();
    res.json({ message: 'Password changed' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
