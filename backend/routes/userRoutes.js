const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
    getUsers,
    createUser,
    changeUserRole,
    changeUserStatus
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("user.view"),
    getUsers
);

router.post(
    "/",
    authenticate,
    authorize("user.create"),
    createUser
);

router.patch(
    "/:id/role",
    authenticate,
    authorize("role.assign"),
    changeUserRole
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("role.assign"),
    changeUserStatus
);

module.exports = router;