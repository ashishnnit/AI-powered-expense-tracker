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
        return res
          .status(404)
          .json({ error: "No transactions found for the user" });
      }

      //  Convert array to a valid string and wrap in { text: ... }
      const transactionString = JSON.stringify(transactions, null, 2);

      chatContext = await model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: transactionString }], //  Fix: Gemini requires { text: "..." }
          },
        ],
      });

      const result = await chatContext.sendMessage(
        "Got the data? if yes then only respond with ' how can i assist you ..' "
      ); // ✅ Initial message to start the chat
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

      const result = await chatContext.sendMessage(
        `Give response after analyzing my data and without * and ** ${prompt}`
      );
      const text = await result.response.text(); //  FIXED

      res.json({ reply: text });
    } catch (error) {
      console.error("Gemini chat error:", error);
      res.status(500).json({ error: "Failed to process chat prompt" });
    }
  },

  //! Extract category type and name from user input
  extractCategoryFromVoice: async (req, res) => {
    try {
      const { input } = req.body;

      if (!input) {
        return res.status(400).json({ error: "Input is required" });
      }

      const tempChat = await model.startChat({
        history: [],
      });

      const prompt = `
You will be given a user command like "Add shopping as expense" or "Add salary as income".
Extract the type and name from it in JSON format like:
{ "type": "expense", "name": "shopping" }

Command: ${input}
Only respond with JSON.
    `;

      const result = await tempChat.sendMessage(prompt);
      const text = await result.response.text();

      // Try parsing the response to ensure it's valid JSON
      let json;
      try {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);
        json = JSON.parse(jsonString);
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Failed to extract category details", raw: text });
      }
      res.json({ category: json });
    } catch (error) {
      console.error("Error extracting category:", error);
      res
        .status(500)
        .json({ error: "Something went wrong while processing the input" });
    }
  },

  //! Extract transaction details from voice input
  extractTransactionFromVoice: async (req, res) => {
    try {
      const { input } = req.body;
      if (!input) return res.status(400).json({ error: "Input is required" });
  
      const formatDate = (d) => d.toISOString().slice(0, 10);
      const todayDate = new Date();
      const today = formatDate(todayDate);
      const yesterday = formatDate(new Date(todayDate.getTime() - 86400000));
      const tomorrow = formatDate(new Date(todayDate.getTime() + 86400000));
  
      const replaceRelativeDates = (text) => {
        return text.replace(/(\d+)\s+days?\s+(ago|before|after|later)/gi, (_, num, dir) => {
          const date = new Date(todayDate);
          date.setDate(date.getDate() + (["after", "later"].includes(dir.toLowerCase()) ? +num : -num));
          return `on ${formatDate(date)}`;
        });
      };
  
      const processedInput = replaceRelativeDates(input);
  
      const prompt = `
  You will receive a user's voice input related to a financial transaction.
  
  Extract and return this JSON:
  {
    "type": "income" or "expense",
    "amount": 1234,
    "category": "shopping",
    "date": "yyyy-mm-dd",
    "description": "short summary"
  }
  
  Rules:
  - Convert all dates to "yyyy-mm-dd" format.
  - "today" → "${today}", "yesterday" → "${yesterday}", "tomorrow" → "${tomorrow}"
  - "X days ago/before" → minus X days from today
  - "X days after/later" → add X days to today
  - Always return valid JSON only.
  
  Input: ${processedInput}
  `;
  
      const tempChat = await model.startChat({ history: [] });
      const result = await tempChat.sendMessage(prompt);
      const text = await result.response.text();
  
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      const json = JSON.parse(text.slice(jsonStart, jsonEnd));
  
      res.json({ transaction: json });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong", detail: error.message });
    }
  },
  
};

module.exports = geminiController;
