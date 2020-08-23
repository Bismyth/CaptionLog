import { useState, useEffect } from "react";

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

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
};
