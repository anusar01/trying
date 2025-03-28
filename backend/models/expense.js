const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    trim: true, // Removes extra spaces
    enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"] // Restrict to valid categories
  },
  amount: { 
    type: Number, 
    required: true, 
    min: [0.01, "Amount must be greater than 0"] // Ensure positive value
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

// Create and export the model
module.exports = mongoose.model("Expense", ExpenseSchema);
