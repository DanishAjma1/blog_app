const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task: String,
});
const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;