import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, Fab, Typography } from "@material-ui/core";
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
} from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";

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
    height: "85%",
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

const Cuts = ({ viewer, showCuts, setShowCuts }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cuts, setCuts] = useState([]);
  const [allowCut, setAllowCut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [viewWidth, setViewWidth] = useState("100%");
  const [viewHeight, setViewHeight] = useState("100%");

  // useEffect(() => {
  //   console.log('viewer.clipper.planes', viewer.clipper.planes)
  //   const getCuts = async () => {
  //     setLoading(true);
  //     viewer.clipper.active = true;
  //     setCuts(viewer.clipper.planes);
  //     setLoading(false);
  //   };
  //   getCuts();
  // }, [cuts]);

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
    viewer.clipper.active = true;
    window.addEventListener("resize", resizeListener);
    window.addEventListener("dblclick", addClippingPlane, false);
    return () => {
      viewer.clipper.active = false;
      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("dblclick", addClippingPlane, false);
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

  const addClippingPlane = async () => {
    setLoading(true);
    console.log("viewer", viewer);
    await viewer.clipper.createPlane();
    console.log("viewer.clipper.planes", viewer.clipper.planes);
    console.log("viewer.plans.planLists", viewer.plans.planLists);
    setCuts(viewer.clipper.planes);
    setLoading(false)
  };

  const handleAddClippingPlane = () => {
    if (showCuts) {
      viewer.clipper.active = true;
      window.addEventListener("dblclick", addClippingPlane, false);
    }
  };

  const handleDeleteClippingPlane = async (cut, index) => {
    if (showCuts) {
      setLoading(true);
      await viewer.clipper.deletePlane(cut);
      setLoading(false);
      console.log("viewer.clipper.planes", viewer.clipper.planes);
      window.removeEventListener("dblclick", addClippingPlane, false);
      // const newCuts = cuts.splice(index, 1);
      // setCuts([...newCuts]);
    }
  };

  const handleHideAllClippingPlane = async () => {
    setLoading(true);
    viewer.clipper.active = !viewer.clipper.active;
    if (!viewer.clipper.active) {
      await viewer.removeClippingPlane();
    }
    setLoading(false);
  };

  const handleRemoveAllClippingPlane = async () => {
    setLoading(true);
    viewer.clipper.active = false;
    await viewer.clipper.deleteAllPlanes();
    // if (viewer.clipper.planes.length > 0) {
    //   viewer.clipper.planes.forEach(dimension => dimension.removeFromScene());
    // }
    viewer.clipper.planes = [];
    setCuts([]);
    setLoading(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card className={expandedView ? classes.cardExpanded : classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <Fab size="small" className={classes.fab}>
              <CropIcon />
            </Fab>
          </Avatar>
        }
        title={`Coupes`}
        subheader={`Liste des coupes`}
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
                window.removeEventListener("dblclick", addClippingPlane, false);
                setShowCuts(false);
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
                  window.removeEventListener(
                    "dblclick",
                    addClippingPlane,
                    false
                  );
                  setShowCuts(false);
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
      <CardContent>
        <Grid container spacing={2}>
          {/* <Grid item xs={6} style={{ textAlign: "left" }}>
            <ButtonGroup className={classes.buttonGroup}>
              <Button
                edge="end"
                aria-label="comments"
                onClick={handleAddClippingPlane}
              >
                <AddIcon />
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <ButtonGroup className={classes.buttonGroup}>
              <Button
                edge="end"
                aria-label="comments"
                onClick={handleHideAllClippingPlane}
              >
                <VisibilityIcon />
              </Button>
              <Button
                edge="end"
                aria-label="comments"
                onClick={handleRemoveAllClippingPlane}
              >
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </Grid> */}
          <Grid item xs={12}>
            {/* <Typography variant="subtitle1" component="h3">
              Liste de coupes:
        </Typography> */}
            <Typography gutterBottom variant="title2" component="div">
              Double-cliquer sur une surface pour générer une coupe
                  </Typography>
          </Grid>
          <Grid item xs={12}>
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              <List sx={{ width: "100%" }}>
                {viewer.clipper.planes.length > 0 &&
                  viewer.clipper.planes.map((cut, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            aria-label="comments"
                            onClick={() =>
                              handleDeleteClippingPlane(cut, index)
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        role={undefined}
                        dense
                      //  onClick={() => handleShowElement(ifcClass.eids)}
                      >
                        {/* <ListItemIcon>
                    </ListItemIcon> */}
                        <ListItemText
                          id={`checkbox-list-label-${index}`}
                          primary={`${cut.arrowBoundingBox.uuid}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Cuts;
