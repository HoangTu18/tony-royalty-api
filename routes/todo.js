const router = require('express').Router();

// model
const Todo = require('../model/Todo');

// get todo
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ data: -1 });
    const json = {
      data: todos,
      isSuccess: true
    }
    res.status(200).json(json)
  } catch(err) {
    res.status(500).json(err)
  }
  
})

// add todo
router.post('/', async (req, res) => {
  const title = req.body.title || '';
  const assigner = req.body.assigner || [];
  const severity = req.body.severity || "";
  const description = req.body.description || "";
  const status = req.body.status || "";

  // create a new todo
  const json = {
    title, 
    assigner, 
    severity, 
    description, 
    status
  }
  const todo = new Todo(json);

  try {
    await todo.save();
    res.status(200).json({
      msg: 'Create new todo successfully',
      isSuccess: true,
      data: json
    })
  } catch(err) {
    res.status(500).json({
      msg: err,
      isSuccess: false
    })
  }
})

module.exports = router;

