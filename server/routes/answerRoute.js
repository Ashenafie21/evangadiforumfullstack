const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMdiddleware");
const answerController = require("../controller/answerController");

router.get("/allanswer", answerController.getAllAnswers);
router.post("/post/:questionId", authMiddleware, answerController.postAnswer);




module.exports = router;
