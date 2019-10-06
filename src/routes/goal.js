const express = require('express');

const router = new express.Router();

const Goal = require('../models/goal');

router.post('/goals', async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/goals', async (req, res) => {
  try {
    const goals = await Goal.find({});
    res.status(200).send(goals);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).send();
    }
    res.send(goal);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/goals/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'startDate', 'endDate', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  const { id } = req.params;
  try {
    const goal = await Goal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!goal) {
      return res.status(404).send();
    }
    res.send(goal);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) {
      return res.status(404).send();
    }
    res.send(goal);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
