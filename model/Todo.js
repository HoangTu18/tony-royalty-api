const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  assigner: {
    type: Array,
  },
  severity: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  status: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema);