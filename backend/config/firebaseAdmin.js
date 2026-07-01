const admin = require("firebase-admin");
const serviceAccount = require("../echo-55b1b-firebase-adminsdk-fbsvc-7ef608f1d9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;