const pool = require("./db");
const {
  userContract,
  quizToken,
  leaderboardContract,
  web3,
} = require("./web3");

const getQuizQuestions = async (quizId) => {
  const result = await pool.query(
    "SELECT * FROM questions WHERE quiz_id = $1",
    [quizId]
  );
  return result.rows;
};

const getQuestionOptions = async (questionId) => {
  const result = await pool.query(
    "SELECT * FROM options WHERE question_id = $1",
    [questionId]
  );
  return result.rows;
};

const calculateScore = async (quizId, userAnswers) => {
  let score = 0;
  const questions = await getQuizQuestions(quizId);
  for (const question of questions) {
    const options = await getQuestionOptions(question.question_id);
    const correctOption = options.find((option) => option.is_correct);
    if (userAnswers[question.question_id] == correctOption.option_id) {
      score += 1; // Adjust scoring logic as needed
    }
  }
  return score;
};

const registerUserOnBlockchain = async (userAddress, username) => {
  await userContract.methods
    .registerUser(userAddress, username)
    .send({ from: web3.eth.defaultAccount });
};

const updateLeaderboard = async (userAddress, quizId, score) => {
  await leaderboardContract.methods
    .updateScore(userAddress, quizId, score)
    .send({ from: web3.eth.defaultAccount });
};

const createQuiz = async (title, description, questions) => {
  const result = await pool.query(
    "INSERT INTO quizzes (title, description) VALUES ($1, $2) RETURNING quiz_id",
    [title, description]
  );
  const quizId = result.rows[0].quiz_id;

  for (const question of questions) {
    const questionResult = await pool.query(
      "INSERT INTO questions (quiz_id, question_text) VALUES ($1, $2) RETURNING question_id",
      [quizId, question.question_text]
    );
    const questionId = questionResult.rows[0].question_id;

    for (const option of question.options) {
      await pool.query(
        "INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)",
        [questionId, option.option_text, option.is_correct]
      );
    }
  }

  return quizId;
};

module.exports = {
  getQuizQuestions,
  getQuestionOptions,
  calculateScore,
  registerUserOnBlockchain,
  updateLeaderboard,
  createQuiz,
};
