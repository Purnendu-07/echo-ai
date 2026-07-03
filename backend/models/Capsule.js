const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["TEXT", "IMAGE", "AUDIO", "VIDEO", "DOCUMENT", "MIXED"],
        },
        text: String,
    },
    { _id: false }
);

const deliveryConditionSchema = new mongoose.Schema(
    {
        rawInput: String,
        type: String,
        provider: String,
        payload: mongoose.Schema.Types.Mixed,
        lastCheckedAt: Date,
    },
    { _id: false }
);

const revealContextSchema = new mongoose.Schema(
    {
        showCreatedAt: Boolean,
        showLocation: Boolean,
    },
    { _id: false }
);

const capsuleSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        audience: {
            type: String,
            enum: ["PRIVATE", "DIRECT", "PUBLIC"],
            required: true,
        },

        recipients: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            default: [],
        },

        content: contentSchema,

        media: {
            type: Array,
            default: [],
        },

        deliveryCondition: deliveryConditionSchema,

        status: {
            type: String,
            enum: ["DRAFT", "WAITING", "DELIVERED", "ARCHIVED"],
            default: "WAITING",
        },

        revealContext: revealContextSchema,

        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Capsule", capsuleSchema);
