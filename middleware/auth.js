const UserRoles = require("../models/UserRoles");
const cas = require("../CAS");
const userRoles = require("../models/UserRoles.json");
require("dotenv").config({ path: "../" });

const read = (req, res, next) => {
    if (req.session[cas.session_name]) {
        const groups = req.session.user.memberof.map((v) => {
            return v
                .split(",")
                .filter((r) => {
                    return r.includes("CN");
                })[0]
                .split("=")[1];
        });
        UserRoles.find(
            { $or: [{ doeNumber: req.session.user.cn }, { adGroup: groups }] },
            (err, doc) => {
                if (err) return res.sendStatus(500);
                if (doc.length === 0) req.roles = {};
                else {
                    doc.forEach((v) => {
                        req.roles = { ...req.roles, ...v.roles };
                    });
                }
                next();
            }
        ).lean();
    } else {
        next();
    }
};

const block = (roles) => (req, res, next) => {
    if (!req.session[cas.session_name]) {
        return res.sendStatus(401);
    }
    read(req, res, () => {
        if (req.session.user.cn === process.env.ADMIN || req.roles.admin) return next();
        if (roles && !req.roles[roles]) return res.sendStatus(401);
        next();
    });
};

module.exports = {
    read,
    block,
    roles: userRoles,
};
