const mongoose = require("mongoose");

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

const fs = require("fs");
let rawdata = fs.readFileSync("./oldData/logs.json");
let logs = JSON.parse(rawdata);

const { OldLog } = require("../models/OldLog");

require("dotenv").config();
const uploadConfig = [{ db: OldLog, items: logs, name: "Old Logs", filter: "title" }];

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("MongoDB Connected....");
        uploadConfig.forEach(({ db, items, name, filter }) => {
            asyncForEach(items, async (v) => {
                await db.updateOne({ [filter]: v[filter] }, v);
            })
                .then(() => {
                    console.log(`${name} is done.`);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    })
    .catch((err) => console.error(err));
