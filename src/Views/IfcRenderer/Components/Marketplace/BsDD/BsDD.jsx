import { useState } from "react";
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
import OAuth2Login from 'react-simple-oauth2-login';

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

const BsDD = ({
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
  const [domain, setDomain] = useState(null);
  const classes = useStyles();

  async function handleGetCountry() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/country`
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleGetDomain() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/domain`,
        params: {
          namespaceUri: ''
        }
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleGetDomainClassifications() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/domain/classifications`,
        params: {
          namespaceUri: '',
          useNestedClassifications: ''
        }
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleGetLanguage() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/language`
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          onClick={handleGetCountry}
          className={classes.button}
        >
          Country
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleGetDomain}
          className={classes.button}
        >
          Domain
        </Button>
      </Grid>
    </Grid>
  );
};

export default BsDD;