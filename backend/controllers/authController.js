const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const userResult = await pool.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.password,
                u.status,
                r.id AS role_id,
                r.name AS role
            FROM users u
            JOIN roles r
                ON u.role_id = r.id
            WHERE u.email = $1
            `,
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = userResult.rows[0];

        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                message: "User account is inactive"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const permissionResult = await pool.query(
            `
            SELECT p.name
            FROM role_permissions rp
            JOIN permissions p
                ON rp.permission_id = p.id
            WHERE rp.role_id = $1
            `,
            [user.role_id]
        );

        const permissions = permissionResult.rows.map(
            (row) => row.name
        );

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    login
};