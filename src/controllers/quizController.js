const quizModel = require("../models/quizModel");

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizModel.getQuizzes();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getQuizDetails = async (req, res) => {
  try {
    const quiz = await quizModel.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const questions = await quizModel.getQuestionsByQuizId(quiz.quiz_id);
    for (let question of questions) {
      question.options = await quizModel.getOptionsByQuestionId(
        question.question_id
      );
    }
    res.json({ quiz, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
  const { userAddress, username } = req.body;
  try {
    await quizModel.registerUserOnBlockchain(userAddress, username);
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mintToken = async (req, res) => {
  const { recipient, amount } = req.body;
  try {
    await quizModel.mintQuizToken(recipient, amount);
    res.status(200).json({ message: "Token minted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const processUserAnswers = async (req, res) => {
  const { userAddress, quizId, userAnswers } = req.body;
  try {
    const score = await quizModel.calculateScore(quizId, userAnswers);
    await quizModel.updateLeaderboard(userAddress, quizId, score);
    res.status(200).json({ message: "Answers processed successfully", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createQuiz = async (req, res) => {
  const { title, description, questions } = req.body;
  try {
    const quizId = await quizModel.createQuiz(title, description, questions);
    res.status(200).json({ message: "Quiz created successfully", quizId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizDetails,
  registerUser,
  mintToken,
  processUserAnswers,
  createQuiz,
};
