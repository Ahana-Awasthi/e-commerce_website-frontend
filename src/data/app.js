require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const Product = require('./models/product');

const app = express();

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- CORS ---
app.use(cors()); // Allow all origins (for testing)
// app.use(cors({ origin: "http://localhost:5173" })); // Restrict in production

// --- view engine setup ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTE TO GET PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});

// --- API ROUTES ---
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Any route not handled by API, serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// --- Serve React frontend ---
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  // Serve index.html for all non-API requests
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
});

// --- catch 404 ---
app.use(function (req, res, next) {
  next(createError(404));
});

// --- error handler ---
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
