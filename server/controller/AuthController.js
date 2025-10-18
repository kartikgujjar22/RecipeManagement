const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../model/user");
const { httpLogger, logger } = require("../middleware/logger");
//validation schema
const validation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  const { error } = validation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    logger.info(`Registration attempt started for email: ${email}`);

    //here we are checking existing user
    const checkExistingUser = await User.findOne({ email });
    if (checkExistingUser) {
      logger.warn(`Registration failed: Email already registered (${email})`);
      return res.status(409).json({ message: "Email already Registered." });
    }

    //here we hashed password for password encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating new user here
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    logger.info(`New user registered successfully: ${email}`);

    //here we are creating jwt token for the new user
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    logger.info(`JWT token generated for: ${email} is ${token}`);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    res
      .status(400)
      .json({ message: "Server error during registration process." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "enter correct password" });
    }

    //generate the jwt token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    //set the cookee in the httponly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax", // "none" if frontend and backend have different domains and HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successfull",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error " });
  }
};

module.exports = { register, login };
