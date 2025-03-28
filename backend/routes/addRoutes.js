const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google Authentication Route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback Route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: true }),
    (req, res) => {
        // Handle successful login
        res.redirect("/dashboard"); // Redirect to frontend dashboard
    }
);

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect("/"); // Redirect to home after logout
        });
    });
});

module.exports = router;
