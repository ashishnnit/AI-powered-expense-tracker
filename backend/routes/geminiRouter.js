const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const {
  sendUserDataToGemini,
  sendUserChatToGemini,
} = require("../controllers/geminiCtrl");

// Send user data initially
router.post("/api/v1/gemini/start", isAuthenticated, sendUserDataToGemini);

// Handle follow-up chat
router.post("/api/v1/gemini/chat", isAuthenticated, sendUserChatToGemini);

module.exports = router;
