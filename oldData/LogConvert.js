const mongoose = require("mongoose");
require("dotenv").config();
const Log = require("../models/Log");
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(async () => {
        console.log("MongoDB Connected....");
        const ids = (await Log.find({}).select("_id").lean()).map((v) => v._id);
        await asyncForEach(ids, async (v, i) => {
            var data = await Log.findById(v);
            var isPrivate = false;
            var change = false;
            if (data.digitalInfo.length > 0) {
                isPrivate = data.digitalInfo[0].isPrivate;
                data.digitalInfo.forEach((x) => {
                    if (!!isPrivate !== !!x.isPrivate) {
                        change = true;
                    }
                });
            }
            if (!change) {
                data.isPrivate = !!isPrivate;
                data.digitalInfo.map((x) => {
                    return { ...x, isPrivate: undefined };
                });
            }
            if (data.movieInfo) {
                data = {
                    ...data,
                    rating: data.movieInfo.rating || "",
                    year: data.movieInfo.year || "",
                };
                data.movieInfo = undefined;
            } else {
                data = {
                    ...data,
                    rating: "",
                    year: "",
                };
            }
            if (data.copyrightInfo) {
                data = {
                    ...data,
                    teacherName: data.copyrightInfo.teacherName,
                    captionSource: data.copyrightInfo.captionSource,
                    videoSource: data.copyrightInfo.videoSource,
                    dateOfCompletion: data.copyrightInfo.dateOfCompletion,
                    originalLocation: data.copyrightInfo.originalLocation,
                };
                data.copyrightInfo = undefined;
            }
            data.physicalInfo = undefined;
            await Log.findByIdAndUpdate(v, data, { strict: false, overwrite: true });
        });
        console.log("Done.");
    })
    .catch((err) => console.error(err));

/*
Old Converstion
(Inside the async)
var data = await Log.findById(v).lean();
var digiNew = data.digitalInfo.map((v) => {
    if (v.clickviewUrl !== undefined) {
        return {
            ...v,
            externalLink: v.clickviewUrl,
        };
    }
    return v;
});

await Log.findByIdAndUpdate(v, { digitalInfo: digiNew });
*/
