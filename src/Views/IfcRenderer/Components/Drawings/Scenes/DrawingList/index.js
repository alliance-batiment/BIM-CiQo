import React, { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Fab
} from "@material-ui/core";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import Drawing from 'dxf-writer';
import { IFCWINDOW, IFCPLATE, IFCMEMBER, IFCWALL, IFCWALLSTANDARDCASE, IFCSLAB, IFCFURNISHINGELEMENT, IFCDOOR } from 'web-ifc';
import { ClippingEdges } from 'web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges';
import { Color, LineBasicMaterial, MeshBasicMaterial } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

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

const DrawingList = ({
  viewer
}) => {
  const classes = useStyles();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDrawings = async () => {
      try {
        setLoading(true);
        await viewer.plans.computeAllPlanViews(0);
        const planNames = Object.keys(viewer.plans.planLists[0]);
        setDrawings(planNames);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }
    getDrawings();
  }, []);

  const handleShowPlane = async (index) => {
    const current = drawings[index];
    console.log('current', current);
    viewer.plans.goTo(0, current, true);
    //viewer.context.items.ifcModels.forEach(model => viewer.edges.toggle(`${model.modelID}`));

    // viewer.shadowDropper.shadows[0].root.visible = false;
    // viewer.filler.fills[0].visible = false;
  }


  const handleDxfPlane = async (drawingName, index) => {
    console.log('viewer.plans.planLists[0][drawingName]', viewer.plans.planLists[0][drawingName])
    const currentPlan = viewer.plans.planLists[0][drawingName];
    viewer.dxf.initializeJSDXF(Drawing);
    viewer.dxf.newDrawing(drawingName);
    const polygons = viewer.edgesVectorizer.polygons;
    viewer.dxf.drawEdges(drawingName, polygons, 'projection', Drawing.ACI.BLUE);
    viewer.dxf.drawNamedLayer(drawingName, currentPlan, 'thick', 'section_thick', Drawing.ACI.RED);
    viewer.dxf.drawNamedLayer(drawingName, currentPlan, 'thin', 'section_thin', Drawing.ACI.GREEN);
    viewer.dxf.exportDXF(drawingName);
  }

  const handleAddPlane = async () => {
    await viewer.plans.computeAllPlanViews(0);
    const planNames = Object.keys(viewer.plans.planLists[0]);
    console.log('viewer.plans.planLists', viewer.plans.planLists)
    console.log('viewer.plans.planLists', planNames)
  }

  const handleDeletePlane = async (drawing, index) => {
    viewer.plans.exitPlanView(true);
  }

  const handleHideAllPlane = () => {
    viewer.clipper.active = !viewer.clipper.active;
    if (!viewer.clipper.active) {
      viewer.removeClippingPlane();
    }
  }

  const handleRemoveAllPlane = () => {
    // viewer.clipper.deleteAllPlanes();
    viewer.clipper.planes = [];
    setDrawings([]);
  }


  return (
    <Grid container>
      {/* <Grid item xs={6} style={{ textAlign: 'left' }}>
            <ButtonGroup
              className={classes.buttonGroup}
            >
              <Button
                edge="end"
                aria-label="comments"
                onClick={handleAddPlane}
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
                onClick={handleHideAllPlane}
              >
                <VisibilityIcon />
              </Button>
              <Button
                edge="end"
                aria-label="comments"
                onClick={handleRemoveAllPlane}
              >
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </Grid> */}
      <Grid item xs={12}>
        {loading ?
          <CircularProgress color="inherit" />
          :
          <List sx={{ width: "100%" }}>
            {drawings.length > 0 && drawings.map((drawing, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <>
                    {/* <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDxfPlane(drawing, index)}
                    >
                      <DownloadIcon />
                    </IconButton> */}
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleShowPlane(index)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeletePlane(drawing, index)}
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
                    primary={`${drawing}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        }
      </Grid>
    </Grid>
  )
};

export default DrawingList;