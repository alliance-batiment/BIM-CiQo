import React, { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Fab
} from "@material-ui/core";
import {
  Grid,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Badge,
  ListItemText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Popover,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MapIcon from '@mui/icons-material/Map';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import Drawing from 'dxf-writer';

import DrawingList from './Scenes/DrawingList';
import DxfViewer from './Scenes/DxfViewer';

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
  avatar: {
    backgroundColor: 'transparent',
    width: theme.spacing(7),
    height: theme.spacing(7),
    // padding: '5px',
    borderRadius: '0px'
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

const Drawings = ({
  viewer,
  showDrawings,
  setShowDrawings
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
  }, []);


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
              <MapIcon />
            </Fab>
          </Avatar>
        }
        title={`Plans`}
        subheader={`Liste des plans`}
        action={<div>
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
            <ListItem button onClick={() => {
              viewer.clipper.active = false;
              setShowDrawings(false);
            }}>
              <ListItemIcon>
                <ClearIcon />
              </ListItemIcon>
              <ListItemText primary="Fermer" />
            </ListItem>
          </Popover>
        </div>}
      />
      <CardContent>
        {/* <CardContent className={classes.cardContent}> */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Plans" {...a11yProps(0)} />
            <Tab label="Visualiseur de DXF" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <DrawingList
            viewer={viewer}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DxfViewer
            viewer={viewer}
          />
        </TabPanel>
      </CardContent>
    </Card>
  )
};

export default Drawings;

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
