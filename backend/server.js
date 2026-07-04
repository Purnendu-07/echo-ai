require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();
const capsuleRoutes = require("./routes/capsuleRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

// Start background worker
require("./worker/evaluator");

app.use(cors());
app.use(express.json());
app.use("/api/capsules", capsuleRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Echo Backend Running"
    });
});

app.use("/api/dashboard", require("./routes/dashboardRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});