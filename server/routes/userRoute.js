const express = require("express");
const router = express.Router();
// authentication middleware
const authMiddleware = require("../middleware/authMdiddleware");
// user controllers
const { register, login, checkUser } = require("../controller/userController");

// registration route
//we use post requist to accep the data from user
router.post("/register", register);
router.post("/login", login);

//check user
// get method to retrive the data from the server
router.get("/check", authMiddleware, checkUser);

module.exports = router;
