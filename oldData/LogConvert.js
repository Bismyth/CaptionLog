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
    })
    .then(async () => {
        console.log("MongoDB Connected....");
        const ids = (await Log.find({}).select("_id").lean()).map((v) => v._id);
        await asyncForEach(ids, async (v, i) => {
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
            if (digiNew[0].externalLink) {
                console.log(digiNew);
            }

            await Log.findByIdAndUpdate(v, { digitalInfo: digiNew });
        });
        console.log("Done.");
    })
    .catch((err) => console.error(err));
