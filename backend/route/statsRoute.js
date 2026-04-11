import express from 'express';
import Stats from '../modal/Stats.js';

const router = express.Router();

// Increment a stat
router.post('/track', async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ message: 'key required' });
    const stat = await Stats.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true, count: stat.count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all stats
router.get('/', async (req, res) => {
  try {
    const stats = await Stats.find();
    const result = {};
    stats.forEach(s => { result[s.key] = s.count; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
