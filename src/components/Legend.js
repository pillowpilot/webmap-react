import React from "react";

const LegendEntry = ({ cx, cy, color, text }) => {
  const circleRadii = 10;
  const spaceBetween = 5;
  return (
    <g>
      <circle cx={cx} cy={cy} r={circleRadii} fill={color} />
      <text x={cx + circleRadii + spaceBetween} y={cy + circleRadii}>
        {text}
      </text>
    </g>
  );
};

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.createViz = this.createViz.bind(this);
  }
  componentDidMount() {
    this.createViz();
  }
  componentDidUpdate() {
    this.createViz();
  }
  createViz() {
    const node = this.node;
    const width = this.props.width;
    const height = this.props.height;
    const legendText = this.props.legend;

    let colorScheme = d3.schemeReds[9];
    colorScheme.unshift("#eee");
    let colorScale = d3
      .scaleThreshold()
      .domain([1, 5, 10, 50, 100, 500, 1000, 5000, 10000])
      .range(colorScheme);

    let svg = d3.select(node).attr("width", width).attr("height", height);
  }

  render() {
    return (
      <svg ref={(node) => (this.node = node)}>
        <LegendEntry cx={10} cy={20} color={"tomato"} text={"tom"} />
        <LegendEntry cx={10} cy={45} color={"red"} text={"red"} />
        <LegendEntry cx={10} cy={70} color={"blue"} text={"blu"} />
        <LegendEntry cx={10} cy={95} color={"yellow"} text={"yel"} />
      </svg>
    );
  }
}
