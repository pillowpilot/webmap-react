import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Chart, registerables } from "chart.js";
import {
  years,
  regionsNames,
  regionDataFromName,
  filterEvolutionOfProductInRegion,
  products,
} from "../utils";
import ListSelector from "./ListSelector";

Chart.register(...registerables);

const LineCharts = () => {
  const canvasId = "myChart";
  let myChart = null;
  const defaultProductName = products[0];
  const [product, setProduct] = useState(defaultProductName);
  const defaultRegionName = regionsNames[0];
  const [region, setRegion] = useState(defaultRegionName);

  const type = "Residuo Seco";
  const regionId = regionDataFromName(region).id;
  const data = filterEvolutionOfProductInRegion(product, type, regionId);
  const onRegionUpdate = (newRegion) => {
    myChart.destroy();
    setRegion(newRegion);
  };
  const onProductUpdate = (newProduct) => {
    myChart.destroy();
    setProduct(newProduct);
  };

  useEffect(() => {
    const ctx = document.getElementById(canvasId).getContext("2d");
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
            display: false,
            text: type + " de " + product + " en " + region,
          },
        },
      },
    };
    myChart = new Chart(ctx, config);
  });

  const regionSelector = (
    <ListSelector
      options={regionsNames}
      value={region}
      setValue={onRegionUpdate}
    />
  );
  const productSelector = (
    <ListSelector
      options={products}
      value={product}
      setValue={onProductUpdate}
    />
  );
  const selectors = (
    <>
      {regionSelector}
      {productSelector}
    </>
  );
  const cardHeaderTitle =
    "Evolución de " + type + " de " + product + " en " + region;
  return (
    <Card>
      <CardHeader title={cardHeaderTitle} action={selectors}></CardHeader>
      <CardContent>
        <canvas id={canvasId} width={500} height={300} />
      </CardContent>
    </Card>
  );
};

export default LineCharts;
