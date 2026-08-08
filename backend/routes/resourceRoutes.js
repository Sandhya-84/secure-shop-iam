const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post(
    "/deploy",
    authenticate,
    authorize("application.deploy"),
    (req, res) => {
        res.status(200).json({
            message: "Application deployed successfully"
        });
    }
);

router.post(
    "/database/backup",
    authenticate,
    authorize("database.backup"),
    (req, res) => {
        res.status(200).json({
            message: "Database backup created successfully"
        });
    }
);

module.exports = router;