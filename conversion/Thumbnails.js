const mongoose = require('mongoose');
require('dotenv').config();
const Log = require('../models/Log');
const path = require('path');
const genThumbnail = require('simple-thumbnail');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const ffmpegStatic = require('ffmpeg-static');
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

var magic = '5facf369a7ae8d16e0742fec';

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(async () => {
        const ids = (await Log.find({}).select('_id').lean()).map((v) => v._id);
        await asyncForEach(ids.slice(0, 50), async (v) => {
            var data = await Log.findById(v).lean();
            console.log(data.title);
            await asyncForEach(data.digitalInfo, async (v) => {
                if (v.location) {
                    var videoInfo;
                    try {
                        videoInfo = await ffprobe(path.join(process.env.MEDIA_ROOT, v.location), {
                            path: ffprobeStatic.path,
                        });
                    } catch (e) {
                        console.error(e);
                    }
                    var randomTime = new Date(videoInfo.streams[0].duration * (Math.random() * 100))
                        .toISOString()
                        .substr(11, 8);
                    console.log(randomTime);
                    try {
                        await genThumbnail(
                            path.join(process.env.MEDIA_ROOT, v.location),
                            path.join(
                                //process.env.MEDIA_ROOT,
                                '/home/ben/Documents/Coding/Captioning Browser/Test Data',
                                `/Thumbnails/m-${data._id + v._id}.jpg`
                            ),
                            '250x?',
                            {
                                seek: randomTime,
                                path: ffmpegStatic.path,
                            }
                        );
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        });
        console.log('Done');
    })
    .catch((err) => console.error(err));
