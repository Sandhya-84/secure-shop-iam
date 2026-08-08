const pool = require("../config/db");

const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const result = await pool.query(
                `
                SELECT p.name
                FROM users u
                JOIN roles r
                    ON u.role_id = r.id
                JOIN role_permissions rp
                    ON r.id = rp.role_id
                JOIN permissions p
                    ON rp.permission_id = p.id
                WHERE u.id = $1
                  AND p.name = $2
                `,
                [userId, requiredPermission]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({
                    message: "Access denied",
                    requiredPermission
                });
            }

            next();

        } catch (error) {
            console.error("Authorization error:", error);

            return res.status(500).json({
                message: "Authorization check failed"
            });
        }
    };
};

module.exports = authorize;