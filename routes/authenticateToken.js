const jwt = require("jsonwebtoken");

// 인증이 필요한 경로에 붙여서 사용하는 middleware
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Bearer ${accessToken} 형태로 받아오기 때문에 뒤 토큰만 따로 가져와서 token에 저장
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).send("Access Denied. You need a Token.");

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
