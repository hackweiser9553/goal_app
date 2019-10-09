const express = require('express');
require('./db/mongoose');
require('dotenv').config();
const userRouter = require('./routes/user');
const goalRouter = require('./routes/goal');
const taskRouter = require('./routes/task');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(userRouter);
app.use(goalRouter);
app.use(taskRouter);

app.listen(PORT);
