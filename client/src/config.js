export const classHeading = "d-flex align-items-center mb-2";
export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
export const keepLikeValues = (object1, object2) => {
    return Object.fromEntries(
        Object.entries(object1).filter((v) => {
            return Object.keys(object2).includes(v[0]);
        })
    );
};
