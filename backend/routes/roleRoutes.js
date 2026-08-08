const express = require("express");

const authenticate = require("../middleware/authenticate");

const {
    getRoles,
    getPermissions,
    getRolePermissions,
    getPermissionMatrix
} = require("../controllers/roleController");

const router = express.Router();

router.get(
    "/",
    authenticate,
    getRoles
);

router.get(
    "/permissions",
    authenticate,
    getPermissions
);

router.get(
    "/matrix",
    authenticate,
    getPermissionMatrix
);

router.get(
    "/:id/permissions",
    authenticate,
    getRolePermissions
);

module.exports = router;