import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const BudgetChart = ({ expenses, budget }) => {
  const categories = [...new Set(expenses.map((exp) => exp.category))];

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categories.map((cat) => expenses.filter((exp) => exp.category === cat).reduce((sum, e) => sum + e.amount, 0)),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Budget",
        data: categories.map((cat) => budget[cat] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return <Bar data={data} />;
};

export default BudgetChart;
