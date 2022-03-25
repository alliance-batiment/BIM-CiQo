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

const AxeoBim = ({
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
  const [loginComponent, setLoginComponent] = useState(null);
  const classes = useStyles();

  async function handleOauthAuthenticate() {
    try {
      const res = await axios({
        method: "post",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/authenticate`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      })
      setAccessToken(res.data.access_token)
      console.log('axeobim_access_token', res.data.access_token)
      sessionStorage.setItem("axeobim_access_token", res.data.access_token);
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleOauthAuthorize() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/authorize`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      })
      console.log('res', res)
      sessionStorage.setItem("axeobim_access_token", res.data.access_token);
      setLoginComponent(res.data);
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleOauthGetToken = async (code) => {
    try {
      console.log('code', code)
      const res = await axios({
        method: "post",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/gettoken`,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          code
        }
      })
      console.log('res.data', res.data);
      sessionStorage.setItem("axeobim_access_token", res.data.access_token);
      sessionStorage.setItem("axeobim_refresh_token", res.data.refresh_token);
      sessionStorage.setItem("axeobim_token_type", res.data.token_type);
      setLoginComponent(res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleOauthLoginOnSuccess = (response) => {
    console.log('code', sessionStorage.getItem("axeobim_access_token"))
    sessionStorage.setItem("axeobim_code", response.code);
    handleOauthGetToken(response.code);
  };

  const handleOauthLoginOnFailure = (response) => {
    console.error(response);
  };

  const handleAdminProjects = async () => {
    try {
      console.log('access_token_3', sessionStorage.getItem("axeobim_access_token"));
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/administration/projects`,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          accessToken: `${sessionStorage.getItem("axeobim_access_token")}`
        }
      })
      console.log('res', res)
      // sessionStorage.setItem("axeobim_access_token", res.data.access_token);
      // setLoginComponent(res.data);
    } catch (err) {
      console.log('err', err)
    }
  }


  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          onClick={handleOauthAuthenticate}
          className={classes.button}
        >
          Authenticate
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleOauthAuthorize}
          className={classes.button}
        >
          Authorize
        </Button>
      </Grid>
      <OAuth2Login
        authorizationUrl="https://app.axxone.fr/system_aplus/api/oauth/authorize"
        // authorizationUrl={`${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/authorize`}
        responseType="code"
        clientId="JTy0XiRuehb19eJK7j5PbTon0Ukps2HA"
        redirectUri="http://localhost:3000"
        scope="workflow files:read projects:read"
        onSuccess={handleOauthLoginOnSuccess}
        onFailure={handleOauthLoginOnFailure} />
      <Grid item xs={12}>
        <Button
          onClick={handleAdminProjects}
          className={classes.button}
        >
          Get Projects
        </Button>
      </Grid>
    </Grid>
  );
};

export default AxeoBim;
