import L from "leaflet";
import { useMap } from "react-leaflet";
import * as d3 from "d3";
import geodata from "../data/py_states.json";
import { filterData } from "../utils";

const generateMapping = (minValue, maxValue) => {
  let map = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range(["white", "steelblue"]);
  return map;
};

const D3Layer = ({ product, type, year }) => {
  const map = useMap(); // useMap has to be called from a Component

  /*
   * Add an SVG into Leaflet's overlay pane. Add paths and texts for every geodata.feature,
   * however without any d data, filling or text coords.
   */
  if (d3.select("#mysvg").empty()) {
    d3.select(map.getPanes().overlayPane).append("svg").attr("id", "mysvg");
  }
  // Add a path element per geoFeature
  d3.select("#mysvg")
    .attr("overflow", "visible")
    .selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path");

  // Add a text element per geoFeature
  d3.select("#mysvg")
    .selectAll("text")
    .data(geodata.features)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .text((geoFeature) => geoFeature.properties["ADM1_ES"]);

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
  // update labels
  const updateLabels = () => {
    d3.select("#mysvg")
      .selectAll("text")
      .attr("x", (f) => path.centroid(f)[0])
      .attr("y", (f) => path.centroid(f)[1]);
  };

  updatePaths();
  updateLabels();
  map.on("zoom", updatePaths);
  map.on("zoom", updateLabels);

  return null;
};

export default D3Layer;
