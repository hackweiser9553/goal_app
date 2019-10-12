const express = require('express');
const auth = require('../middlewares/auth');
const router = new express.Router();
const Goal = require('../models/goal');

const Task = require('../models/task');

router.post('/:goalId/tasks', auth, async (req, res) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findById(goalId);
    const task = new Task({ ...req.body, goalDetail: goal._id, userDetail: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/:goalId/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    const { goalId } = req.params;
    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    await goal
      .populate({
        path: 'tasks',
        match,
      })
      .execPopulate();
    res.status(200).send(goal.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/:goalId/tasks/:id', auth, async (req, res) => {
  try {
    const { id, goalId } = req.params;
    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    if (!goal) {
      return res.status(404).send();
    }
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/:goalId/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  const { id, goalId } = req.params;
  try {
    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    if (!goal) {
      return res.status(404).send();
    }
    const task = await Task.findById(id);
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/:goalId/tasks/:id', auth, async (req, res) => {
  try {
    const { id, goalId } = req.params;
    const goal = await Goal.findOne({ _id: goalId, owner: req.user._id });
    if (!goal) {
      return res.status(404).send();
    }
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
