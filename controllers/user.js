const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { firstname, name, email, password } = req.body;

    // check email exist
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).send({ errors: [{ msg: "email déja exist" }] });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user once (no duplicate)
    const newUser = new User({
      firstname,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // token
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.SCRT_KEY,
      { expiresIn: "48h" }
    );

    return res.status(200).send({
      success: [{ msg: "Inscription avec success" }],
      user: newUser,
      token,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ errors: [{ msg: "Try again" }] });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).send({
        errors: [{ msg: "email introuvable" }],
      });
    }

    const checkPassword = await bcrypt.compare(password, foundUser.password);
    if (!checkPassword) {
      return res.status(400).send({
        errors: [{ msg: "email password incorrect" }],
      });
    }

    const token = jwt.sign(
      { id: foundUser._id, isAdmin: foundUser.isAdmin },
      process.env.SCRT_KEY,
      { expiresIn: "48h" }
    );

    return res.status(200).send({
      success: [{ msg: "connexion avec success .. " }],
      user: foundUser,
      token,
      isAdmin: foundUser.isAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: [{ msg: "server error" }] });
  }
};