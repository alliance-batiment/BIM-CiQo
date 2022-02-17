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
  CircularProgress
} from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StraightenIcon from '@mui/icons-material/Straighten';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';


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


const Measures = ({
  viewer,
  showMeasures,
  setShowMeasures
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [measures, setMeasures] = useState([]);
  const [allowMeasure, setAllowMeasure] = useState(false);
  const [visibleMeasures, setVisibleMeasures] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMeasures = async () => {
      let dimensionsActive = true;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = !dimensionsActive;
      setVisibleMeasures(true);
      setMeasures(viewer.dimensions.dimensions);
    }
    getMeasures();
  }, []);


  const addMeasure = () => {
    viewer.dimensions.create();
    setMeasures(viewer.dimensions.dimensions);
  }

  const handleAddMeasure = () => {
    let dimensionsActive = false;
    let takeMeasure = !allowMeasure;
    setAllowMeasure(takeMeasure)
    if (takeMeasure) {
      dimensionsActive = true;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.IFC.unPrepickIfcItems();
      window.onmousemove = dimensionsActive ? null : viewer.IFC.prePickIfcItem;

      window.onmousedown = addMeasure;
    } else {
      dimensionsActive = false;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.IFC.unpickIfcItems();
      window.removeEventListener('mousedown', addMeasure, false);
    }

    window.onkeydown = (event) => {
      if (event.code === "Escape") {
        viewer.dimensions.cancelDrawing();
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
  }

  const handleDeleteMeasure = async (measure, index) => {
    if (showMeasures) {
      let dimensions = await viewer.dimensions.dimensions;
      const selected = dimensions.find(dimension => dimension.textLabel.uuid === measure.textLabel.uuid);
      const measureIndex = dimensions.findIndex(dimension => dimension.textLabel.uuid === measure.textLabel.uuid);
      if (measureIndex > -1) {
        const newMeasures = dimensions.splice(measureIndex, 1);
        selected.removeFromScene();

        // console.log('newMeasures', newMeasures);
        setMeasures([...dimensions]);
      }
    }
  }

  const handleMeasuresVisibility = () => {
    let visilibity = !visibleMeasures;
    setVisibleMeasures(visilibity);
    viewer.dimensions.active = visilibity;
  }

  const handleRemoveAllMeasures = () => {
    // viewer.clipper.deleteAllPlanes();
    if (viewer.dimensions.dimensions.length > 0) {
      viewer.dimensions.dimensions.forEach(dimension => dimension.removeFromScene());
    }
    viewer.dimensions.dimensions = [];
    setMeasures([]);
  }


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
              <StraightenIcon />
            </Fab>
          </Avatar>
        }
        title={`Outils de mesures`}
        subheader={`Liste des mesures`}
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
              let dimensionsActive = false;
              viewer.dimensions.active = dimensionsActive;
              viewer.dimensions.previewActive = dimensionsActive;
              // window.removeEventListener('dblclick', addClippingPlane, false);
              setShowMeasures(false);
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
        <Grid container>
          <Grid item xs={6} style={{ textAlign: 'left' }}>
            <ButtonGroup
              className={classes.buttonGroup}
            >
              <Button
                edge="end"
                aria-label="comments"
                style={{ backgroundColor: `${allowMeasure ? 'lightGray' : 'transparent'}` }}
                onClick={handleAddMeasure}
              >
                <AddIcon />
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <ButtonGroup
              className={classes.buttonGroup}
            >
              {/* <Button
                edge="end"
                aria-label="comments"
                style={{ backgroundColor: `${visibleMeasures ? 'lightGray' : 'transparent'}` }}
                onClick={handleMeasuresVisibility}
              >
                <VisibilityIcon />
              </Button> */}
              <Button
                edge="end"
                aria-label="comments"
                onClick={handleRemoveAllMeasures}
              >
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            {loading ?
              <CircularProgress color="inherit" />
              :
              <List sx={{ width: "100%" }}>
                {measures.length > 0 && measures.map((measure, index) => (
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
                        primary={`${measure.textLabel.uuid}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};

export default Measures;