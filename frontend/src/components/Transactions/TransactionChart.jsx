import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { listTransactionsAPI } from "../../services/transactions/transactionService";
import { startChatSessionAPI } from "../../services/gemini/geminiServices";

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data: transactions } = useQuery({
    queryFn: listTransactionsAPI,
    queryKey: ["list-transactions"],
  });

  const totals = transactions?.reduce(
    (acc, transaction) => {
      if (transaction?.type === "income") acc.income += transaction.amount;
      else acc.expense += transaction.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [totals?.income, totals?.expense],
        backgroundColor: ["#4f46e5", "#ec4899"],
        borderColor: ["#4f46e5", "#ec4899"],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          boxWidth: 15,
          font: { size: 14, family: "'Inter', sans-serif" },
          color: "#4b5563",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.label}: $${context.raw.toLocaleString()}`,
        },
      },
    },
    cutout: "75%",
  };

  const handleChatWithAI = async () => {
    try {
      setLoading(true);
      await startChatSessionAPI();
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    } catch (err) {
      console.error("Failed to start chat session", err);
    }
  };

  return (
    <div className="relative bg-grey-50 h-[70vh] flex items-center justify-center px-8">
      {/* Overlay when loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700 font-semibold">Redirecting to AI Chat...</p>
        </div>
      )}

      <div className="bg-sky-50 rounded-2xl shadow-lg p-10 flex flex-col lg:flex-row gap-16 w-full max-w-[1400px] h-[70vh]">
        {/* 📊 Chart + Totals */}
        <div className="w-full lg:w-2/3 ml-10 mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Financial Overview
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div style={{ height: "260px", width: "260px" }}>
              <Doughnut data={data} options={options} />
            </div>
            <div className="space-y-5 ml-15">
              <div>
                <h3 className="text-gray-500 text-sm">Total Income</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  ${totals?.income?.toLocaleString() || "0.00"}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Expense</h3>
                <p className="text-2xl font-bold text-pink-500">
                  ${totals?.expense?.toLocaleString() || "0.00"}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-gray-500 text-sm">Net Balance</h3>
                <p
                  className={`text-2xl font-bold ${
                    totals?.income - totals?.expense >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ${(totals?.income - totals?.expense)?.toLocaleString() || "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 🤖 AI Assistant */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center">
          <p className="text-gray-800 text-xl font-semibold mb-2">
            Want deeper insights?
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Chat with our AI assistant to <br />
            analyze your income, expenses <br />
            and get personalized tips.
          </p>
          <button
            onClick={handleChatWithAI}
           className="w-fit bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-teal-600"
            disabled={loading}
          >
            Your Finance Buddy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
