const triggerParser = require("../utils/triggerParser");
const Capsule = require("../models/Capsule");

exports.createCapsule = async (req, res) => {

    try {

        const {
            audience,
            recipients,
            content,
            deliveryCondition,
            revealContext
        } = req.body;

        // Parse the trigger
        const parsedTrigger = triggerParser(
            deliveryCondition.rawInput
        );

        const capsule = await Capsule.create({

            owner: req.user._id,

            audience,

            recipients,

            content,

            deliveryCondition: {

                rawInput: deliveryCondition.rawInput,

                type: parsedTrigger.type,

                provider: parsedTrigger.provider,

                payload: parsedTrigger.payload

            },

            revealContext,

            status: "WAITING"

        });

        res.status(201).json({

            success: true,

            message: "Capsule created successfully",

            capsule

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Failed to create capsule"

        });

    }

};

exports.getMyCapsules = async (req, res) => {

    try {

        const capsules = await Capsule.find({

            owner: req.user._id

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            capsules

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Failed to fetch capsules"

        });

    }

};

exports.getCapsuleById = async (req, res) => {

    res.status(200).json({

        success: true,

        message: "getCapsuleById placeholder"

    });

};

exports.deleteCapsule = async (req, res) => {

    res.status(200).json({

        success: true,

        message: "deleteCapsule placeholder"

    });

};