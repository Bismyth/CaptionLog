module.exports = {
    title: {
        exists: true,
        errorMessage: "Missing Title",
        escape: true,
        isLength: { options: { min: 1 } },
    },
    description: {
        exists: { errorMessage: "Missing Description", escape: true },
    },

    "movieInfo.year": {
        isInt: true,
        optional: true,
        errorMessage: "Please Provide Valid Year",
    },
    "movieInfo.rating": { escape: true, optional: true },
    "copyrightInfo.teacherName": { escape: true },
    "copyrightInfo.captionSource": {
        exists: { errorMessage: "Missing Caption Source" },
    },
    "copyrightInfo.dateOfCompletion": {
        exists: true,
        errorMessage: "Missing Date of Completion",
        escape: true,
        isLength: { options: { min: 1 } },
    },
    "copyrightInfo.originalLocation": { escape: true },

    "digitalInfo.*.name": {
        escape: true,
    },
    "digitalInfo.*.length": {
        escape: true,
    },
    "digitalInfo.*.location": {
        optional: true,
    },
    "digitalInfo.*.clickviewUrl": {
        optional: true,
    },

    "physicalInfo.*.name": {
        escape: true,
    },
    "physicalInfo.*.location": {
        escape: true,
    },
    "physicalInfo.*.copiesHeld": {
        isInt: true,
        errorMessage: "Copies Held should be a number",
    },
};
