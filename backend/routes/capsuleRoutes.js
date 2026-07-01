const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createCapsule
} = require("../controllers/capsuleController");

router.post("/", auth, createCapsule);

module.exports = router;