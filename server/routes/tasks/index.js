const express = require('express');
const connectDatabase = require('../../libs/connectDb');
const router = express.Router();
const Task = require('../../libs/models/tasks.js');

connectDatabase();
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post('/tasks', async (req, res) => {
  const newTask = new Task({ task: req.body.task });
  await newTask.save();
  res.json({ message: 'Task added' });
});

router.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted' });
});

router.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { task: req.body.task },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
});
exports = router;
module.exports = router;