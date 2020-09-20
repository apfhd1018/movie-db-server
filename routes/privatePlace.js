const router = require("express").Router();
const verifyToken = require("./verifyToken");

router.get("/", verifyToken, (req, res) => {
  res.json({ post: { title: "private place" } });
});
module.exports = router;
