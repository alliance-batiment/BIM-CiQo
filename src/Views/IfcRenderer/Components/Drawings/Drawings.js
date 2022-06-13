import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, Fab } from "@material-ui/core";
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
  Typography,
} from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MapIcon from "@mui/icons-material/Map";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Drawing from "dxf-writer";

import DrawingList from "./Scenes/DrawingList";
import DxfViewer from "./Scenes/DxfViewer";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardExpanded: {
    position: "absolute",
    top: "0px",
    zIndex: 1000,
    left: "0px",
    right: "0px",
    opacity: "0.95",
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175,
  },
  card: {
    position: "absolute",
    top: "0px",
    zIndex: 100,
    left: "0px",
    right: "0px",
    opacity: "0.95",
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175,
  },
  cardContent: {
    opacity: "0.95",
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
    backgroundColor: "transparent",
    width: theme.spacing(7),
    height: theme.spacing(7),
    // padding: '5px',
    borderRadius: "0px",
  },
  fab: {
    backgroundColor: "white",
  },
}));

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Drawings = ({ viewer, showDrawings, setShowDrawings }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [expandedView, setExpandedView] = useState(false);
  const [viewWidth, setViewWidth] = useState("100%");
  const [viewHeight, setViewHeight] = useState("100%");

  const props = {
    width: viewWidth,
    height: viewHeight,
  };

  const classes = useStyles(props);

  useEffect(() => {
    const getWidth = () => window.innerWidth - 175;
    const getHeight = () => window.innerHeight - 175;
    const resizeListener = () => {
      if (!expandedView) {
        setViewWidth(getWidth());
        setViewHeight(getHeight());
      }
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const handleExpandView = (e) => {
    const width = window.innerWidth - 175;
    const height = window.innerHeight - 175;

    if (!expandedView) {
      setExpandedView(true);
      setViewWidth(width);
      setViewHeight(height);
      setAnchorEl(null);
    } else if (expandedView) {
      setExpandedView(false);
      setViewWidth("100%");
      setViewHeight("100%");
      setAnchorEl(null);
    }
  };

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
    <Card className={expandedView ? classes.cardExpanded : classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <Fab size="small" className={classes.fab}>
              <MapIcon />
            </Fab>
          </Avatar>
        }
        title={`Plans`}
        subheader={`Liste des plans`}
        action={
          <div>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleExpandView}
              size="small"
            >
              {expandedView ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={() => {
                viewer.clipper.active = false;
                setShowDrawings(false);
              }}
              size="small"
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleClick}
              size="small"
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
              <ListItem
                button
                onClick={() => {
                  viewer.clipper.active = false;
                  setShowDrawings(false);
                }}
              >
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Fermer" />
              </ListItem>
            </Popover>
          </div>
        }
      />
      <CardContent className={classes.cardContent}>
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
          <DrawingList viewer={viewer} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DxfViewer viewer={viewer} />
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default Drawings;

const TabPanel = (props) => {
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
};
