const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { getAuditLogs } = require("../controllers/auditController");

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("audit.view"),
    getAuditLogs
);

module.exports = router;