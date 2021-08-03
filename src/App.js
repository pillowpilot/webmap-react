import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "./leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  createTheme,
  ThemeProvider,
  Box,
  makeStyles,
  Grid,
  Paper,
  CssBaseline,
} from "@material-ui/core";

import Navbar from "./components/Navbar";
import LineCharts from "./components/LineCharts";
import D3Layer from "./components/D3Layer";
import MapSizeBar from "./components/MapSideBar";
import { products, years } from "./utils";
import "@fontsource/roboto";
import YearChart from "./components/YearChart";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100vh",
  },
  title: {
    flexGrow: 1,
  },
  content: {
    display: "flex",
    flexFlow: "row",
    flexGrow: 1,
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

const Viz = ({ classes }) => {
  const position = [-23.42, -57.43];
  const defaultProduct = products[0];
  const [product, setProduct] = useState(defaultProduct);
  const defaultYear = years[0];
  const [year, setYear] = useState(defaultYear);

  return (
    <div style={{ "overflow-x": "hidden", display: "flex", width: "100%" }}>
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={10}>
          <Box p={1} style={{ height: "100%" }}>
            <Paper elevation={3} style={{ height: "100%" }}>
              <MapContainer center={position} zoom={7} scrollWheelZoom={false}>
                <D3Layer product={product} type={"Residuo Seco"} year={year} />
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={2}>
          <Box pt={1} pr={1} pb={1}>
            <MapSizeBar
              sidebarClassName={classes.mapSidebar}
              product={product}
              setProduct={setProduct}
              year={year}
              setYear={setYear}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

const Charts = () => (
  <div style={{ "overflow-x": "hidden", display: "flex", width: "100%" }}>
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={6}>
        <Box p={1}>
          <LineCharts />
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box pt={1} pr={1} pb={1}>
          <YearChart />
        </Box>
      </Grid>
    </Grid>
  </div>
);

const theme = createTheme();

function Main() {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
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
                  <Charts />
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
    </>
  );
}

export default Main;
