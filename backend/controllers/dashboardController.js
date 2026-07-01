const Capsule = require("../models/Capsule");

exports.getDashboard = async (req, res) => {

    try {

        const sentCapsules = await Capsule.find({

            sender_id: req.user._id

        }).sort({

            createdAt: -1

        });

        const receivedCapsules = await Capsule.find({

            recipient_email: req.user.email

        }).sort({

            createdAt: -1

        });

        res.json({

            sent: sentCapsules,

            received: receivedCapsules

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Unable to fetch dashboard"

        });

    }

};