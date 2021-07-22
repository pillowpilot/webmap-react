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
  Select,
  Slider,
  Divider,
  MenuItem,
} from "@material-ui/core";

import Navbar from "./components/Navbar";
import {
  filterData,
  filterEvolutionOfProductInRegion,
  products,
  years,
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

  const drawChorograph = () => {
    const data = filterData(product, type, year);
    const amounts = data.map((entry) => entry.amount);
    const minAmount = Math.min.apply(null, amounts);
    const maxAmount = Math.max.apply(null, amounts);
    const mapping = generateMapping(minAmount, maxAmount);

    const extractRegionEntry = (regionCode) =>
      data.filter((entry) => entry.administrative_region === regionCode)[0];

    // const projection = d3.geoMercator().fitSize([width, height], geodata);
    function projectPoint(x, y) {
      const point = map.latLngToLayerPoint(L.latLng(y, x));
      this.stream.point(point.x, point.y);
    }
    const projection = d3.geoTransform({
      point: projectPoint,
    });
    const path = d3.geoPath().projection(projection);

    let svg = d3.select(map.getPanes().overlayPane).append("svg");
    svg.attr("overflow", "visible");
    const paths = svg
      .selectAll("path")
      .data(geodata.features)
      .enter()
      .append("path");
    // redraw the entire map, without removing the svg
    const reset = () => {
      const width = map.getSize().x;
      const height = map.getSize().y;
      svg.attr("width", width).attr("height", height);

      paths.attr("d", path).style("fill", (geoFeature) => {
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
    };
    map.on("zoom", reset);
    reset();
  };

  useEffect(drawChorograph, []);
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
    <div>
      <List className={sidebarClassName} component="nav">
        <ListItem>
          <Select
            id="product-select"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            {products.map((product) => (
              <MenuItem key={product} value={product}>
                {product}
              </MenuItem>
            ))}
          </Select>
        </ListItem>
        <ListItem>
          <Slider
            key={"someUniqueKey"}
            defaultValue={year}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2010}
            max={2020}
            onChangeCommitted={(e, newValue) => setYear(newValue)}
          />
        </ListItem>
        <ListItem></ListItem>
      </List>
      <Divider />
      <List component="nav">
        <ListItem>
          <Typography variant="h5">Departamento Over</Typography>
        </ListItem>
        <ListItem>
          <Typography variant="h6">Producción: x</Typography>
        </ListItem>
        <ListItem>
          <Typography variant="h6">Seco: y</Typography>
        </ListItem>
      </List>
    </div>
  );
};

class Evolution extends React.Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const width = 700;
    const height = 300;

    const data = filterData("Soja", "Producción", 2020).map((o, i) => ({
      x: i,
      y: o.amount,
    }));
    console.log(data);
    const data2 = filterEvolutionOfProductInRegion("Soja", "Producción", 8);
    console.log(data2);
    const maxAmount = Math.max.apply(
      null,
      data2.map((d) => d.amount)
    );
    const minAmount = Math.min.apply(
      null,
      data2.map((d) => d.amount)
    );
    console.log(minAmount);
    console.log(maxAmount);

    const xScale = d3.scaleLinear().domain([2009, 2021]).range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([minAmount, maxAmount])
      .range([height, 0]);

    const svg = d3
      .select(this.node)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    svg
      .append("path")
      .datum(data2)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(d.year))
          .y((d) => yScale(d.amount))
      );
  }

  render() {
    return <div ref={(node) => (this.node = node)} />;
  }
}
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
                  <Evolution />
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
