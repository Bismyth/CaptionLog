const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

//Initalise environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

//Body Parser Middleware
app.use(express.json());

//Get Ip from request
app.use((req, res, next) => {
    req.clientIp =
        (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    next();
});

//Connect to Server
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB Connected....'))
    .catch((err) => console.error(err));

//Setup Express Sessions
app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: false,
        user: null,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            secret: process.env.SESSIONSECRET,
        }),
    })
);

//CAS SETUP
const cas = require('./CAS');
app.get('/login', cas.bounce_redirect);
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500);
        res.json({ msg: 'Logout OK' });
    });
});

//Initialise Routes
//app.use("/api/users", require("./routes/users"));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/video', require('./routes/video'));

//Serve static react in production
if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.use('/assets', express.static(path.join(__dirname, 'assets')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/build/index.html'));
    });
}

//Listen in on port and print what port
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server started on port: ${app.get('port')}`);
});
