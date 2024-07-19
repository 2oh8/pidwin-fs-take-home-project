import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import LedgerEntry from "../models/ledgerEntry.js";
import ledgerEntryTypes from "../enums/ledgerEntryTypes.js";
import reasons from "../utils/transactionReasons.js"

const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password Does Not Match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      {
        _id: result._id,
        name: result.name,
        email: result.email,
        password: result.hashedPassword,
      },
      "test",
      { expiresIn: "1h" }
    );

    // Initial registration credit of 100 tokens
    LedgerEntry.create({userId: result._id, type: ledgerEntryTypes.credit, amount: 100, reason: reasons.FUNDS_GIFTED})

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export default signup;