const express = require('express');
const morgan = require('morgan');
const path = require('path');

const noteRouter = require('./routes/noteRoutes');

const app = express();

// [1] MIDLEWARE
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.createDate = new Date().toISOString();
    next();
});

// [2] HANDLERS FUNCTION
// controller/noteController

// [3] ROUTES
app.use('/api/v1/notes', noteRouter);
// routes/noteRoutes

// [4] START SERVER
// server.js

module.exports = app;
