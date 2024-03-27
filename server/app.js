require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  // origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const port = 5500;
//  connection

const connection = require("./db/dbConfig");

// user,question and answer routes middleware file
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
// authentication middleware file
const authMiddleware = require("./middleware/authMdiddleware");
// json middleware to extract json data
app.use(express.json());
// user route middleware
app.use("/api/consumers/", userRoutes);

//quesiton route middleware
app.use("/api/questions", authMiddleware, questionRoutes);
//answer route middleware
app.use("/api/answers", authMiddleware, answerRoutes);

async function start() {
  try {
    const result = await connection.execute("select 'test' ");
    await app.listen(port);
    console.log("database connection established");
    console.log(`listing on port: ${port}`);
  } catch (err) {
    console.log(err.message);
  }
}
start();
