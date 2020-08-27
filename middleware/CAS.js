const CASAuthentication = require("node-cas-authentication");

const cas = new CASAuthentication({
    cas_url: "https://sso.shenton.wa.edu.au/cas",
    service_url: "https://dec.shenton.wa.edu.au/caption-dev",
    return_to: "https://dec.shenton.wa.edu.au/caption-dev",
    session_info: "user",
});

module.exports = cas;
