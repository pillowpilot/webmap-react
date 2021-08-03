import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Slider,
  MenuItem,
  Grid,
  Paper,
} from "@material-ui/core";
import { products } from "../utils";

const MapSizeBar = ({
  sidebarClassName,
  product,
  setProduct,
  year,
  setYear,
}) => {
  return (
    <Paper elevation={3}>
      <Grid container>
        <Box width={1} height="100%" p={3}>
          <Grid item xs={12}>
            <FormControl
              variant="outlined"
              className={sidebarClassName}
              fullWidth
            >
              <InputLabel id="label-id">Producto</InputLabel>
              <Select
                labelId="label-id"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                {products.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>{" "}
          <Grid item xs={12}>
            <Box pl="13px" pr="10px">
              <Typography
                gutterBottom
                color="textSecondary"
                variant="caption"
                align="center"
              >
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
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Paper>
  );
};

export default MapSizeBar;
