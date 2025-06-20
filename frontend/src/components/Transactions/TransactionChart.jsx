import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { listTransactionsAPI } from "../../services/transactions/transactionService";

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = () => {
  const { data: transactions, isError, isLoading } = useQuery({
    queryFn: listTransactionsAPI,
    queryKey: ["list-transactions"],
  });

  const totals = transactions?.reduce(
    (acc, transaction) => {
      if (transaction?.type === "income") {
        acc.income += transaction?.amount;
      } else {
        acc.expense += transaction?.amount;
      }
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
          padding: 25,
          boxWidth: 15,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
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
        displayColors: true,
        boxPadding: 5,
        callbacks: {
          label: function(context) {
            return `${context.label}: $${context.raw.toLocaleString()}`;
          }
        }
      },
    },
    cutout: "75%",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
            <span className="text-sm text-gray-600">Expense</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2" style={{ height: "300px" }}>
          <Doughnut data={data} options={options} />
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Income</h3>
            <p className="text-2xl font-bold text-indigo-600">${totals?.income?.toLocaleString() || '0.00'}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-pink-500">${totals?.expense?.toLocaleString() || '0.00'}</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Net Balance</h3>
            <p className={`text-2xl font-bold ${
              totals?.income - totals?.expense >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              ${(totals?.income - totals?.expense)?.toLocaleString() || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;