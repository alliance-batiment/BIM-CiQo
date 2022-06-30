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
  CircularProgress,
  Tabs,
  Tab,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from "@material-ui/core";
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
// import { UseNFTMinter } from "./NFTMinter.hooks";
// import { MoralisProvider } from "react-moralis";
import axios from 'axios';
import WalletConnectMoralis from './Components/WalletConnectMoralis';
import { MoralisProvider } from "react-moralis";
import Home from './Components/Home';
import SellNFT from './Components/SellNFT';
import MyNFTs from './Components/MyNFTs';
import Dashboard from './Components/Dashboard';
import { UseTriChain } from './TriChain.hooks';
import ResellNFT from "./Components/ResellNFT/ResellNFT";


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
  REACT_APP_THIRD_PARTY_API,
  REACT_APP_MORALIS_APPLICATION_ID,
  REACT_APP_MORALIS_SERVER_URL
} = process.env;

const TriChain = ({
  bimData,
  setBimData,
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

  const {
    state,
    setState,
  } = UseTriChain({
    bimData,
    setBimData
  });

  const [value, setValue] = useState('home');

  const handleChange = (event, newValue) => {
    console.log('newValue', newValue)
    setState({
      ...state,
      views: {
        ...state.views,
        index: newValue
      }
    });
  };

  return (
    <Grid container>
      {/* {state.loading ?
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
        : */}
      <>
        <MoralisProvider
          appId={REACT_APP_MORALIS_APPLICATION_ID}
          serverUrl={REACT_APP_MORALIS_SERVER_URL}
        >
          <WalletConnectMoralis />

          {state.views.value === "home" &&
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={state.views.index} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Home" {...a11yProps(0)} />
                  <Tab label="Sell NFT" {...a11yProps(1)} />
                  <Tab label="My NFTs" {...a11yProps(2)} />
                  {/* <Tab label="Dashboard" {...a11yProps(3)} /> */}
                </Tabs>
              </Box>
              <TabPanel value={state.views.index} index={0}>
                <Home
                  state={state}
                  setState={setState}
                />
              </TabPanel>
              <TabPanel value={state.views.index} index={1}>
                <SellNFT
                  state={state}
                  setState={setState}
                  setBimData={setBimData}
                />
              </TabPanel>
              <TabPanel value={state.views.index} index={2}>
                <MyNFTs
                  state={state}
                  setState={setState}
                />
              </TabPanel>
              {/* <TabPanel value={state.views.index} index={3}>
              <Dashboard
                state={state}
                setState={setState}
              />
            </TabPanel> */}
            </Box>
          }
          {state.views.value === "resell-nft" &&
            <ResellNFT
              state={state}
              setState={setState}
              setBimData={setBimData}
            />
          }
        </MoralisProvider>
        {/* {state.views.value === "home" &&
          <Home
            state={state}
            setState={setState}
          />
        }
        {state.views.value === "create-nft" &&
          <SellNFT
            state={state}
            setState={setState}
          />
        }
        {state.views.value === "my-nfts" &&
          <MyNFTs
            state={state}
            setState={setState}
          />
        }
        {state.views.value === "dashboard" &&
          <Dashboard
            state={state}
            setState={setState}
          />
        } */}
      </>
      {/* } */}
    </Grid>
  );
};

export default TriChain;


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}