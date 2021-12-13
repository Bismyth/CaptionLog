const mongoose = require('mongoose');

const fs = require('fs');
let rawdata1 = fs.readFileSync('./oldData/caption_sources.json');
let captionsources = JSON.parse(rawdata1);
let rawdata2 = fs.readFileSync('./oldData/genres.json');
let genres = JSON.parse(rawdata2);
let rawdata3 = fs.readFileSync('./oldData/video_sources.json');
let videosources = JSON.parse(rawdata3);
let rawdata4 = fs.readFileSync('./oldData/logs.json');
let logs = JSON.parse(rawdata4);

const { OldLog } = require('../models/OldLog');
const Genre = require('../models/Genre');
const CaptionSource = require('../models/CaptionSource');
const VideoSource = require('../models/VideoSource');
const Log = require('../models/Log');

require('dotenv').config();
const uploadConfig = [
    { db: OldLog, items: logs, name: 'Old Logs' },
    { db: CaptionSource, items: captionsources, name: 'Caption Source' },
    { db: VideoSource, items: videosources, name: 'Video Source' },
    { db: Genre, items: genres, name: 'Genres' },
];

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('MongoDB Connected....');
        Log.deleteMany({}, (err) => {
            if (err) return console.error(err);
        });
        uploadConfig.forEach((v) => {
            v.db.deleteMany({}, (err) => {
                if (err) return console.error(err);
                v.db.insertMany(v.items, (err, res) => {
                    if (err) return console.error(err);
                    console.log(`Adding ${v.name} done.`);
                });
            });
        });
    })
    .catch((err) => console.error(err));
