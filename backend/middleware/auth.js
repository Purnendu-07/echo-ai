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

        /*
            First login?
            Automatically create MongoDB user
        */

        if (!user) {

            user = await User.create({

                firebase_uid: decoded.uid,

                email: decoded.email,

                display_name: decoded.name || "",

                photo_url: decoded.picture || ""

            });

        }

        req.user = user;

        next();

    } catch (err) {

        console.error(err);

        return res.status(401).json({
            message: "Invalid Token"
        });

    }
};

module.exports = auth;