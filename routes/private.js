const router = require("express").Router();
let User = require("../models/user.model");
let Favorite = require("../models/favorite.model");
// let Like = require("../models/like.model");
const authenticateToken = require("./authenticateToken");
const jwt = require("jsonwebtoken");

// ==============================================
//   Private 루트의 defalut경로 : api/private
// ==============================================

router.get("/", authenticateToken, (req, res) => {
  res.json({ title: "you have a authentication!" });
});

// movie list 검색
router.get("/favorite", authenticateToken, async (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("리스트에러" + err));
});

// ==============================================
//   좋아요를 최초로 눌렀는지, 이미 눌렀는지 확인
// ==============================================
router.post("/favorited", authenticateToken, (req, res) => {
  // Favorite정보를 Favorite 콜렉션의 Movie ID와 userfrom을 통해 찾는다.
  Favorite.find({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, favorited) => {
    if (err) return res.status(400).send("유저에 대한 영화정보없음 " + err);

    // 이미 유저가 favorite리스트에 추가했을경우 확인
    let result = false; // 아직 리스트 추가안함
    if (favorited.length !== 0) {
      //영화 정보에 대한 배열Length가 0이 아닐때 (추가됐을때)
      result = true;
    }
    //favorited값으로 리스트 추가 유무 전송 result=true 일때: 추가됨 false일떄: 추가안됨
    res.status(200).json({ success: true, favorited: result });
  });
});

// ==============================================
//   Favorite 컬렉션에 좋아요 누른 영화 전송
// ==============================================
router.post("/addToFavorite", authenticateToken, (req, res) => {
  // favorite콜렉션에 영화와 유저id 정보를 저장
  const favorite = new Favorite(req.body);

  favorite.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.json({ success: true });
  });
});

// ==============================================
//   Favorite List에서 영화 삭제
// ==============================================
router.post("/removeFromFavorite", authenticateToken, (req, res) => {
  //
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.json({ success: true, doc });
  });
});

// ==============================================
//   Favorite List에서 리스트 띄우기
// ==============================================
router.post("/getFavoriteMovie", authenticateToken, (req, res) => {
  //
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});

// ==============================================
//   좋아요 상태 확인
// ==============================================
router.post("/getLike", authenticateToken, (req, res) => {
  Favorite.find({
    userFrom: req.body.userFrom,
    movieId: req.body.movieId,
  }).exec((err, like) => {
    if (err) return res.status(400).send("좋아요정보 못가져옴" + err);
    let result = false;
    if (like.length !== 0) {
      result = true;
    }
    return res.status(200).json({ success: true, likeData: result });
  });
});
module.exports = router;
