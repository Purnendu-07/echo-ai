const cron = require("node-cron");
const Capsule = require("../models/Capsule");

const evaluateCapsules = async () => {

    console.log("[Evaluator] Checking waiting capsules...");

    try {

        const waitingCapsules = await Capsule.find({
            status: "WAITING"
        });

        const now = new Date();

        for (const capsule of waitingCapsules) {

            if (
                capsule.deliveryCondition &&
                capsule.deliveryCondition.type === "TIME"
            ) {

                const unlockAt =
                    capsule.deliveryCondition.payload?.unlockAt;

                if (!unlockAt) {
                    continue;
                }

                if (now >= new Date(unlockAt)) {

                    capsule.status = "DELIVERED";
                    capsule.deliveredAt = now;

                    await capsule.save();

                    console.log(
                        `[Evaluator] Delivered capsule ${capsule._id}`
                    );

                }

            }

        }

    } catch (err) {

        console.error("[Evaluator] Error:", err);

    }

};

cron.schedule("* * * * *", async () => {

    await evaluateCapsules();

});

module.exports = evaluateCapsules;