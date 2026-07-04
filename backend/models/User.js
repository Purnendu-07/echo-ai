const mongoose = require("mongoose");

const usernameRegex = /^[a-zA-Z0-9_]+$/;

async function generateUsername(email, uid, currentUserId = null) {
    const User = mongoose.model("User");

    const base =
        (email || uid || "user")
            .split("@")[0]
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase()
            .slice(0, 20) || "user";

    let username = base;
    let count = 1;

    while (true) {
        const exists = await User.findOne({
            username,
            _id: { $ne: currentUserId }
        });

        if (!exists) return username;

        username = `${base}${count++}`;
    }
}

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

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },

        display_name: {
            type: String,
            default: ""
        },

        bio: {
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

/*
|--------------------------------------------------------------------------
| Generate username BEFORE validation
|--------------------------------------------------------------------------
*/

userSchema.pre("validate", async function (next) {
    try {
        if (!this.username || this.username.trim() === "") {
            this.username = await generateUsername(
                this.email,
                this.firebase_uid,
                this._id
            );
        }

        this.username = this.username.trim();

        if (!usernameRegex.test(this.username)) {
            return next(
                new Error(
                    "Username may contain only letters, numbers and underscores."
                )
            );
        }

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("User", userSchema);