function triggerParser(rawInput) {

    const input = rawInput.toLowerCase();

    // Very basic V1 detection

    if (
        input.includes("today") ||
        input.includes("tomorrow") ||
        input.includes("am") ||
        input.includes("pm") ||
        /\d{4}/.test(input)
    ) {

        return {

            type: "TIME",

            provider: "SYSTEM",

            payload: {}

        };

    }

    return {

        type: "PUBLIC_EVENT",

        provider: "OPENAI",

        payload: {}

    };

}

module.exports = triggerParser;