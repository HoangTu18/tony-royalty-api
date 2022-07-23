const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// routes
const todoRoute = require('./routes/todo');
const userRoute = require('./routes/user');

dotenv.config();
app.use(cors());

// env
const PORT = process.env.PORT || 3000;

// connect to DB
mongoose.connect(process.env.DB_CONNECT, {})
  .then(() => {
    console.log('connected to Mongo!')
  })
  .catch(err => {
    console.error('Error connecting to mongo: ', err)
  })

// middlewares
app.use(express.json({ extends: true }));
app.get('/', (_, res) => {
  res.send('API running successfully')
})

// route
app.use('/api/todo', todoRoute);
app.use('/api/user', userRoute);

// listen server
app.listen(PORT, () => {
  console.log(`Server Up and running locahost:${PORT}`)
})