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


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/add-user", userData); 


// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


