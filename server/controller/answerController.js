const { StatusCodes } = require("http-status-codes");
const connection = require("../db/dbConfig");

async function getAllAnswers(req, res) {
  const { questionId } = req.query; 

  try {
    if (!questionId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide a questionId to fetch answers" });
    }

    // Fetch answers for the specified questionId, ordered by answer ID in descending order
    const [answers] = await connection.query(
      "SELECT * FROM answers WHERE questionid = ? ORDER BY answerid DESC",
      [questionId]
    );

    res.status(StatusCodes.OK).json(answers);
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong while fetching answers" });
  }
}


async function postAnswer(req, res) {
  const { answer } = req.body;
  const { consumerid } = req.user; // Extract consumerid from the authenticated user
  const { questionId } = req.params; // Extract questionId from URL parameters
//  console.log(
//    "Received POST request to /api/answers/allanswer/post/:questionId"
//  );
//  console.log("Question ID:", req.params.questionId);
  if (!answer || !consumerid || !questionId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields for the answer" });
  }

  try {
    // Save the answer to the database
    await connection.execute(
      "INSERT INTO answers (answer, consumerid, questionid) VALUES (?, ?, ?)",
      [answer, consumerid, questionId]
    );
    // Log success message
    // console.log("Answer posted successfully");
    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong while posting the answer" });
  }
}

module.exports = { getAllAnswers, postAnswer };


