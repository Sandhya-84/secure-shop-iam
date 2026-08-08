const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const createAuditLog = require("../utils/auditLogger");

const router = express.Router();

router.post(
    "/deploy",
    authenticate,
    authorize("application.deploy"),
    async (req, res) => {

        await createAuditLog({
            userId: req.user.id,
            action: "application.deploy",
            resource: "Application Server",
            result: "ALLOWED",
            details: "Application deployment simulated successfully"
        });

        res.status(200).json({
            message: "Application deployed successfully"
        });
    }
);

router.post(
    "/database/backup",
    authenticate,
    authorize("database.backup"),
    async (req, res) => {

        await createAuditLog({
            userId: req.user.id,
            action: "database.backup",
            resource: "Customer Database",
            result: "ALLOWED",
            details: "Database backup simulated successfully"
        });

        res.status(200).json({
            message: "Database backup created successfully"
        });
    }
);

module.exports = router;