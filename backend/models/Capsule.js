const mongoose = require("mongoose");

const triggerSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["time", "api"],
            required: true
        },

        unlock_date: {
            type: Date
        },

        api_endpoint: {
            type: String
        },

        target_value: {
            type: mongoose.Schema.Types.Mixed
        },

        condition_operator: {
            type: String,
            enum: [
                "equals",
                "greater_than",
                "less_than",
                "contains"
            ]
        }
    },
    {
        _id: false
    }
);

const capsuleSchema = new mongoose.Schema(
    {
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        recipient_email: {
            type: String,
            required: true
        },

        message_payload: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "locked",
                "unlocked",
                "delivered"
            ],
            default: "locked"
        },

        trigger: {
            type: triggerSchema,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Capsule", capsuleSchema);