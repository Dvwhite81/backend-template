const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const User = require('../models/User');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  const userExists = await User.findOne({ username: username });

  if (userExists) {
    return res.status(400).json({
      username: 'Username Already Exists',
    });
  } else {
    const newUser = new User({
      username: username,
      password: password,
      recipes: [],
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        try {
          const createdUser = await newUser.save()
          res.status(201).json(createdUser);
        } catch (error) {
          console.log('Error:', error);
        }
      });
    });
  }
});

authRouter.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        usernamenotfound: 'Username Not Found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const payload = {
        id: user.id,
        username: user.username,
      };

      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: '1d',
        },
        (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token,
          });
        }
      );
    } else {
      return res.status(404).json({
        passwordincorrect: 'Password Incorrect',
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = authRouter;
