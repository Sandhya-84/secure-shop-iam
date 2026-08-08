const pool = require("../config/db");

const createAuditLog = async ({
    userId,
    action,
    resource,
    result,
    details
}) => {
    try {
        await pool.query(
            `
            INSERT INTO audit_logs
            (user_id, action, resource, result, details)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                userId,
                action,
                resource,
                result,
                details || null
            ]
        );
    } catch (error) {
        console.error("Audit log error:", error);
    }
};

module.exports = createAuditLog;