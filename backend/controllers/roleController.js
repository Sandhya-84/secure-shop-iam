const pool = require("../config/db");

// GET ALL ROLES
const getRoles = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, description
            FROM roles
            ORDER BY id
        `);

        return res.status(200).json({
            roles: result.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to fetch roles"
        });
    }
};


// GET ALL PERMISSIONS
const getPermissions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                resource,
                action,
                description
            FROM permissions
            ORDER BY resource, action
        `);

        return res.status(200).json({
            permissions: result.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to fetch permissions"
        });
    }
};


// GET PERMISSIONS FOR ONE ROLE
const getRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;

        const roleResult = await pool.query(
            `
            SELECT id, name, description
            FROM roles
            WHERE id = $1
            `,
            [id]
        );

        if (roleResult.rows.length === 0) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        const permissionResult = await pool.query(
            `
            SELECT
                p.id,
                p.name,
                p.resource,
                p.action,
                p.description
            FROM role_permissions rp
            JOIN permissions p
                ON rp.permission_id = p.id
            WHERE rp.role_id = $1
            ORDER BY p.resource, p.action
            `,
            [id]
        );

        return res.status(200).json({
            role: roleResult.rows[0],
            permissions: permissionResult.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to fetch role permissions"
        });
    }
};


// GET COMPLETE PERMISSION MATRIX
const getPermissionMatrix = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.id AS role_id,
                r.name AS role,
                p.id AS permission_id,
                p.name AS permission,
                p.resource,
                p.action
            FROM roles r
            LEFT JOIN role_permissions rp
                ON r.id = rp.role_id
            LEFT JOIN permissions p
                ON rp.permission_id = p.id
            ORDER BY r.id, p.resource, p.action
        `);

        const matrix = {};

        for (const row of result.rows) {
            if (!matrix[row.role]) {
                matrix[row.role] = [];
            }

            if (row.permission) {
                matrix[row.role].push(row.permission);
            }
        }

        return res.status(200).json({
            matrix
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to fetch permission matrix"
        });
    }
};

module.exports = {
    getRoles,
    getPermissions,
    getRolePermissions,
    getPermissionMatrix
};