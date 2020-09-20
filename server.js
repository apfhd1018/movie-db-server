const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json()); // bodyParser

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true, // 문자열 구문 분석기
  useCreateIndex: true, //createIndex 메소드 호출
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Import Route
const usersRouter = require("./routes/users");
const privateRouter = require("./routes/private");
const likeRouter = require("./routes/like");

app.use("/api/users", usersRouter);
app.use("/api/private", privateRouter);
app.use("/api/like", likeRouter);

// listen 메소드가 실행될 때 첫번째 인자로 리스닝 성공하면 뒤 코드 실행
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
