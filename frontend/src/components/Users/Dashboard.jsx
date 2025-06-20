import React from "react";
import TransactionList from "../Transactions/TransactionList";
import TransactionChart from "../Transactions/TransactionChart";

const Dashboard = () => {
  return (
    <div className="relative">
      {/* Dashboard Content */}
      <TransactionChart />
      <TransactionList />
    </div>
  );
};

export default Dashboard;