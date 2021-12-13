module.exports = {
    title: {
        exists: true,
        errorMessage: 'Missing Title',
        isLength: { options: { min: 1 } },
    },
    description: {
        exists: { errorMessage: 'Missing Description' },
    },

    year: {
        isInt: true,
        optional: true,
        errorMessage: 'Please Provide Valid Year',
    },
    rating: { optional: true },
    captionSource: {
        optional: true,
        errorMessage: 'Missing Caption Source',
        isLength: { options: { min: 1 } },
    },
    dateOfCompletion: {
        optional: true,
        errorMessage: 'Missing Date of Completion',
        escape: true,
        isLength: { options: { min: 1 } },
    },
};
