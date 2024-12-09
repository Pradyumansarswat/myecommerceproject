import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeGraph = ({ userDates, sellerDates, productDates }) => {
  const processData = (dates) => {
    const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
    const monthCounts = Array(12).fill(0);
    let total = 0;
    sortedDates.forEach((date) => {
      const month = new Date(date).getMonth();
      total += 1;
      monthCounts[month] = total;
    });
    return monthCounts;
  };

  const userMonths = processData(userDates);
  const sellerMonths = processData(sellerDates);
  const productMonths = processData(productDates);

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: "Users",
        data: userMonths,
        borderColor: "#0D92F4",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Sellers",
        data: sellerMonths,
        borderColor: "#C40C0C",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: "Products",
        data: productMonths,
        borderColor: "#EF5A6F",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
    ],
  };

  const maxValue = Math.max(...userMonths, ...sellerMonths, ...productMonths);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Cumulative Growth Over Time",
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(50, maxValue),
        title: {
          display: true,
          text: "Total Number",
          padding: 0,
          font: {
            size: 12,
          },
        },
        ticks: {
          font: {
            size: 8,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
          font: {
            size: 10,
          },
        },
        ticks: {
          font: {
            size: 8,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <section className="w-full ">
      <div className="h-[350px]  sm:w-full sm:h-[400px] md:h-[500px]">
        <Line data={data}  options={options} />
      </div>
    </section>
  );
};

export default HomeGraph;
