const bcrypt = require("bcrypt");
const { getUserByUsername } = require("../db/users");
const axios = require("axios");


async function authenticateUser(username, password) {
    const user = await getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }
}