import React, { useEffect, useState } from "react";
import {
  Alert
} from "@mui/material";
import {
  Typography,
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
  CardMedia,
  Badge,
  Fab,
  TextField,
  CircularProgress
} from "@material-ui/core";
import SearchBar from "../../../../../../../Components/SearchBar";
import { useMoralis } from 'react-moralis';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardInfo: {
    zIndex: 100,
    width: "100%",
    height: "100%",
  },
  cardContent: {
    height: "90%",
    overflowY: "auto",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "0px solid slategrey",
    },
  },
  application: {
    height: "17em",
  },
  avatar: {
    backgroundColor: "transparent",
    width: theme.spacing(7),
    height: theme.spacing(7),
    padding: "5px",
    borderRadius: "0px",
  },
  root: {
    maxWidth: 345,
    margin: "10px",
    cursor: "pointer",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  fab: {
    backgroundColor: "white",
  },
  button: {
    color: "black",
    // "&:hover": {
    //   color: "white",
    //   backgroundColor: "black",
    //   cursor: "pointer",
    // },
  },
}));



const Home = ({
  state,
  setState
}) => {
  const classes = useStyles();

  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();
  // if (!isAuthenticated) {
  //   return (
  //     <div>
  //       <button onClick={() => authenticate()}>Authenticate</button>
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (isAuthenticated) {
      setState({
        ...state,
        loading: false
      })
    }
  }, []);

  const handleChangeValue = (e, id) => {
    setState({
      ...state,
      nft: {
        [id]: e.target.value
      }
    })
  }

  return (
    <Grid container spacing={3}>
      {state.loading ?
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
        :
        <>
          <div>
            <h1>Welcome {user.get("username")}</h1>
          </div>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="name"
              onChange={(e) => handleChangeValue(e, 'name')} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="description"
              onChange={(e) => handleChangeValue(e, 'description')} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="file"
              id="input"
              accept="ifc"
            // onChange={handleUploadFile}
            >Import IFC</TextField>
          </Grid>
        </>
      }
    </Grid>
  );
};

export default Home;
