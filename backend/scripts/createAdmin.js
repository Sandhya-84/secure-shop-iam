require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function createAdmin() {
    try {
        const name = "Admin User";
        const email = "admin@secureshop.com";
        const password = "Admin@123";

        const roleResult = await pool.query(
            "SELECT id FROM roles WHERE name = $1",
            ["ADMIN"]
        );

        if (roleResult.rows.length === 0) {
            console.log("ADMIN role not found");
            process.exit();
        }

        const roleId = roleResult.rows[0].id;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            console.log("Admin user already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
            (name, email, password, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role_id`,
            [name, email, hashedPassword, roleId]
        );

        console.log("Admin created successfully:");
        console.log(result.rows[0]);

        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createAdmin();