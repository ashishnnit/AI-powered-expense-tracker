import React from "react";
import TransactionList from "../Transactions/TransactionList";
import TransactionChart from "../Transactions/TransactionChart";
import { useNavigate } from "react-router-dom";
import { startChatSessionAPI } from "../../services/gemini/geminiServices";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleChatWithAI = async () => {
    try {
      await startChatSessionAPI(); // Send user's data to Gemini backend
      navigate("/chat"); // Navigate to chatbot
    } catch (err) {
      console.error("Failed to start chat session", err);
    }
  };

  return (
    <div className="relative">
      {/* Chat With AI Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleChatWithAI}
          className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-teal-600"
        >
          Chat with AI
        </button>
      </div>

      {/* Dashboard Content */}
      <TransactionChart />
      <TransactionList />
    </div>
  );
};

export default Dashboard;
