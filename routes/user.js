const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// model
const User = require('../model/User');

// register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // check email existed
  const emailExists = await User.findOne({ email });
  if(emailExists) {
    return res.status(400).json({
      msg: 'Email already exists',
      isSuccess: false
    });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    firstName,
    lastName,
    email,
    role,
    password: hashPassword
  })

  try {
    await user.save();
    res.status(200).json({
      msg: 'Register successfully!',
      isSuccess: true
    });
  } catch (err) {
    res.status(500).json({
      msg: err,
      isSuccess: false
    });
  }
})

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // check email existed
  const user = await User.findOne({ email });
  if(!user) {
    return res.status(400).json({
      msg: 'Email or password is wrong',
      isSuccess: false
    });
  }

  // validate password
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword) {
    return res.status(400).json({
      msg: 'Email or password is wrong',
      isSuccess: false
    });
  }

  // create user
  const payload = {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  }

  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.header('x-auth-token', token).json({
        token,
        msg: 'Login Success',
        isSuccess: true
      })
    }
  )
})

// check auth
router.post('/auth', async (req, res) => {
  const token = req.header('x-auth-token');
  if(!token) {
    return res.status(400).json({
      msg: 'Access Denied',
      isSuccess: false
    });
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    res.status(200).json({
      user,
      isSuccess: true
    })
  } catch (err) {
    return res.status(500).json({
      msg: err,
      isSuccess: false
    });
  }
})

module.exports = router;
