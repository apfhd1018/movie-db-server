const router = require("express").Router();
let Like = require("../models/like.model");
const authenticateToken = require("./authenticateToken");
const jwt = require("jsonwebtoken");

// default경로 /api/like
// ==============================================
//   좋아요 상태 유지
// ==============================================
router.post("/", authenticateToken, (req, res) => {
  let userCondition = { movieId: req.body.movieId };

  Like.find(userCondition).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

// ==============================================
//   좋아요 처음 눌렀을 때 갯수 올리기
// ==============================================
router.post("/upLike", authenticateToken, (req, res) => {
  let userCondition = { movieId: req.body.movieId, userId: req.body.userId };

  //Like 컬렉션에 클릭 정보 넣음
  const like = new Like({ userCondition });

  like.save((err, likeResult) => {
    if (err) return res.json({ success: false }, err);
    res.status(200).json({ success: true });
  });
});
// 좋아요 누른상태일때 취소하기
router.post("/unLike", authenticateToken, (req, res) => {
  let userCondition = { movieId: req.body.movieId, userId: req.body.userId };

  Like.findByIdAndDelete(userCondition).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
