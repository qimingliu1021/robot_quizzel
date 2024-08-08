const express = require("express");
const quizController = require("../controllers/quizController");

const router = express.Router();

router.get("/quizzes", quizController.getAllQuizzes);
router.get("/quizzes/:id", quizController.getQuizDetails);
router.post("/register", quizController.registerUser);
router.post("/mintToken", quizController.mintToken);
router.post("/processAnswers", quizController.processUserAnswers);
router.post("/quizzes", quizController.createQuiz);

module.exports = router;
