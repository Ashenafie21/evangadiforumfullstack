// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMdiddleware");
// const questionController = require("../controller/questionController");

// router.get("/all", questionController.getAllQuestions);
// router.post("/post", authMiddleware, questionController.postQuestion);

// module.exports = router;
// questionRoute.js










const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMdiddleware");
const {
  createQuestion,
  getQuestionById, // Add this import
} = require("../controller/questionController");

// Handle POST request to create a question
router.post("/allquestions", authMiddleware, createQuestion);

// Handle GET request to get a specific question by ID
router.get("/:questionId", authMiddleware, getQuestionById);

module.exports = router;

