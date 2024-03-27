const mysql2 = require("mysql2");
const connection = mysql2.createPool({
  // socketPath: process.env.SOCKET_PATH,
  user: 'u498923693_Ashe',
  database:'u498923693_Evangadiforum',
  host: 'srv1101.hstgr.io',
  password: '9P._EF$-KPhVnE%',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// console.log(process.env.JWT_SECRET);
// connection.execute("SELECT 'test'", (err, result) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err.message);
//   } else {
//     console.log(result);
//   }
// });

module.exports=connection.promise();
