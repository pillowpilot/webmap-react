import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const Navbar = ({ classes }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" className={classes.title}>
        Reporte de Residuos
      </Typography>
      <Button component={Link} to="/" color="inherit">
        Mapa
      </Button>
      <Button component={Link} to="/evolution" color="inherit">
        Evolución
      </Button>
      <Button component={Link} to="/points" color="inherit">
        Datos Puntuales
      </Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
