const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ip = require("ip");

const app = express();

//Initalise environment variables
require("dotenv").config({ path: path.join(__dirname, ".env") });

//Body Parser Middleware
app.use(express.json());

//Connect to Server
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected...."))
    .catch((err) => console.error(err));

//Initialise Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/lists", require("./routes/lists"));
app.use("/api/video", require("./routes/video"));

app.get("/api/ipTest", (req, res) => {
    if (ip.isPrivate(req.ip)) {
        res.send(`local, your ip is ${req.ip}`);
    } else {
        res.send(`not local, your ip is: ${req.ip}`);
    }
});

//Serve static react in production
if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
    app.use("/assets", express.static(path.join(__dirname, "assets")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
}

//Listen in on port and print what port
app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), () => {
    console.log(`Server started on port: ${app.get("port")}`);
});
