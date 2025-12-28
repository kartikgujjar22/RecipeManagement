const express = require("express");
const { register, login, logout } = require("../controller/AuthController");
const { verifyToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}! You are authorized.` });
});

module.exports = router;
