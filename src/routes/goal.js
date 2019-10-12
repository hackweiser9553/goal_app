const express = require('express');
const Goal = require('../models/goal');
const auth = require('../middlewares/auth');
const router = new express.Router();

router.post('/goals', auth, async (req, res) => {
  const goal = new Goal({ ...req.body, owner: req.user._id });
  try {
    await goal.save();
    res.status(201).send(goal);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/goals', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    await req.user
      .populate({
        path: 'goals',
        match,
      })
      .execPopulate();
    res.send(req.user.goals);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/goals/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const goal = await Goal.findOne({ _id: id, owner: req.user._id });
    if (!goal) {
      return res.status(404).send();
    }
    res.send(goal);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/goals/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'startDate', 'endDate', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  const { id } = req.params;
  try {
    const goal = await Goal.findOne({ _id: id, owner: req.user._id });
    if (!goal) {
      return res.status(404).send();
    }
    updates.forEach(update => (goal[update] = req.body[update]));
    await goal.save();
    res.send(goal);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/goals/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!goal) {
      return res.status(404).send();
    }
    res.send(goal);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
