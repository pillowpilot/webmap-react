import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as d3 from "d3";
import "./App.css";
import "./leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import geodata from "./data/py_states.json";
import L from "leaflet";
import {
  createTheme,
  ThemeProvider,
  Box,
  makeStyles,
  Typography,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Divider,
  MenuItem,
} from "@material-ui/core";

import Navbar from "./components/Navbar";
import LineCharts from "./components/LineCharts";
import {
  filterData,
  filterEvolutionOfProductInRegion,
  products,
  years,
  regions,
} from "./utils";
import "@fontsource/roboto";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
  },
  title: {
    flexGrow: 1,
  },
  content: {
    display: "flex",
    flexFlow: "row",
    flexGrow: "1",
  },
  vizualization: {
    flexGrow: "3",
  },
  mapSidebar: {
    minWidth: 150,
    padding: "10px",
    flexGrow: "1",
  },
}));

const generateMapping = (minValue, maxValue) => {
  let map = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range(["brown", "steelblue"]);
  return map;
};

const D3Layer = ({ product, type, year }) => {
  const map = useMap(); // useMap has to be called from a Component

  /*
   * Add an SVG into Leaflet's overlay pane and paths for every geodata.feature,
   * however without any d data or filling.
   */
  if (d3.select("#mysvg").empty()) {
    d3.select(map.getPanes().overlayPane).append("svg").attr("id", "mysvg");
  }
  d3.select("#mysvg")
    .attr("overflow", "visible")
    .selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path");

  const data = filterData(product, type, year);
  const amounts = data.map((entry) => entry.amount);
  const minAmount = Math.min.apply(null, amounts);
  const maxAmount = Math.max.apply(null, amounts);
  const mapping = generateMapping(minAmount, maxAmount);
  const extractRegionEntry = (regionCode) =>
    data.filter((entry) => entry.administrative_region === regionCode)[0];

  // update fillings
  d3.select("#mysvg")
    .selectAll("path")
    .attr("fill", (geoFeature) => {
      const regionCode = Number(geoFeature.properties.ADM1_PCODE.substr(2));
      const regionName = geoFeature.properties.ADM1_ES;
      const regionEntry = extractRegionEntry(regionCode);
      if (regionEntry) {
        const color = mapping(regionEntry.amount);
        return color;
      } else {
        return "black";
      }
    });

  // update paths
  function projectPoint(x, y) {
    const point = map.latLngToLayerPoint(L.latLng(y, x));
    this.stream.point(point.x, point.y);
  }
  const projection = d3.geoTransform({
    point: projectPoint,
  });
  const path = d3.geoPath().projection(projection);
  const updatePaths = () => {
    d3.select("#mysvg").selectAll("path").attr("d", path);
  };

  updatePaths();
  map.on("zoom", updatePaths);

  return null;
};

const Viz = ({ classes }) => {
  const position = [-23.42, -57.43];
  const defaultProduct = products[0];
  const [product, setProduct] = useState(defaultProduct);
  const defaultYear = years[0];
  const [year, setYear] = useState(defaultYear);

  return (
    <>
      <MapContainer center={position} zoom={6} scrollWheelZoom={false}>
        <D3Layer product={product} type={"Producción"} year={year} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <MapSizeBar
        sidebarClassName={classes.mapSidebar}
        product={product}
        setProduct={setProduct}
        year={year}
        setYear={setYear}
      />
    </>
  );
};

const MapSizeBar = ({
  sidebarClassName,
  product,
  setProduct,
  year,
  setYear,
}) => {
  return (
    <FormControl className={sidebarClassName}>
      <InputLabel id="label-id">Producto</InputLabel>
      <Select
        labelId="label-id"
        id="product-select"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      >
        {products.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </Select>
      <Typography id="discrete-slider" gutterBottom>
        Año
      </Typography>
      <Slider
        key={"someUniqueKey"}
        value={year}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={2010}
        max={2020}
        onChangeCommitted={(e, newValue) => setYear(newValue)}
      />
    </FormControl>
  );
};

const theme = createTheme();

function Main() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box className={classes.root}>
          <Navbar classes={classes} />
          <Switch>
            <Box className={classes.content}>
              <Route path="/" exact>
                <Viz classes={classes} />
              </Route>
              <Route path="/evolution" exact>
                <div>
                  <h4>Some evolution</h4>
                  <LineCharts />
                </div>
              </Route>
              <Route path="/points" exact>
                <div>
                  <h4>Some Points</h4>
                </div>
              </Route>
            </Box>
          </Switch>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default Main;
