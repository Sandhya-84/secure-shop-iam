require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function createUsers() {
    try {
        const users = [
            {
                name: "Developer User",
                email: "developer@secureshop.com",
                password: "Developer@123",
                role: "DEVELOPER"
            },
            {
                name: "DBA User",
                email: "dba@secureshop.com",
                password: "Dba@123",
                role: "DBA"
            },
            {
                name: "Auditor User",
                email: "auditor@secureshop.com",
                password: "Auditor@123",
                role: "AUDITOR"
            }
        ];

        for (const user of users) {
            const roleResult = await pool.query(
                "SELECT id FROM roles WHERE name = $1",
                [user.role]
            );

            if (roleResult.rows.length === 0) {
                console.log(`Role ${user.role} not found`);
                continue;
            }

            const existingUser = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                [user.email]
            );

            if (existingUser.rows.length > 0) {
                console.log(`${user.email} already exists`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(
                user.password,
                10
            );

            await pool.query(
                `
                INSERT INTO users
                (name, email, password, role_id)
                VALUES ($1, $2, $3, $4)
                `,
                [
                    user.name,
                    user.email,
                    hashedPassword,
                    roleResult.rows[0].id
                ]
            );

            console.log(`${user.role} user created`);
        }

        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createUsers();