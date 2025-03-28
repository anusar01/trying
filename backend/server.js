const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Passport Config
require("./passportConfig");

// Session setup for authentication
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Secure session key
        resave: false,
        saveUninitialized: false, 
        cookie: {
            secure: process.env.NODE_ENV === "production", 
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000, 
        },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Failed:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
