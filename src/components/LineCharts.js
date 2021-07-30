import React, { useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { years, filterEvolutionOfProductInRegion } from "../utils";

Chart.register(...registerables);

const LineCharts = () => {
  const product = "Soja";
  const type = "Residuo Seco";
  const regionId = 8;
  const data = filterEvolutionOfProductInRegion(product, type, regionId);

  useEffect(() => {
    const ctx = document.getElementById("myChart").getContext("2d");
    const config = {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: regionId + "",
            data: data,
            borderColor: "blue",
          },
        ],
      },
      options: {
        parsing: {
          xAxisKey: "year",
          yAxisKey: "amount",
        },
        scales: {
          y: {
            type: "logarithmic",
            title: {
              display: true,
              text: type + " (T)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Año",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "" + type + " de " + product + " de " + regionId,
          },
        },
      },
    };
    const myChart = new Chart(ctx, config);
  }, [data]);
  return <canvas id="myChart" width={1000} height={700} />;
};

export default LineCharts;
