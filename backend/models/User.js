const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firebase_uid: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        display_name: {
            type: String,
            default: ""
        },

        photo_url: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);