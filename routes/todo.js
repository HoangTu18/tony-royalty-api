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

// get single todo
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findById(id);
    res.status(200).json({
      data: todo || {},
      isSuccess: true
    })
  } catch {
    res.status(500).json({
      msg: 'Server is erorr',
      isSuccess: false
    })
  }
})

// delete todo
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findByIdAndRemove({ _id: id });
    if(!todo) {
      res.status(400).json({
        msg: 'Todo not found',
        isSuccess: false
      })
      return;
    }
    res.status(200).json({
      msg: 'Delete successfully!',
      isSuccess: true
    })
  } catch {
    res.status(500).json({
      msg: 'Server is erorr',
      isSuccess: false
    })
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

// update todo
router.put('/:id', async(req, res) => {
  const id = req.params.id;

  const title = req.body.title || '';
  const assigner = req.body.assigner || [];
  const severity = req.body.severity || "";
  const description = req.body.description || "";
  const status = req.body.status || "";

  const fields = {};
  if(title) fields.title = title;
  if(severity) fields.severity = severity;
  if(description) fields.description = description;
  if(status) fields.status = status;
  fields.assigner = assigner

  try {
    const data = await Todo.findOneAndUpdate(
      { _id: id },
      { $set: fields },
      { new: true }
    )
    if(!data) {
      res.status(400).json({
        msg: 'Todo not found',
        isSuccess: false
      })
      return;
    }
    res.status(200).json({
      data,
      msg: 'Updated successfully!',
      isSuccess: true
    })
  } catch(err) {
    console.log(err)
    res.status(500).json({
      msg: err,
      isSuccess: false
    })
  }
})

module.exports = router;

