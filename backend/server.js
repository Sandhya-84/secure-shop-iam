require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const auditRoutes = require("./routes/auditRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();

app.use(cors());

// IMPORTANT: this must come before routes
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/roles", roleRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});