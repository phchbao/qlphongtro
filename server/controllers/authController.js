import OwnerUser from "../models/OwnerUser.js";
import LodgerUser from "../models/LodgerUser.js";
import { BadRequestError, UnAuthorizedError } from "../request-errors/index.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailSender.js";

/**
 * @description Login a user
 * @returns {object} user
 * @returns {string} token
 */
const login = async (req, res) => {
  const { role, email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  if (role === "owner") {
    const owner = await OwnerUser.findOne({ email }).select("+password");
    if (!owner) {
      throw new UnAuthorizedError("Không tìm thấy email!");
    }

    const isMatch = await owner.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Mật khẩu không đúng!");
    }

    // check if account's email is verified
    if (!owner.accountStatus) {
      return res.status(200).json({
        message: "Account not verified",
        email: owner.email,
        accountStatus: owner.accountStatus,
        userType: "owner",
      });
    }

    const accessToken = owner.createAccessToken();
    const refreshToken = owner.createRefreshToken();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry
    });
    owner.password = undefined;
    res.status(200).json({
      owner,
      accessToken,
      userType: "owner",
      accountStatus: owner.accountStatus,
    });
  } else if (role === "lodger") {
    const lodger = await LodgerUser.findOne({ email }).select("+password");
    if (!lodger) {
      throw new UnAuthorizedError("Không tìm thấy email!");
    }
    const isMatch = await lodger.matchPassword(password);
    if (!isMatch) {
      throw new UnAuthorizedError("Mật khẩu không đúng!");
    }

    // check if account's email is verified
    if (!lodger.accountStatus) {
      return res.status(200).json({
        message: "Account not verified",
        email: lodger.email,
        accountStatus: lodger.accountStatus,
        userType: "lodger",
      });
    }

    const accessToken = lodger.createAccessToken();
    const refreshToken = lodger.createRefreshToken();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry
    });
    lodger.password = undefined;
    res.status(200).json({
      lodger,
      accessToken,
      userType: "lodger",
      accountStatus: lodger.accountStatus,
    });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Register a user
 * @returns {object} user
 * @returns {string} token
 */
const register = async (req, res) => {
  const { role, email } = req.body;

  if (role === "owner") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    // add token to req.body
    req.body.accountVerificationToken = verificationToken;

    // create owner
    const owner = await OwnerUser.create(req.body);

    // remove password and token from response object
    owner.password = undefined;
    owner.accountVerificationToken = undefined;

    // send email with token link
    const to = email;
    const from = "do-not-reply@passport.tro-so.com";
    const subject = "Xác nhận tài khoản của bạn";
    const body = `
    <p> Xin chào ${owner.firstName} ${owner.lastName},</p>
    <p>Hãy ấn vào liên kết bên dưới để xác minh tài khoản của bạn</p>
    <a href="${process.env.CLIENT_URL}/#/verify-account/owner/${verificationToken}">Xác minh tài khoản</a>
    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,</p>
    <p>Trọ số</p>
    `;
    await sendEmail(to, from, subject, body);

    res
      .status(201)
      .json({ success: true, userType: "owner", email: owner.email });
  } else if (role === "lodger") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    // add token to req.body
    req.body.accountVerificationToken = verificationToken;

    const lodger = await LodgerUser.create(req.body); // create lodger

    // remove password and token from response object
    lodger.password = undefined;
    lodger.accountVerificationToken = undefined;

    // send email with token link
    const to = email;
    const from = "do-not-reply@passport.tro-so.com";
    const subject = "Xác nhận tài khoản của bạn";
    const body = `
    <p> Xin chào ${lodger.firstName} ${lodger.lastName},</p>
    <p>Hãy ấn vào liên kết bên dưới để xác minh tài khoản của bạn</p>
    <a href="${process.env.CLIENT_URL}/#/verify-account/lodger/${verificationToken}">Xác minh tài khoản</a>
    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,</p>
    <p>Trọ số</p>
    `;
    await sendEmail(to, from, subject, body);

    res
      .status(201)
      .json({ success: true, userType: "lodger", email: lodger.email });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Verify user account
 */
const verifyAccount = (req, res) => {
  const { role, token } = req.body;

  if (!token) {
    throw new BadRequestError("Token not found");
  }
  if (role === "owner") {
    //verify token
    jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Mã không hợp lệ hoặc hết hạn" });
        }
        //find user with token and email
        const user = await OwnerUser.findOne({
          accountVerificationToken: token,
          email: payload.email,
        });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        // update user account status
        user.accountStatus = true;
        user.accountVerificationToken = "";

        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while updating user status" });
          } else {
            return res.json({ msg: "Tài khoản xác minh thành công" });
          }
        });
      }
    );
  } else if (role === "lodger") {
    //verify token
    jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Mã không hợp lệ hoặc hết hạn" });
        }
        //find user with token and email
        const user = await LodgerUser.findOne({
          accountVerificationToken: token,
          email: payload.email,
        });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        // update user account status
        user.accountStatus = true;
        user.accountVerificationToken = "";

        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while updating user status" });
          } else {
            return res.json({ msg: "" });
          }
        });
      }
    );
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Resend the verification email
 */
const resendVerificationEmail = async (req, res) => {
  const { email, role } = req.body;

  if (role === "owner") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    // find user with email
    const owner = await OwnerUser.findOne({ email: email });

    if (!owner) {
      throw new BadRequestError("User not found");
    }

    // update the token in db
    owner.accountVerificationToken = verificationToken;
    await owner.save();

    // send email with token code
    const to = email;
    const from = "do-not-reply@passport.tro-so.com";
    const subject = "Xác nhận tài khoản của bạn";
    const body = `
    <p> Xin chào ${owner.firstName} ${owner.lastName},</p>
    <p>Hãy ấn vào liên kết bên dưới để xác minh tài khoản của bạn</p>
    <a href="${process.env.CLIENT_URL}/#/verify-account/owner/${verificationToken}">Xác minh tài khoản</a>
    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,</p>
    <p>Trọ số</p>
    `;

    // send email with token link
    await sendEmail(to, from, subject, body);

    res
      .status(200)
      .json({ success: true, msg: "Token reset and sent successfully" });
  } else if (role === "lodger") {
    //generate token
    const verificationToken = jwt.sign(
      { email: email },
      process.env.EMAIL_VERIFICATION_KEY,
      {
        expiresIn: "1d",
      }
    );

    const lodger = await LodgerUser.findOne({ email: email });

    if (!lodger) {
      throw new BadRequestError("User not found");
    }

    // update the token in db
    lodger.accountVerificationToken = verificationToken;
    await lodger.save();

    // send email with token code
    const to = email;
    const from = "do-not-reply@passport.tro-so.com";
    const subject = "Xác nhận tài khoản của bạn";
    const body = `
    <p> Xin chào ${lodger.firstName} ${lodger.lastName},</p>
    <p>Hãy ấn vào liên kết bên dưới để xác minh tài khoản của bạn</p>
    <a href="${process.env.CLIENT_URL}/#/verify-account/lodger/${verificationToken}">Xác minh tài khoản</a>
    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,</p>
    <p>Trọ số</p>
    `;
    await sendEmail(to, from, subject, body);

    res
      .status(200)
      .json({ success: true, msg: "Token reset and sent successfully" });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description generate new access token
 * @returns {string} access token
 */
const refreshOwner = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    throw new UnAuthorizedError("Refresh token not found");
  }

  const refreshToken = cookie.jwt;
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_OWNER
    );

    const user = await OwnerUser.findOne({ _id: payload.userId });

    if (!user) {
      throw new UnAuthorizedError("User not found");
    }
    const accessToken = user.createAccessToken();
    res.json({ accessToken });
  } catch (error) {
    throw new UnAuthorizedError("Invalid refresh token");
  }
};

/**
 * @description generate new access token
 * @returns {string} access token
 */
const refreshLodger = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) {
    throw new UnAuthorizedError("Refresh token not found");
  }

  const refreshToken = cookie.jwt;
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_TENANT
    );

    const user = await LodgerUser.findOne({ _id: payload.userId });

    if (!user) {
      throw new UnAuthorizedError("User not found");
    }
    const accessToken = user.createAccessToken();
    res.json({ accessToken });
  } catch (error) {
    throw new UnAuthorizedError("Invalid refresh token");
  }
};

/**
 * @description Forgot Password - send email
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  if (role === "owner") {
    const user = await OwnerUser.findOne({ email }); //check if user exists
    if (!user) {
      throw new BadRequestError("Không tài khoản nào liên kết với email này");
    }

    //generate token
    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "5m",
    });

    // send email with token
    const to = email;
    const from = "do-not-reply@passport.tro-so.com";
    const subject = "Đặt lại mật khẩu";
    const body = `
  <h3>Hãy ấn vào liên kết bên dưới để đặt lại mật khẩu của bạn</h3>
  <a href="${process.env.CLIENT_URL}/#/reset-password/owner/${token}">Reset Password</a>`;

    //update the user and add the token
    user.passwordResetToken = token;
    user.save(async (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error occurred while saving the token in database" });
      } else {
        //if no error
        //send email
        await sendEmail(to, from, subject, body);
        return res.json({ msg: `Yêu cầu đã được xác nhận. Vui lòng kiểm tra email của bạn` });
      }
    });
  } else if (role === "lodger") {
    const user = await LodgerUser.findOne({ email });
    if (!user) {
      throw new BadRequestError("Không tài khoản nào liên kết với email này");
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "5m",
    });

    const to = email;
    const from = "do-not-reply@passport.tro-so.com";
    const subject = "Đặt lại mật khẩu";
    const body = `
  <h3>Hãy ấn vào liên kết bên dưới để đặt lại mật khẩu của bạn</h3>
  <a href="${process.env.CLIENT_URL}/#/reset-password/lodger/${token}">Reset Password</a>`;

    //update the user and add the token
    user.passwordResetToken = token;
    user.save(async (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error occurred while saving the token in database" });
      } else {
        //if no error
        //send email
        await sendEmail(to, from, subject, body);
        return res.json({ msg: `Yêu cầu đã được xác nhận. Vui lòng kiểm tra email của bạn${email}` });
      }
    });
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Reset Password
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const { token, newPassword, passwordRepeated, role } = req.body;
  if (!token) {
    throw new BadRequestError("Token not found");
  }
  if (!newPassword || !passwordRepeated) {
    throw new BadRequestError("Password is required");
  }

  if (newPassword !== passwordRepeated) {
    throw new BadRequestError("Mật khẩu nhập lại không khớp");
  }

  if (role === "owner") {
    //verify token
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Mã không hợp lệ hoặc hết hạn" });
        }
        //find user with token
        const user = await OwnerUser.findOne({ passwordResetToken: token });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        //update password
        user.password = newPassword;
        user.passwordResetToken = "";
        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while resetting password" });
          } else {
            return res.json({ msg: "Thay đổi mật khẩu thành công!" });
          }
        });
      }
    );
  } else if (role === "lodger") {
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_KEY,
      async (error, payload) => {
        if (error) {
          return res.status(400).json({ msg: "Mã không hợp lệ hoặc hết hạn" });
        }
        const user = await LodgerUser.findOne({ passwordResetToken: token });
        if (!user) {
          return res
            .status(400)
            .json({ msg: "User with this token was not found" });
        }

        user.password = newPassword;
        user.passwordResetToken = "";
        user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msg: "Error occurred while resetting password" });
          } else {
            return res.json({ msg: "Thay đổi mật khẩu thành công!" });
          }
        });
      }
    );
  } else {
    throw new BadRequestError("Invalid Role");
  }
};

/**
 * @description Logout a user
 */
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

export {
  login,
  register,
  verifyAccount,
  refreshOwner,
  refreshLodger,
  forgotPassword,
  resetPassword,
  logout,
  resendVerificationEmail,
};
