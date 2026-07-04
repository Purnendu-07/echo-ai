const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getCurrentUser,
    updateCurrentUser,
    searchUsers,
    getUserByUsername
} = require("../controllers/userController");

router.get("/search", auth, searchUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:username", auth, getUserByUsername);
router.put("/me", auth, updateCurrentUser);

module.exports = router;
