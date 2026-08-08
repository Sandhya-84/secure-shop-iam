const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                a.id,
                u.name AS user_name,
                u.email,
                r.name AS role,
                a.action,
                a.resource,
                a.result,
                a.details,
                a.created_at
            FROM audit_logs a
            LEFT JOIN users u
                ON a.user_id = u.id
            LEFT JOIN roles r
                ON u.role_id = r.id
            ORDER BY a.created_at DESC
        `);

        return res.status(200).json({
            count: result.rows.length,
            logs: result.rows
        });

    } catch (error) {
        console.error("Audit logs error:", error);

        return res.status(500).json({
            message: "Unable to fetch audit logs"
        });
    }
};

module.exports = {
    getAuditLogs
};