const cron = require("node-cron");
const axios = require("axios");

const Capsule = require("../models/Capsule");

/*
    Helper Function
*/

const evaluateCondition = (currentValue, targetValue, operator) => {

    switch (operator) {

        case "equals":
            return currentValue == targetValue;

        case "greater_than":
            return Number(currentValue) > Number(targetValue);

        case "less_than":
            return Number(currentValue) < Number(targetValue);

        case "contains":
            return String(currentValue).includes(String(targetValue));

        default:
            return false;
    }
};

/*
    Main Worker
*/

const evaluateCapsules = async () => {

    console.log("Running Capsule Evaluator...");

    try {

        const lockedCapsules = await Capsule.find({
            status: "locked"
        });

        for (const capsule of lockedCapsules) {

            const trigger = capsule.trigger;

            /*
                Time Trigger
            */

            if (trigger.type === "time") {

                if (new Date() >= new Date(trigger.unlock_date)) {

                    capsule.status = "unlocked";

                    await capsule.save();

                    console.log(`Unlocked Time Capsule: ${capsule._id}`);
                }

                continue;
            }

            /*
                API Trigger
            */

            if (trigger.type === "api") {

                try {

                    const response = await axios.get(
                        trigger.api_endpoint
                    );

                    /*
                        Dummy Example:

                        response.data.value

                        Replace with the correct field
                        depending on your API.
                    */

                    const apiValue = response.data.value;

                    const matched = evaluateCondition(
                        apiValue,
                        trigger.target_value,
                        trigger.condition_operator
                    );

                    if (matched) {

                        capsule.status = "unlocked";

                        await capsule.save();

                        console.log(`Unlocked API Capsule: ${capsule._id}`);
                    }

                }

                catch (err) {

                    console.error(
                        `API Error for Capsule ${capsule._id}:`,
                        err.message
                    );

                }

            }

        }

    }

    catch (err) {

        console.error("Evaluator Error:", err);

    }

};

/*
    Every Hour
*/

cron.schedule("0 * * * *", () => {

    evaluateCapsules();

});

module.exports = evaluateCapsules;