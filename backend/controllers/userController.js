const pool = require("../config/db");
const bcrypt = require("bcrypt");

// GET ALL USERS
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.status,
                r.name AS role,
                u.created_at
            FROM users u
            JOIN roles r
                ON u.role_id = r.id
            ORDER BY u.id
        `);

        res.status(200).json({
            count: result.rows.length,
            users: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch users"
        });
    }
};


// CREATE USER
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const roleResult = await pool.query(
            "SELECT id FROM roles WHERE name = $1",
            [role.toUpperCase()]
        );

        if (roleResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users
            (name, email, password, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, status, created_at
            `,
            [
                name,
                email,
                hashedPassword,
                roleResult.rows[0].id
            ]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to create user"
        });
    }
};


// CHANGE ROLE
const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const roleResult = await pool.query(
            "SELECT id FROM roles WHERE name = $1",
            [role.toUpperCase()]
        );

        if (roleResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET role_id = $1
            WHERE id = $2
            RETURNING id, name, email, role_id
            `,
            [
                roleResult.rows[0].id,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Role updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to update role"
        });
    }
};


// CHANGE STATUS
const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["ACTIVE", "INACTIVE"];

        if (!allowedStatuses.includes(status?.toUpperCase())) {
            return res.status(400).json({
                message: "Status must be ACTIVE or INACTIVE"
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET status = $1
            WHERE id = $2
            RETURNING id, name, email, status
            `,
            [
                status.toUpperCase(),
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User status updated",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to update status"
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    changeUserRole,
    changeUserStatus
};