import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, Fab } from "@material-ui/core";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import DownloadIcon from "@mui/icons-material/Download";
import Drawing from "dxf-writer";
import {
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
} from "web-ifc";
import { ClippingEdges } from "web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges";
import { Color, LineBasicMaterial, MeshBasicMaterial } from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

const useStyles = makeStyles(() => ({
  // list: {
  //   width: "100%",
  //   height: "100%",
  //   maxHeight: "100%",
  //   overflow: "auto",
  // },
  activePlan: {
    color: "#E6464D",
  },
}));

const DrawingList = ({ viewer }) => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeViewIndex, setActiveViewIndex] = useState();

  const classes = useStyles();

  useEffect(() => {
    const getDrawings = async () => {
      try {
        setLoading(true);
        await viewer.plans.computeAllPlanViews(0);
        const planNames = Object.keys(viewer.plans.planLists[0]);
        setDrawings(planNames);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getDrawings();
  }, []);

  const handleShowPlane = async (index) => {
    setActiveViewIndex(index);

    const current = drawings[index];
    console.log("current", current);
    viewer.plans.goTo(0, current, true);
    //viewer.context.items.ifcModels.forEach(model => viewer.edges.toggle(`${model.modelID}`));

    // viewer.shadowDropper.shadows[0].root.visible = false;
    // viewer.filler.fills[0].visible = false;
  };

  const handleDxfPlane = async (drawingName, index) => {
    console.log(
      "viewer.plans.planLists[0][drawingName]",
      viewer.plans.planLists[0][drawingName]
    );
    const currentPlan = viewer.plans.planLists[0][drawingName];
    viewer.dxf.initializeJSDXF(Drawing);
    viewer.dxf.newDrawing(drawingName);
    const polygons = viewer.edgesVectorizer.polygons;
    viewer.dxf.drawEdges(drawingName, polygons, "projection", Drawing.ACI.BLUE);
    viewer.dxf.drawNamedLayer(
      drawingName,
      currentPlan,
      "thick",
      "section_thick",
      Drawing.ACI.RED
    );
    viewer.dxf.drawNamedLayer(
      drawingName,
      currentPlan,
      "thin",
      "section_thin",
      Drawing.ACI.GREEN
    );
    viewer.dxf.exportDXF(drawingName);
  };

  const handleAddPlane = async () => {
    await viewer.plans.computeAllPlanViews(0);
    const planNames = Object.keys(viewer.plans.planLists[0]);
    console.log("viewer.plans.planLists", viewer.plans.planLists);
    console.log("viewer.plans.planLists", planNames);
  };

  const handleDeletePlane = () => {
    setActiveViewIndex();
    viewer.plans.exitPlanView(true);
  };

  const handleHideAllPlane = () => {
    viewer.clipper.active = !viewer.clipper.active;
    if (!viewer.clipper.active) {
      viewer.removeClippingPlane();
    }
  };

  const handleRemoveAllPlane = () => {
    // viewer.clipper.deleteAllPlanes();
    viewer.clipper.planes = [];
    setDrawings([]);
  };

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
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <List className={classes.list} disablePadding>
            <ListItem
              disablePadding
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="comments">
                    <LayersClearIcon />
                  </IconButton>
                </>
              }
              onClick={() => handleDeletePlane()}
            >
              <ListItemButton role={undefined} dense>
                <ListItemText primary="Vue globale" />
              </ListItemButton>
            </ListItem>

            {drawings.length > 0 &&
              drawings.map((drawing, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  className={
                    index === activeViewIndex ? classes.activePlan : ""
                  }
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
                        // className={
                        //   index === activeViewIndex ? classes.activePlan : ""
                        // }
                        style={{
                          color: index === activeViewIndex ? "#E6464D" : "",
                        }}
                        edge="end"
                        aria-label="comments"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {/* <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeletePlane(drawing, index)}
                    >
                      <CloseIcon />
                    </IconButton> */}
                    </>
                  }
                  onClick={() => handleShowPlane(index)}
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
                      // onClick={() => handleShowPlane(index)}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        )}
      </Grid>
    </Grid>
  );
};

export default DrawingList;
