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


const Cuts = ({
  viewer,
  showCuts,
  setShowCuts
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cuts, setCuts] = useState([]);
  const [allowCut, setAllowCut] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCuts = async () => {
      viewer.clipper.active = true;
      setCuts(viewer.clipper.planes);
    }
    getCuts();
  }, []);

  const addClippingPlane = async () => {
    viewer.clipper.createPlane();
    console.log('viewer.clipper.planes', viewer.clipper.planes)
    console.log('viewer.plans.planLists', viewer.plans.planLists)
    setCuts(viewer.clipper.planes);
  };

  const handleAddClippingPlane = () => {
    if (showCuts) {
      viewer.clipper.active = true;
      window.addEventListener('dblclick', addClippingPlane, false);
    }
  }

  const handleDeleteClippingPlane = async (cut, index) => {
    if (showCuts) {
      await viewer.clipper.deletePlane(cut);
      const newCuts = cuts.splice(index, 1);
      setCuts([...newCuts]);
    }
  }

  const handleHideAllClippingPlane = () => {
    viewer.clipper.active = !viewer.clipper.active;
    if (!viewer.clipper.active) {
      viewer.removeClippingPlane();
    }
  }

  const handleRemoveAllClippingPlane = () => {
    viewer.clipper.active = false;
    viewer.clipper.deleteAllPlanes();
    // if (viewer.clipper.planes.length > 0) {
    //   viewer.clipper.planes.forEach(dimension => dimension.removeFromScene());
    // }
    viewer.clipper.planes = [];
    setCuts([]);
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
              <CropIcon />
            </Fab>
          </Avatar>
        }
        title={`Coupes`}
        subheader={`Liste des coupes`}
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
              window.removeEventListener('dblclick', addClippingPlane, false);
              setShowCuts(false);
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
                onClick={handleAddClippingPlane}
              >
                <AddIcon />
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <ButtonGroup
              className={classes.buttonGroup}
            >
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
          </Grid>
          <Grid item xs={12}>
            {loading ?
              <CircularProgress color="inherit" />
              :
              <List sx={{ width: "100%" }}>
                {cuts.length > 0 && cuts.map((cut, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => handleDeleteClippingPlane(cut, index)}
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
            }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};

export default Cuts;