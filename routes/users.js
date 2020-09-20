const router = require("express").Router();
let User = require("../models/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authenticateToken");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

// ==========================================
//        등록유저 찾기
//===========================================
router.get("/", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ====================================
//             유저등록
//=====================================
router.post("/add", async (req, res) => {
  //유저 생성 전 Validation @hapi/joi
  const { error } = registerValidation(req.body);
  //유저 등록 할 때 Validation조건 만족 안할시 에러메세지 보냄
  if (error) return res.status(400).send(error.details[0].message);

  // username이 DB에 존재하는지 체크
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("username already exists.");
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // 새로운 유저 생성
  console.log("========= api =========");
  console.log(req.body);
  const username = req.body.username;
  const password = hashedPassword;

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    res.send("User added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// ==========================
//          로그인
//===========================
router.post("/login", async (req, res) => {
  //로그인 전 Validation @hapi/joi
  const { error } = loginValidation(req.body);
  //로그인 할 때 Validation조건 만족 안할시 에러메세지 보냄
  if (error) return res.status(400).send(error.details[0].message);
  // username이 DB에 없으면 에러메세지 보냄
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username is not found.");
  // 비밀번호 검사
  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd) return res.status(400).send("Invalid Password.");
  // userId 따로 빼서 생성 =========== 수정중
  const userId = await user._id;
  if (!userId) return res.status(400).send("UserId is not found.");

  // accessToken 생성
  const accessToken = generateAccessToken({ _id: user._id });
  // refreshToken 생성
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
  // 발급된 refreshToken을 refreshTokens 배열에 담는다
  refreshTokens.push(refreshToken);
  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
    userId: userId,
  });
});

// ==========================================
//    refreshToken을 통해 accessToken 갱신
//===========================================
// refreshToken을 담을 배열 선언
let refreshTokens = [];
router.post("/token", (req, res) => {
  // client쪽에서 token이라는 변수로 refreshToken을 전달
  const refreshToken = req.body.token;
  if (refreshToken == null)
    return res.status(401).send("refreshToken is not exists.");
  if (!refreshTokens.includes(refreshToken))
    return res
      .status(403)
      .send("refreshToken is not put into the refreshTokens arrangement.");
  // verify를 통해 refreshToken의 권한 확인
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token!");
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  });
});
// ================== refreshToken을 통해 accessToken 갱신 끝 ==================

router.get("/secret", authenticateToken, (req, res) => {
  res.json("You have a authenticatation!");
});

// ====================================
//             로그아웃
//=====================================
router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.send("Logged out!");
});

// ============id 통한 유저 검색, 삭제, 업데이트================
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/update/:id", (req, res) => {
  User.findById(req.params.id).then((user) => {
    user.username = req.body.username;
    user.password = req.body.password;

    user
      .save()
      .then(() => res.json("User updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});
// ============id 통한 유저 검색, 삭제, 업데이트 끝================

module.exports = router;
