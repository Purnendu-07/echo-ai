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

        const capsule = await Capsule.create({

           owner: req.user._id,

            audience,

            recipients,

            content,

            deliveryCondition,

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
