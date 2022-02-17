import { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  Button,
  Typography,
  Step,
  StepLabel,
  withStyles,
  Stepper,
} from "@material-ui/core";
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import axios from "axios";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

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
  navigationBar: {
    margin: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDatBim: {
    width: "50%",
    height: "70%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "hidden scroll",
    position: "relative",
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
  },
  datBimTitle: {
    textAlign: "center",
    // color: '#E6464D',
    textTransform: "none",
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  datBimFooterCard: {
    display: "block",
    textAlign: "right",
  },
  datBimCardButton: {
    textAlign: "right",
    color: "white",
  },
  accordionDetails: {
    display: "block",
  },
  datBimIcon: {
    width: "3em",
  },
}));


const {
  REACT_APP_THIRD_PARTY_API
} = process.env;

const Web3 = ({
  openProperties,
  projectId,
  objSelected,
  viewer,
  modelID,
  eids,
  setEids,
  addElementsNewProperties,
  handleShowMarketplace
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const [code, setCode] = useState(null);
  const [connection, setConnection] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const init = async () => {
      console.log("HELLO")
      await handleTokenValidation();
    }
    init();
  }, []);

  const handleTokenValidation = async () => {
    // try {
    //   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4MkVGQzgzMzZBODZCNEMyODRGQ0FGN2EwMzBBOWRlRmUzMDdlQzIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDQ3ODU5NzE5NDMsIm5hbWUiOiJ0cmliaW0ifQ.gJL4cjZwmY2234oI18E2KH0fQ60w5k7ji0jMxQkZI_0";





    //   const res = await axios({
    //     method: "get",
    //     url: `${REACT_APP_THIRD_PARTY_API}/web3/validatetoken`,
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //   })
    //   setConnection(res.data.tokenValidation);
    // } catch (err) {
    //   console.log('err', err);
    //   setConnection(false);
    // }
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4MkVGQzgzMzZBODZCNEMyODRGQ0FGN2EwMzBBOWRlRmUzMDdlQzIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDQ3ODU5NzE5NDMsIm5hbWUiOiJ0cmliaW0ifQ.gJL4cjZwmY2234oI18E2KH0fQ60w5k7ji0jMxQkZI_0";
    const web3storage = new Web3Storage({ token })
    console.log('web3storage', web3storage)
    try {
      for await (const _ of web3storage.list({ maxResults: 1 })) {
        // any non-error response means the token is legit
        break
      }
      return true
    } catch (e) {
      // only return false for auth-related errors
      if (e.message.includes('401') || e.message.includes('403')) {
        console.log('invalid token', e.message)
        return false
      }
      // propagate non-auth errors
      throw e
    }
  }


  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          className={classes.button}
        >
          {connection}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Web3;
