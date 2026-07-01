const Capsule = require("../models/Capsule");

exports.createCapsule = async (req, res) => {

    try {

        const {
            recipient_email,
            message_payload,
            trigger
        } = req.body;

        const capsule = await Capsule.create({

            sender_id: req.user._id,

            recipient_email,

            message_payload,

            trigger,

            status: "locked"

        });

        res.status(201).json(capsule);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to create capsule"
        });

    }

};