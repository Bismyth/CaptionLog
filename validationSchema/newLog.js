module.exports = {
    title: {
        exists: true,
        errorMessage: "Missing Title",
        isLength: { options: { min: 1 } },
    },
    description: {
        exists: { errorMessage: "Missing Description" },
    },

    "movieInfo.year": {
        isInt: true,
        optional: true,
        errorMessage: "Please Provide Valid Year",
    },
    "movieInfo.rating": { optional: true },
    "copyrightInfo.captionSource": {
        exists: true,
        errorMessage: "Missing Caption Source",
        isLength: { options: { min: 1 } },
    },
    "copyrightInfo.dateOfCompletion": {
        exists: true,
        errorMessage: "Missing Date of Completion",
        escape: true,
        isLength: { options: { min: 1 } },
    },
    "physicalInfo.*.copiesHeld": {
        isInt: true,
        errorMessage: "Copies Held should be a number",
    },
};
