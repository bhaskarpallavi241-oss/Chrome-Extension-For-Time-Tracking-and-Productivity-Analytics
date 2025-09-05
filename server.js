const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Activity = require('./models/Activity');
const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
app.post('/api/track', async (req, res) => {
  const { url, duration, timestamp, classification } = req.body;

  if (!url || !duration || !timestamp || !classification) {
    return res.status(400).json({ error: "Missing data fields" });
  }

  const isProductive = classification === 'productive';

  try {
    const activity = new Activity({
      site: url,
      duration,
      timestamp,
      productive: isProductive,
      classification
    });

    await activity.save();
    res.sendStatus(200);
  } catch (err) {
    console.error("Error saving activity:", err);
    res.status(500).json({ error: "Failed to save activity" });
  }
});

app.get('/api/report', async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const activities = await Activity.find({ timestamp: { $gte: weekAgo } });

    let productive = 0, unproductive = 0;

    activities.forEach(a => {
      if (a.productive) productive += a.duration;
      else unproductive += a.duration;
    });

    res.json({ productive, unproductive });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});
app.get('/api/report/details', async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const result = await Activity.aggregate([
      {
        $match: { timestamp: { $gte: weekAgo } }
      },
      {
        $group: {
          _id: "$site",
          totalDuration: { $sum: "$duration" },
          classification: { $first: "$classification" }
        }
      }
    ]);

    const formatted = result.map(item => ({
      url: item._id,
      totalDuration: item.totalDuration,
      classification: item.classification
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});
const path = require('path');
app.use(express.static(path.join(__dirname)));
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
