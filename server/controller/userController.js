// console.log(process.env.JWT_SECRET);

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
// controller, this control the connecion between the veiw/ usr and the model/database

//  database connection

const connection = require("../db/dbConfig");

// Register
async function register(req, res) {
  // console.log("Request Body:", req.body);

  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [user] = await connection.query(
      "SELECT username, consumerid FROM consumers WHERE username = ? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already existed" });
    }
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }
    // encrypt  the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.execute(
      "INSERT INTO consumers (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

// //with email verfications
// async function register(req, res) {
//   const { username, firstname, lastname, email, password } = req.body;

//   if (!username || !firstname || !lastname || !email || !password) {
//     return res.status(400).json({ msg: "Please provide all required fields" });
//   }

//   try {
//     // Check if the user or email already exists
//     const [user] = await connection.query(
//       "SELECT username, consumerid FROM consumers WHERE username = ? or email=?",
//       [username, email]
//     );

//     if (user.length > 0) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     if (password.length <= 8) {
//       return res
//         .status(400)
//         .json({ msg: "Password must be at least 8 characters" });
//     }

//     // Generate a unique verification token
//     const verificationToken = crypto.randomBytes(20).toString("hex");

//     // Save the verification token in the database
//     await connection.execute(
//       "INSERT INTO verification_tokens (email, token) VALUES (?, ?)",
//       [email, verificationToken]
//     );

//     // Send verification email with the user's email
//     const verificationLink = `http://localhost:4000/verify/${verificationToken}`;
//     await sendVerificationEmail(email, verificationLink);

//     // Insert the user into the database (without verifying yet)
//    await connection.execute(
//   'INSERT INTO consumers (username, firstname, lastname, email, password, verified) VALUES (?, ?, ?, ?, ?, false)',
//   [username, firstname, lastname, email, password]
// );

//     return res.status(201).json({
//       msg: "User registered. Check your email for verification instructions.",
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ msg: "Something went wrong, try again later" });
//   }
// }

// login funciton

async function login(req, res) {
  const { email, password } = req.body;
   if (!email && !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter both email and password" });
  } else if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter your email" });
  } else if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter your password" });
  }
  try {
    const [user] = await connection.query(
      "SELECT username, consumerid, password FROM consumers WHERE email = ?",
      [email]
    );
    // return res.json({user:user})
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Incorrect email " });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Incorrect password" });
    }
    const username = user[0].username;
    const consumerid = user[0].consumerid;
    const token = jwt.sign({ username, consumerid }, 'p27rnyhNO92AOGr8Qc7BJKwThg9ME9fE59h26', {
      expiresIn: "1day",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "login successful", token, username });
    // return res.json({ user: user[0].password }); // check if returns the password
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}
// check the user to login
async function checkUser(req, res) {
  // const username = req.user.username;
  // const consumerid = req.user.consumerid;
  const { username, consumerid } = req.user;

  res.status(StatusCodes.OK).json({ msg: "valid user", username, consumerid });
}




module.exports = { register, login, checkUser };
