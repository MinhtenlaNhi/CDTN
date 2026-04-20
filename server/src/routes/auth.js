const express = require("express");
const bcrypt = require("bcryptjs");
const GoogleAccount = require("../models/GoogleAccount");
const EmailRegistration = require("../models/EmailRegistration");
const { isDbReady } = require("../db");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim();
}

function dbUnavailable(res) {
  return res.status(503).json({
    success: false,
    message: "Cơ sở dữ liệu chưa sẵn sàng. Cấu hình MONGODB_URI trên server."
  });
}

/** Kiểm tra email có thể dùng để đăng ký form hay không */
router.post("/check-email", async (req, res) => {
  if (!isDbReady()) return dbUnavailable(res);
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({ success: false, message: "Thiếu email." });
    }
    const [g, r] = await Promise.all([
      GoogleAccount.findOne({ email }),
      EmailRegistration.findOne({ email })
    ]);
    if (g) {
      return res.json({
        success: true,
        allowed: false,
        reason: "google_exists",
        message:
          "Email này đã được dùng với tài khoản Google. Vui lòng đăng nhập bằng Google hoặc dùng email khác."
      });
    }
    if (r) {
      return res.json({
        success: true,
        allowed: false,
        reason: "already_registered",
        message: "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác."
      });
    }
    return res.json({ success: true, allowed: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

/** Đăng nhập bằng email + mật khẩu (tài khoản đã đăng ký qua form) */
router.post("/login", async (req, res) => {
  if (!isDbReady()) return dbUnavailable(res);
  try {
    const { email, password } = req.body || {};
    const em = normalizeEmail(email);
    if (!em || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu." });
    }
    const user = await EmailRegistration.findOne({ email: em });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng. Nếu bạn đăng ký bằng Google, hãy dùng \"Đăng nhập với Google\"."
      });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng."
      });
    }
    return res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        accountRole: user.role
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

/** Đăng ký bằng email + mật khẩu */
router.post("/register", async (req, res) => {
  if (!isDbReady()) return dbUnavailable(res);
  try {
    const { email, name, password, role } = req.body || {};
    const em = normalizeEmail(email);
    const nameTrim = String(name || "").trim();
    if (!em || !nameTrim || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đủ thông tin." });
    }
    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ success: false, message: "Vai trò không hợp lệ." });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu cần ít nhất 6 ký tự." });
    }

    const existsG = await GoogleAccount.findOne({ email: em });
    if (existsG) {
      return res.status(409).json({
        success: false,
        code: "GOOGLE_EMAIL",
        message:
          "Email này trùng với tài khoản đã từng đăng nhập Google. Vui lòng đăng nhập bằng Google hoặc chọn email khác."
      });
    }
    const existsR = await EmailRegistration.findOne({ email: em });
    if (existsR) {
      return res.status(409).json({
        success: false,
        code: "REGISTERED",
        message: "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await EmailRegistration.create({
      email: em,
      name: nameTrim,
      passwordHash,
      role
    });
    return res.json({ success: true, message: "Đăng ký thành công." });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(409).json({ success: false, message: "Email đã tồn tại." });
    }
    return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

/** Ghi nhận / cập nhật tài khoản đăng nhập Google */
router.post("/google-sync", async (req, res) => {
  if (!isDbReady()) return dbUnavailable(res);
  try {
    const { email, name, picture } = req.body || {};
    const em = normalizeEmail(email);
    if (!em) {
      return res.status(400).json({ success: false, message: "Thiếu email." });
    }
    const local = await EmailRegistration.findOne({ email: em });
    if (local) {
      return res.status(409).json({
        success: false,
        code: "LOCAL_EMAIL_EXISTS",
        message:
          "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu."
      });
    }
    await GoogleAccount.findOneAndUpdate(
      { email: em },
      { $set: { name: String(name || "").trim(), picture: String(picture || "").trim() } },
      { upsert: true, new: true }
    );
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

module.exports = router;
