import { useState } from "react";
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  FormControl,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  button: {
    backgroundColor: "#E6464D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E6464D",
      color: "white",
    },
    "&:disabled": {
      opacity: 0.8,
      color: "white",
    },
  },
  datBimTitle: {
    textAlign: "center",
    // color: '#E6464D',
    textTransform: "none",
  },
}));

const Login = ({ handleSubmit }) => {
  const classes = useStyles();

  const username = localStorage.getItem("email");
  const [email, setEmail] = useState(username);

  function handleChange(event) {
    setEmail(event.target.value);
  }

  return (
    <>
      <h2 className={classes.datBimTitle}>Open dthX API Connexion</h2>
      <Grid item xs={12}>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="filled-basic"
              label="Email"
              name="email"
              variant="filled"
              value={email}
              onChange={handleChange}
            />
            <TextField
              type="password"
              id="outlined-basic"
              label="Mot de passe"
              name="password"
              variant="filled"
            />
            <Button type="submit" className={classes.button}>
              Connexion
            </Button>
            <a
              href="https://www.datbim.com/template/espace-client"
              target="_blank"
            >
              Créer un compte
            </a>
            <a
              href="https://www.datbim.com/inscription/oublie-mdp"
              target="_blank"
            >
              Mot de passe oublié?
            </a>
          </FormControl>
        </form>
      </Grid>
    </>
  );
};

export default Login;
