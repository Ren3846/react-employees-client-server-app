const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

require('dotenv').config()

const userRouter = require('./routes/users');
const employeeRouter = require('./routes/employees');
const app = express();

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/employees', employeeRouter);

module.exports = app;
