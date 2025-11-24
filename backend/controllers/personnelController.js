const Personnel = require('../models/Personnel');
const Report = require('../models/Report');

// List personnel
exports.listPersonnel = async (req, res) => {
  try {
    let personnel = await Personnel.find();

    // If empty, seed with a small default set for developer convenience
    if (!personnel || personnel.length === 0) {
      const seed = [
        { id: 'p1', name: 'Alice Gomez', role: 'Technician', department: 'public-works', email: 'alice@example.com', phone: '555-0101', availability: 'Available', currentWorkload: 2, maxWorkload: 8, skills: ['electrical','inspection'] },
        { id: 'p2', name: 'Rahul Singh', role: 'Inspector', department: 'sanitation', email: 'rahul@example.com', phone: '555-0102', availability: 'Busy', currentWorkload: 5, maxWorkload: 8, skills: ['waste','inspection'] },
        { id: 'p3', name: 'Maria Perez', role: 'Engineer', department: 'road-maintenance', email: 'maria@example.com', phone: '555-0103', availability: 'Available', currentWorkload: 1, maxWorkload: 6, skills: ['roads','planning'] },
      ]
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
    const person = await Personnel.findOneAndUpdate({ id: req.params.id }, { $set: updates }, { new: true });
    if (!person) return res.status(404).json({ message: 'Personnel not found' });
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

    await person.save()
    res.status(201).json({ message: 'Personnel created', person })
  } catch (error) {
    console.error('Error creating personnel:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
