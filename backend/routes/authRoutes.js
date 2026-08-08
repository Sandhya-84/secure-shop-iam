const express = require("express");

const {
    login
} = require("../controllers/authController");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
    res.status(200).json({
        message: "Protected route accessed",
        user: req.user
    });
});

module.exports = router;