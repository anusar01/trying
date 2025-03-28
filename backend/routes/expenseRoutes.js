const express = require("express");
const Expense = require("../models/expense");  // Import the Expense model
const router = express.Router();

// Get all expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add expense
router.post("/add", async (req, res) => {
    try {
        const { name, category, amount } = req.body;
        const expense = new Expense({ name, category, amount });
        await expense.save();
        res.json({ message: "Expense added!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete expense
router.delete("/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
