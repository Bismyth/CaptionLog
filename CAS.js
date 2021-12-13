const CASAuthentication = require('node-cas-authentication');
require('dotenv').config();

var casConfig = {
    cas_url: process.env.CAS_URL,
    service_url: process.env.HOMEPAGE,
    return_to: process.env.HOMEPAGE,
    session_info: 'user',
};
if (process.env.CAS_DEV === 'true') {
    console.log('CAS IS IN DEV MODE');
    const user = require(process.env.CAS_DEV_USER);
    casConfig = {
        ...casConfig,
        is_dev_mode: true,
        dev_mode_user: user.cn,
        dev_mode_info: user,
    };
}

module.exports = new CASAuthentication(casConfig);
