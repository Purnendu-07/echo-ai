const User = require("../models/User");
const usernameRegex = /^[a-zA-Z0-9_]+$/;

const normalizeUsername = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user.username) {
            req.user.username = await User.findByIdAndUpdate(
                req.user._id,
                { username: "" },
                { new: true, runValidators: true }
            ).then((updatedUser) => updatedUser.username);
        }

        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q?.toString().trim();

        if (!query || query.length < 2) {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        const searchRegex = new RegExp(escapeRegex(query), "i");

        const users = await User.find({
            _id: { $ne: req.user._id },
            $or: [
                { username: searchRegex },
                { display_name: searchRegex }
            ]
        })
            .select("_id username display_name photo_url bio")
            .limit(20)
            .lean();

        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to search users"
        });
    }
};

exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            username: {
                $regex: `^${escapeRegex(username)}$`,
                $options: "i"
            }
        })
            .select("username display_name photo_url bio")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const allowedFields = [
            "username",
            "display_name",
            "bio",
            "photo_url"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided"
            });
        }

        if (updates.username !== undefined) {
            const trimmedUsername = normalizeUsername(updates.username);

            if (!trimmedUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username cannot be empty"
                });
            }

            if (!usernameRegex.test(trimmedUsername)) {
                return res.status(400).json({
                    success: false,
                    message: "Username can only contain letters, numbers, and underscores"
                });
            }

            updates.username = trimmedUsername;
        }

        if (updates.bio !== undefined) {
            updates.bio = String(updates.bio);
        }

        if (updates.display_name !== undefined) {
            updates.display_name = String(updates.display_name);
        }

        if (updates.photo_url !== undefined) {
            updates.photo_url = String(updates.photo_url);
        }

        if (updates.username) {
            const existingUser = await User.findOne({
                username: updates.username,
                _id: { $ne: req.user._id }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Username already taken"
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Username already taken"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update user profile"
        });
    }
};
