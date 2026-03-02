const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send({ errors: [{ msg: "not autho !" }] });
    }

    const decoded = jwt.verify(token, process.env.SCRT_KEY);

    const foundUser = await User.findById(decoded.id);
    if (!foundUser) {
      return res.status(401).send({ errors: [{ msg: "not autho 2" }] });
    }

    req.user = foundUser;
    return next(); // ✅ UNE SEULE FOIS
  } catch (error) {
    return res.status(401).send({ errors: [{ msg: "not autho 3" }] });
  }
};

module.exports = isAuth;