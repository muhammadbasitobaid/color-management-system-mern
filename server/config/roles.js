// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

module.exports = (function () {
    ac.grant("user")
        .createOwn("profile")
        .readOwn("profile")
        .updateOwn("profile")
        .readAny("product")


    ac.grant("admin")
        .extend("user")
        .updateAny("profile")
        .deleteAny("profile")
        .createAny("product")
        .updateAny("product")

    return ac;
})();