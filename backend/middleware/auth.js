const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = await admin.auth().verifyIdToken(token);

        let user = await User.findOne({
            firebase_uid: decoded.uid
        });

        // First login -> create MongoDB user
        if (!user) {
            const fallbackEmail = decoded.email || `${decoded.uid}@echo.local`;

            user = await User.create({
                firebase_uid: decoded.uid,
                email: fallbackEmail,
                display_name: decoded.name || "",
                photo_url: decoded.picture || ""
            });
        }

        req.user = user;

        next();

    } catch (err) {

        console.error("=========== AUTH ERROR ===========");
        console.error(err);
        console.error("Code:", err.code);
        console.error("Message:", err.message);
        console.error("=================================");

        return res.status(401).json({
            message: err.message || "Invalid Token"
        });
    }
};

module.exports = auth;