// const { StatusCodes } = require("http-status-codes");
// const connection = require("../db/dbConfig");

// async function createQuestion(req, res) {
//   const { title, description } = req.body;
//   const { consumerid } = req.user;
//   try {
//     // Insert the question into the database
//     await connection.execute(
//       "INSERT INTO questions (consumerid, title, description) VALUES (?, ?, ?)",
//       [consumerid, title, description]
//     );

//     return res
//       .status(StatusCodes.CREATED)
//       .json({
//         msg: "Question posted successfully",
//         questionId: insertedQuestionId,
//       });
//   } catch (error) {
//     console.error(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later" });
//   }
// }



// module.exports = { createQuestion };



// const { StatusCodes } = require("http-status-codes");
// const connection = require("../db/dbConfig");

// async function createQuestion(req, res) {
//   const { title, description } = req.body;
//   const { consumerid } = req.user;

//   try {
//     // Insert the question into the database
//     const [result] = await connection.execute(
//       "INSERT INTO questions (consumerid, title, description) VALUES (?, ?, ?)",
//       [consumerid, title, description]
//     );

//     // Get the auto-generated questionId from the inserted row
//     const insertedQuestionId = result.insertId;

//     return res.status(StatusCodes.CREATED).json({
//       msg: "Question posted successfully",
//       questionId: insertedQuestionId,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later" });
//   }
// }

// module.exports = { createQuestion };




const { StatusCodes } = require("http-status-codes");
const connection = require("../db/dbConfig");

async function createQuestion(req, res) {
  const { title, description } = req.body;
  const { consumerid } = req.user;

  try {
    // Insert the question into the database
    const [result] = await connection.execute(
      "INSERT INTO questions (consumerid, title, description) VALUES (?, ?, ?)",
      [consumerid, title, description]
    );

    // Get the auto-generated questionId from the inserted row
    const insertedQuestionId = result.insertId;

    return res.status(StatusCodes.CREATED).json({
      msg: "Question posted successfully",
      questionId: insertedQuestionId,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

async function getQuestionById(req, res) {
  const { questionId } = req.params;

  try {
    // Fetch the question from the database based on questionId
    const [result] = await connection.execute(
      "SELECT * FROM questions WHERE questionId = ?",
      [questionId]
    );

    // Check if the question exists
    if (result.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found", questionData: null });
    }

    // Get the question data
    const questionData = result[0];

    return res.status(StatusCodes.OK).json({ questionData });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}


module.exports = { createQuestion, getQuestionById };