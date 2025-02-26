const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/database');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cookieParser());

const isTest = process.env.ISTEST === "true"; // Convert string to boolean

// Get allowed origins from environment variable and convert them to an array
const allowedProdOrigins = process.env.ALLOWED_PROD_ORIGINS
  ? process.env.ALLOWED_PROD_ORIGINS.split(",")
  : [];


// CORS allow any request from localhost
const corsOptions = isTest ? 
{
  origin: function (origin, callback) {
    // Allow requests from localhost with any port
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // credentials: true,
} :
{
  origin: function (origin, callback) {
    if (!origin || allowedProdOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,POST,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
};

// Enable CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Auth routes
app.use('/auth', authRoutes);

// User routes
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));