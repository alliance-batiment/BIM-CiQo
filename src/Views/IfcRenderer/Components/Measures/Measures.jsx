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
  Typography
} from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StraightenIcon from "@mui/icons-material/Straighten";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { ConeGeometry, LineBasicMaterial, LineDashedMaterial, MeshBasicMaterial, Vector3 } from 'three';


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

const Measures = ({ viewer, showMeasures, setShowMeasures }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [measures, setMeasures] = useState([]);
  const [allowMeasure, setAllowMeasure] = useState(false);
  const [visibleMeasures, setVisibleMeasures] = useState(false);
  const [loading, setLoading] = useState(false);
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
    console.log('dimensions', viewer.dimensions.dimensions);
    setMeasures(viewer.dimensions.dimensions);

    let dimensionsActive = true;
    viewer.dimensions.active = dimensionsActive;
    viewer.dimensions.previewActive = dimensionsActive;
    // viewer.dimensions.setArrow(0.1, 0.03);
    // const coneGeometry = new ConeGeometry(radius, height);
    // coneGeometry.translate(0, -height / 2, 0);
    // coneGeometry.rotateX(-Math.PI / 2);
    // viewer.dimensions.endpoint = coneGeometry;

    viewer.dimensions.lineMaterial = new LineDashedMaterial({
      color: 0x000000,
      linewidth: 2,
      depthTest: false,
      dashSize: 0.1,
      gapSize: 0.1
    });

    window.addEventListener("resize", resizeListener);
    window.addEventListener("mousemove", handlePrePickIfcItem, false);
    window.addEventListener("dblclick", addMeasure, false);
    // window.addEventListener("mouseup", viewer.dimensions.cancelDrawing, false);
    window.addEventListener("keydown", handleControlMeasures, false);


    return () => {
      let dimensionsActive = false;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = dimensionsActive;

      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("mousemove", handlePrePickIfcItem, false);
      window.removeEventListener("dblclick", addMeasure, false);
      // window.removeEventListener("mouseup", viewer.dimensions.cancelDrawing, false);
      window.removeEventListener("keydown", handleControlMeasures, false);
    };
  }, []);

  const handlePrePickIfcItem = async () => {
    await viewer.IFC.selector.prePickIfcItem();
  }

  const handleControlMeasures = (e) => {
    if (e.code === "Escape") {
      viewer.dimensions.cancelDrawing();
    }
    if (
      e.code === "Delete" ||
      e.code === "Backspace" ||
      e.code === "keyD"
    ) {
      setShowMeasures(false);
      viewer.dimensions.deleteAll();
    }
  }




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

  // useEffect(() => {
  //   const getMeasures = async () => {
  //     let dimensionsActive = true;
  //     viewer.dimensions.active = dimensionsActive;
  //     viewer.dimensions.previewActive = !dimensionsActive;
  //     setVisibleMeasures(true);
  //     setMeasures(viewer.dimensions.dimensions);
  //   };
  //   getMeasures();
  // }, [measures]);

  const addMeasure = async () => {
    setLoading(true);
    console.log('HELLoo')
    let takeMeasure = !allowMeasure;
    setAllowMeasure(takeMeasure);
    if (takeMeasure) {
      await viewer.dimensions.create();
      setMeasures(viewer.dimensions.dimensions);
    }
    setLoading(false);
  };

  const customizePrePickItem = async () => {
    const found = await viewer.IFC.selector.context.castRayIfc();
    // This is more efficient than destroying and recreating the subset when the user hovers away
    if (!found) {
      viewer.IFC.selector.preselection.toggleVisibility(false);
      return;
    }
    console.log('found', found)
    await viewer.IFC.selector.preselection.pick(found);
  }

  const handleAddMeasure = async () => {
    let dimensionsActive = false;
    let takeMeasure = !allowMeasure;
    setAllowMeasure(takeMeasure);
    if (takeMeasure) {
      dimensionsActive = true;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.dimensions.setArrow(0.1, 0.03);

      viewer.dimensions.lineMaterial = new LineDashedMaterial({
        color: 0x000000,
        linewidth: 2,
        depthTest: false,
        dashSize: 0.1,
        gapSize: 0.1
      });
      // viewer.dimensions.lineMaterial = new LineBasicMaterial({
      //   color: 0x0000FF,
      //   linewidth: 30,
      //   linecap: 'round', //ignored by WebGLRenderer
      //   linejoin: 'round' //ignored by WebGLRenderer
      // });

      // await viewer.IFC.unPrepickIfcItems();




      // window.onmousemove = async () => dimensionsActive ? null : await viewer.IFC.prePickIfcItem();

      window.onmousemove = async () => dimensionsActive ? null : await viewer.IFC.selector.prePickIfcItem();

      window.onmousedown = addMeasure;
      window.onmouseup = async () => dimensionsActive ? null : await viewer.dimensions.cancelDrawing();
    } else {
      dimensionsActive = false;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.IFC.unpickIfcItems();
      window.removeEventListener("mousedown", addMeasure, false);
    }

    window.onkeydown = (event) => {
      if (event.code === "Escape") {
        viewer.dimensions.cancelDrawing();
        window.removeEventListener("mousedown", addMeasure, false);
      }
      if (
        event.code === "Delete" ||
        event.code === "Backspace" ||
        event.code === "keyD"
      ) {
        setShowMeasures(false);
        viewer.dimensions.deleteAll();
      }
    };
  };


  const handleDeleteMeasure = async (measure, index) => {
    setLoading(true);
    // if (showMeasures) {
    console.log('measure', measure);
    console.log('dimensions', dimensions);
    let dimensions = await viewer.dimensions.dimensions;
    console.log('measure', measure);
    console.log('dimensions', dimensions);
    const selected = await dimensions.find(
      (dimension) => dimension.textLabel.uuid === measure.textLabel.uuid
    );
    const measureIndex = await dimensions.findIndex(
      (dimension) => dimension.textLabel.uuid === measure.textLabel.uuid
    );
    if (measureIndex > -1) {
      const newMeasures = await dimensions.splice(measureIndex, 1);
      await selected.removeFromScene();

      // console.log('newMeasures', newMeasures);
      setMeasures([...dimensions]);
    }
    // }
    setLoading(false);
  };

  const handleMeasuresVisibility = () => {
    let visilibity = !visibleMeasures;
    setVisibleMeasures(visilibity);
    viewer.dimensions.active = visilibity;
  };

  const handleRemoveAllMeasures = () => {
    // viewer.clipper.deleteAllPlanes();
    if (viewer.dimensions.dimensions.length > 0) {
      viewer.dimensions.dimensions.forEach((dimension) =>
        dimension.removeFromScene()
      );
    }
    viewer.dimensions.dimensions = [];
    setMeasures([]);
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
              <StraightenIcon />
            </Fab>
          </Avatar>
        }
        title={`Outils de mesures`}
        subheader={`Liste des mesures`}
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
                let dimensionsActive = false;
                viewer.dimensions.active = dimensionsActive;
                viewer.dimensions.previewActive = dimensionsActive;
                // window.removeEventListener('dblclick', addClippingPlane, false);
                setShowMeasures(false);
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
                  let dimensionsActive = false;
                  viewer.dimensions.active = dimensionsActive;
                  viewer.dimensions.previewActive = dimensionsActive;
                  // window.removeEventListener('dblclick', addClippingPlane, false);
                  setShowMeasures(false);
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
                style={{
                  backgroundColor: `${allowMeasure ? "lightGray" : "transparent"
                    }`,
                }}
                onClick={handleAddMeasure}
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
                onClick={handleRemoveAllMeasures}
              >
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </Grid> */}
          <Grid item xs={12}>
            <Typography gutterBottom variant="title2" component="div">
              Double-cliquer pour créer une mesure
                  </Typography>
          </Grid>
          <Grid item xs={12}>
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              <List sx={{ width: "100%" }}>
                {viewer.dimensions.dimensions.length > 0 &&
                  viewer.dimensions.dimensions.map((measure, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            aria-label="comments"
                            onClick={() => handleDeleteMeasure(measure, index)}
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
                          primary={`Mesure-${measure.textLabel.uuid}`}
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

export default Measures;
