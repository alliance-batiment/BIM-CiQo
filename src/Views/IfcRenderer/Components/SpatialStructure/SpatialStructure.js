import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Tabs,
  Tab,
  Chip,
  ListItemButton,
  Grid,
  Button,
  Fab
} from "@mui/material";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { IFCSLAB, IFCMEMBER, IFCSTRUCTURALCURVEMEMBER } from "web-ifc";
import SearchData from '../SearchData';
import ProjectTree from "../ProjectTree";
import Settings from "../Settings";

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
  treeViewLabel: {
    left: "3em",
    position: "absolute",
    textOverflow: "ellipsis",
    overflow: "hidden",
    wordWrap: "break-word",
    warp: true,
    // width: '5em'
  },
  treeViewCheckbox: {
    margin: 0,
    padding: 0,
  },
  treeView: {
    // height: 240,
    flexGrow: 1,
    // maxWidth: 400,
  },
  avatar: {
    backgroundColor: 'transparent',
    // width: theme.spacing(7),
    // height: theme.spacing(7),
    // padding: '5px',
    // borderRadius: '0px'
  },
  fab: {
    backgroundColor: 'white'
  }
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SpatialStructure = ({
  viewer,
  spatialStructures,
  handleShowSpatialStructure,
  handleShowMarketplace,
  handleShowProperties,
  eids,
  setEids
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [ifcElementByType, setIfcElementByType] = useState([]);
  const [expressIDList, setExpressIDList] = useState([]);

  useEffect(() => {
    async function init() {
      const modelID = await viewer.IFC.getModelID();
      setExpressIDList(eids);
      console.log('EIDS', eids)
    }
    init();
  }, [eids]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;



  return (
    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <Fab
              size="small"
              className={classes.fab}
            >
              <AccountTreeIcon />
            </Fab>
          </Avatar>
        }
        action={
          <div>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <ListItem button onClick={handleShowSpatialStructure}>
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Fermer" />
              </ListItem>
            </Popover>
          </div>
        }
        title={`Centre d'informations`}
        subheader="Espace de recherche et mise à jour des données"
      />
      <CardContent className={classes.cardContent}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Sélection" {...a11yProps(0)} />
            <Tab label="Structure spatiale" {...a11yProps(1)} />
            <Tab label="Classes" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {/* <SearchBar /> */}
          <SearchData
            viewer={viewer}
            handleShowMarketplace={handleShowMarketplace}
            handleShowProperties={handleShowProperties}
            eids={eids}
            setEids={setEids}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProjectTree
            viewer={viewer}
            spatialStructures={spatialStructures}
            handleShowSpatialStructure={handleShowSpatialStructure}
            handleShowMarketplace={handleShowMarketplace}
            handleShowProperties={handleShowProperties}
            eids={eids}
            setEids={setEids}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Settings
            viewer={viewer}
            handleShowMarketplace={handleShowMarketplace}
            handleShowProperties={handleShowProperties}
            eids={eids}
            setEids={setEids}
          />
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default SpatialStructure;

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