const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then(() => console.log('Successful connection to MongoDB'))
  .catch((err) => console.log('Error:', err));

app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/users', userRouter);
app.use('/', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
