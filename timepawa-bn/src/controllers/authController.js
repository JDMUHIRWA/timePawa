import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });
    console.log("New User", newUser);
    await newUser.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "error registering the user", message: error });
  }
};
export const login = async (req, res) => {
  console.log("Authenticated User", req.user);
  res.status(200).json({
    message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};
export const authstatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User is logged in",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
};
export const logout = async (req, res) => {
  if (!req.user) res.status(401).json({ message: "Unauthorized user" });
  req.logout((err) => {
    if (err) {
      res.status(400).json({ message: "User not logged in" });
    } else {
      res.status(200).json({ message: "User logged out successfully" });
    }
  });
};
export const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    var secret = speakeasy.generateSecret({ length: 10 });

    // Only store the secret, do not set isMfaActive yet
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = false; // Explicitly keep it false
    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "timePawa",
      encoding: "base32",
    });
    const qrImageUrl = await qrcode.toDataURL(url);

    res.status(200).json({
      qrcode: qrImageUrl,
      secret: secret.base32,
      isMfaSetupInProgress: true, // Add a flag to indicate setup is in progress
    });
  } catch (error) {
    res.status(500).json({ error: "Error setting up 2fa", message: error });
  }
};

export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (verified) {
    // Only set isMfaActive to true when verification is successful
    user.isMfaActive = true;
    await user.save();

    const jwtToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "2FA verified",
      token: jwtToken,
      isMfaActive: true,
    });
  } else {
    res.status(400).json({ message: "Invalid 2FA token" });
  }
};
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.isMfaActive = false;
    user.twoFactorSecret = "";
    await user.save();
    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting 2fa", message: error });
  }
};
