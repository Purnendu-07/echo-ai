const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createCapsule,
    getMyCapsules,
    getCapsuleById,
    deleteCapsule
} = require("../controllers/capsuleController");

router.post("/create", auth, createCapsule);

router.get("/my", auth, getMyCapsules);

router.get("/:id", auth, getCapsuleById);

router.delete("/:id", auth, deleteCapsule);

module.exports = router;
