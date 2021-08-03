import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Chart, registerables } from "chart.js";
import {
  years,
  regions,
  regionsNames,
  products,
  filterAmountsOfProductsInYear,
} from "../utils";
import ListSelector from "./ListSelector";

Chart.register(...registerables);

const YearChart = () => {
  const canvasId = "myChart2";
  let myChart = null;
  const defaultProductName = products[0];
  const [product, setProduct] = useState(defaultProductName);
  const defaultYear = years[0];
  const [year, setYear] = useState(defaultYear);

  const type = "Residuo Seco";
  const data = filterAmountsOfProductsInYear(product, type, year);

  const onYearUpdate = (n) => {
    myChart.destroy();
    setYear(n);
  };
  const onProductUpdate = (newProduct) => {
    myChart.destroy();
    setProduct(newProduct);
  };

  useEffect(() => {
    const ctx = document.getElementById(canvasId).getContext("2d");
    const config = {
      type: "doughnut",
      data: {
        labels: regionsNames,
        datasets: [
          {
            label: "lll",
            data: data.map((d) => d.amount),
          },
        ],
      },
    };
    myChart = new Chart(ctx, config);
  });

  const yearSelector = (
    <ListSelector options={years} value={year} setValue={onYearUpdate} />
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
      {yearSelector}
      {productSelector}
    </>
  );
  const cardHeaderTitle =
    "Proporciones de " + type + " de " + product + " durante " + year;
  return (
    <Card>
      <CardHeader title={cardHeaderTitle} action={selectors}></CardHeader>
      <CardContent>
        <canvas id={canvasId} width={300} height={300} />
      </CardContent>
    </Card>
  );
};

export default YearChart;
