const user = require("../models/User");

const createUser = async (req, res) => {
  console.log(req);
  const newuser = new user(req.body);
  try {
    await newuser.save();
    res.status(200).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    // Check if the user exists
    const user1 = await user.findOne({ email });
    if (!user1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    if (password != user1.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  const users = await user.find();
  try {
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const delteduser = await user.findByIdAndDelete(id);
    res.status(200).json(delteduser);
  } catch (err) {
    console.log(err);
  }
};
module.exports = { loginUser, createUser, getUsers, deleteUser };
