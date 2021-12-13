const ip = require('ip');
const cas = require('../CAS');
require('dotenv').config();

const local = (req, res, next) => {
    if (
        process.env.SUBNET.split(',').some((v) => {
            return ip.cidrSubnet(v).contains(req.clientIp);
        }) ||
        ip.isLoopback(req.clientIp) ||
        req.session[cas.session_name]
    ) {
        next();
    } else {
        res.status(401).json({ msg: 'You must be on local network' });
    }
};
module.exports = local;
