const { Web3 } = require("web3");
require("dotenv").config();
const UserContractABI = require("./UserContract.json").abi;
const QuizTokenABI = require("./QuizToken.json").abi;
const LeaderboardContractABI = require("./LeaderboardContract.json").abi;

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.PROVIDER_URL)
);

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const userContract = new web3.eth.Contract(
  UserContractABI,
  process.env.USER_CONTRACT_ADDRESS
);
const quizToken = new web3.eth.Contract(
  QuizTokenABI,
  process.env.QUIZ_TOKEN_ADDRESS
);
const leaderboardContract = new web3.eth.Contract(
  LeaderboardContractABI,
  process.env.LEADERBOARD_CONTRACT_ADDRESS
);

module.exports = {
  web3,
  userContract,
  quizToken,
  leaderboardContract,
};
