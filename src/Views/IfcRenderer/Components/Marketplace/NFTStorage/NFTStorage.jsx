import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fab,
  CircularProgress
} from "@material-ui/core";
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import axios from "axios";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { UseWeb3 } from './Web3.hooks';
import Home from './Components/Home';


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
  const classes = useStyles();
  const [bimData, setBimData] = useState({
    openProperties,
    projectId,
    objSelected,
    viewer,
    modelID,
    eids,
    setEids,
    addElementsNewProperties,
    handleShowMarketplace
  });

  const {
    state,
    setState,
    handleListUploads,
    handleUploadFile,
    handleDownloadFile,
    handleShowFile,
    handleRemoveFile
  } = UseWeb3({
    bimData
  });

  useEffect(() => {
    const init = async () => {
      // await handleTokenValidation();
      await handleListUploads();
    }
    init();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          type="file"
          id="input"
          accept="ifc"
          onChange={handleUploadFile}>Import IFC</TextField>
        {/* <label htmlFor="contained-button-file">
  <Input accept=".ifc" id="contained-button-file" multiple type="file" />
  <Button variant="contained" component="span" onClick={handleUploadFile}>
    Upload
  </Button>
</label> */}
      </Grid>
      <Grid item xs={12}>
        <Button
          className={classes.button}
          onClick={handleUploadFile}
        >
          Upload
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          className={classes.button}
          onClick={handleDownloadFile}
        >
          Download
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          className={classes.button}
          onClick={handleShowFile}
        >
          Show
        </Button>
      </Grid>
      {state.loading ?
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
        :
        <>
          {state.views.value === "home" &&
            <Home
              state={state}
              setState={setState}
            // handleGetTextSearchListOpen={handleGetTextSearchListOpen}
            // handleGetClassification={handleGetClassification}
            // handleGetProperty={handleGetProperty}
            />
          }
          {/* {state.views.value === "storage" &&
            <Classification
              state={state}
              setState={setState}
              handleGetClassification={handleGetClassification}
              handleGetProperty={handleGetProperty}
            />
          }
          {state.views.value === "validation" &&
            <Property
              state={state}
              setState={setState}
              handleGetClassification={handleGetClassification}
              handleGetProperty={handleGetProperty}
            />
          } */}
        </>
      }
    </Grid>
  );
};

export default Web3;