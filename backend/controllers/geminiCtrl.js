const { GoogleGenerativeAI } = require("@google/generative-ai");
const Transaction = require("../model/Transaction");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatContext = null; // Holds the current chat context (in-memory for now)

const geminiController = {
  //! Send full transaction data as context
  sendUserDataToGemini: async (req, res) => {
    try {
      const transactions = await Transaction.find({ user: req.user });
  
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ error: "No transactions found for the user" });
      }
  
      // ✅ Convert array to a valid string and wrap in { text: ... }
      const transactionString = JSON.stringify(transactions, null, 2);
  
      chatContext = await model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: transactionString }], //  Fix: Gemini requires { text: "..." }
          },
        ],
      });
  
      const result = await chatContext.sendMessage("Got the data? if yes then only respond with ' how can i assist you ..' "); // ✅ Initial message to start the chat
      const text = await result.response.text(); // Await this properly
  
      res.json({ message: "Data sent to Gemini", reply: text });
    } catch (error) {
      console.error("Error sending data to Gemini:", error);
      res.status(500).json({ error: "Failed to initialize chat" });
    }
  },

  //! Handle user’s chat prompt
  sendUserChatToGemini: async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!chatContext) {
        return res.status(400).json({ error: "Chat session not initialized" });
      }

      const result = await chatContext.sendMessage(`Give response after analyzing my data and without * and ** ${prompt}`);
      const text = await result.response.text(); // ✅ FIXED

      res.json({ reply: text });
    } catch (error) {
      console.error("Gemini chat error:", error);
      res.status(500).json({ error: "Failed to process chat prompt" });
    }
  },
};

module.exports = geminiController;
