const express = require("express");
const app = express();
require("./config/db")
const cors=require('cors')
const bodyparser = require("body-parser");
require('dotenv');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  cors()
);

const userData = require("./Routes/userData.js");
const challengeData = require("./Routes/challengeData");
const ActiveChallengeRouter = require("./Routes/ActivechallengeRouter.js")


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userData); 
app.use("/api/challenges", challengeData); 
app.use("/ActiveChallenge" ,ActiveChallengeRouter );


// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




