import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, Fab, Typography } from "@material-ui/core";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Button
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
  IFCSTAIR,
  IFCSTAIRFLIGHT,
  IFCRAILING
} from 'web-ifc';
import { ClippingEdges } from 'web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges';
import { Color, LineBasicMaterial, MeshBasicMaterial } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

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
  button: {
    color: "white",
    backgroundColor: 'black',
    width: '100%'
  },
}));

const DrawingList = ({
  viewer,
  setPlans
}) => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeViewIndex, setActiveViewIndex] = useState();

  const classes = useStyles();


  const clippingMaterial = new LineMaterial();
  const subsetMat = new MeshBasicMaterial();


  const sectionedCategories = [
    {
      name: "windows_section",
      style: 'CONTINUOUS',
      color: Drawing.ACI.BLUE,
      value: [IFCWINDOW, IFCPLATE, IFCMEMBER],
      stringValue: ["IFCWINDOW", "IFCPLATE", "IFCMEMBER"],
      material: clippingMaterial
    },
    {
      name: "walls_section",
      style: 'CONTINUOUS',
      color: Drawing.ACI.RED,
      value: [IFCWALL, IFCWALLSTANDARDCASE],
      stringValue: ["IFCWALL", "IFCWALLSTANDARDCASE"],
      material: clippingMaterial
    },
    {
      name: "floors_section",
      style: 'CONTINUOUS',
      color: Drawing.ACI.RED,
      value: [IFCSLAB],
      stringValue: ["IFCSLAB"],
      material: clippingMaterial
    },
    {
      name: "doors_section",
      style: 'CONTINUOUS',
      color: Drawing.ACI.YELLOW,
      value: [IFCDOOR],
      stringValue: ["IFCDOOR"],
      material: clippingMaterial
    },
    {
      name: "furniture_section",
      style: 'CONTINUOUS',
      color: Drawing.ACI.RED,
      value: [IFCFURNISHINGELEMENT],
      stringValue: ["IFCFURNISHINGELEMENT"],
      material: clippingMaterial
    },
    {
      name: "stairs_section",
      style: 'CONTINUOUS',
      color: Drawing.ACI.RED,
      value: [IFCSTAIR, IFCSTAIRFLIGHT],
      stringValue: ["IFCSTAIR", "IFCSTAIRFLIGHT"],
      material: clippingMaterial
    },
  ];

  const projectedCategories = [
    {
      name: "furniture_projection",
      style: 'CONTINUOUS',
      color: Drawing.ACI.CYAN,
      value: [IFCFURNISHINGELEMENT],
      stringValue: ["IFCFURNISHINGELEMENT"],
    },
    {
      name: "general_projection",
      style: 'CONTINUOUS',
      color: Drawing.ACI.CYAN,
      value: [IFCSLAB, IFCWINDOW, IFCDOOR, IFCSTAIRFLIGHT, IFCSTAIR, IFCRAILING, IFCMEMBER],
      stringValue: ["IFCSLAB", "IFCWINDOW", "IFCDOOR", "IFCSTAIRFLIGHT", "IFCSTAIR", "IFCRAILING", "IFCMEMBER"],
    },

  ];



  useEffect(() => {
    let newPlans = [];
    const getDrawings = async () => {
      try {
        setLoading(true);
        // ClippingEdges.createDefaultIfcStyles = false;
        // viewer.dxf.initializeJSDXF(Drawing);
        // const plans = await generateAllFloorPlans1();

        await viewer.plans.computeAllPlanViews(0);
        let newPlans = Object.values(viewer.plans.planLists[0]);

        setDrawings(newPlans);
        setPlans(newPlans);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getDrawings();
  }, []);


  async function generateAllFloorPlans() {
    console.log('coordinates', await viewer.plans.getSiteCoords(0))
    await createClippingLayers();
    await viewer.plans.computeAllPlanViews(0);

    const plans = Object.values(viewer.plans.planLists[0]);
    const ifcProject = await viewer.IFC.getSpatialStructure(0);
    const storeys = ifcProject.children[0].children[0].children;
    for (let storey of storeys) {
      for (let child of storey.children) {
        if (child.children.length) {
          storey.children.push(...child.children);
        }
      }
    }

    console.log('storeys', storeys);

    console.log('plans', plans);

    for (let plan of plans) {
      // Create a new drawing (if it doesn't exist)
      if (!viewer.dxf.drawings[plan.name]) viewer.dxf.newDrawing(plan.name);

      const storey = await storeys.find(storey => storey.expressID === plan.expressID);

      // Draw all projected layers
      for (let category of projectedCategories) {

        // Get the IDs of all the items to draw
        const ids = await storey.children
          .filter(child => category.stringValue.includes(child.type))
          .map(child => child.expressID);

        // If no items to draw in this layer in this floor plan, let's continue
        if (!ids.length) {
          continue;
        }

        // If there are items, extract its geometry
        const subset = await viewer.IFC.loader.ifcManager.createSubset({
          modelID: 0,
          ids,
          removePrevious: true,
          customID: "floor_plan_generation",
          material: subsetMat
        });

        // Get the projection of the items in this floor plan
        const filteredPoints = [];
        const edges = await viewer.edgesProjector.projectEdges(subset);
        const positions = edges.geometry.attributes.position.array;


        // Lines shorter than this won't be rendered
        // https://stackoverflow.com/a/20916980/14627620

        const tolerance = 0.01;
        for (let i = 0; i < positions.length - 5; i += 6) {

          const a = positions[i] - positions[i + 3];
          // Z coords are multiplied by -1 to match DXF Y coordinate
          const b = -positions[i + 2] + positions[i + 5];

          const distance = Math.sqrt(a * a + b * b);

          if (distance > tolerance) {
            filteredPoints.push([positions[i], -positions[i + 2], positions[i + 3], -positions[i + 5]]);
          }

        }

        // Draw the projection of the items
        viewer.dxf.drawEdges(plan.name, filteredPoints, category.name, category.color, category.style);

        // Clean up
        edges.geometry.dispose();

      }

      // Draw all sectioned items
      for (let category of sectionedCategories) {
        viewer.dxf.drawNamedLayer(plan.name, plan, category.name, category.name, category.color, category.style);
      }
    }

    return plans;
  }

  async function createClippingLayers() {
    for (let category of sectionedCategories) {
      await ClippingEdges.newStyle(category.name, category.value, category.material);
    }
  }

  const handleShowPlane = async (drawing, index) => {
    console.log('drawing', drawing);
    // const current = drawings[index];
    // console.log('current', current);

    viewer.plans.goTo(0, `${drawing.expressID}`, false);
  }


  const handleDxfPlane = async (drawing, index) => {

    const result = viewer.dxf.exportDXF(drawing.name);
    const link = document.createElement('a');
    link.download = `${drawing.name}.dxf`;
    link.href = URL.createObjectURL(result);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleAddPlane = async () => {
    await viewer.plans.computeAllPlanViews(0);
    const planNames = Object.keys(viewer.plans.planLists[0]);
    console.log("viewer.plans.planLists", viewer.plans.planLists);
    console.log("viewer.plans.planLists", planNames);
  };

  const handleDeletePlane = async () => {
    setActiveViewIndex();
    await viewer.plans.exitPlanView();
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
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
          </Grid>
        ) : (
          <List className={classes.list} disablePadding>
            <ListItem
              disablePadding
              secondaryAction={
                <>
                  {/* <Button
                    className={classes.button}
                    onClick={() => handleDeletePlane()}
                  >
                    {'3D'}
                  </Button> */}
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    className={classes.button}
                    onClick={() => handleDeletePlane()}>
                    <ViewInArIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemButton role={undefined} dense>
                <ListItemText primary={<Typography gutterBottom variant="h6" component="div">
                  {`Liste des vues des étages:`}
                </Typography>} />
              </ListItemButton>
            </ListItem>
            <hr />
            {/*<Typography gutterBottom variant="h6" component="div">
              {`Liste des vues des étages:`}
            </Typography> */}
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
                        onClick={() => handleShowPlane(drawing)}
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
                      primary={`${drawing.name}`}
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


//   const handleShowPlane = async (index) => {
//     setActiveViewIndex(index);

//     const current = drawings[index];
//     console.log("current", current);
//     viewer.plans.goTo(0, current, true);
//     //viewer.context.items.ifcModels.forEach(model => viewer.edges.toggle(`${model.modelID}`));

//     // viewer.shadowDropper.shadows[0].root.visible = false;
//     // viewer.filler.fills[0].visible = false;
//   };


//   const handleDeletePlane = () => {
//     setActiveViewIndex();
//     viewer.plans.exitPlanView(true);
//   };

//   const handleHideAllPlane = () => {
//     viewer.clipper.active = !viewer.clipper.active;
//     if (!viewer.clipper.active) {
//       viewer.removeClippingPlane();
//     }
//   };

//   const handleRemoveAllPlane = () => {
//     // viewer.clipper.deleteAllPlanes();
//     viewer.clipper.planes = [];
//     setDrawings([]);
//   };
//   return (
//     <Grid container>
//       {/* <Grid item xs={6} style={{ textAlign: 'left' }}>
//             <ButtonGroup
//               className={classes.buttonGroup}
//             >
//               <Button
//                 edge="end"
//                 aria-label="comments"
//                 onClick={handleAddPlane}
//               >
//                 <AddIcon />
//               </Button>
//             </ButtonGroup>
//           </Grid>
//           <Grid item xs={6} style={{ textAlign: 'right' }}>
//             <ButtonGroup
//               className={classes.buttonGroup}
//             >
//               <Button
//                 edge="end"
//                 aria-label="comments"
//                 onClick={handleHideAllPlane}
//               >
//                 <VisibilityIcon />
//               </Button>
//               <Button
//                 edge="end"
//                 aria-label="comments"
//                 onClick={handleRemoveAllPlane}
//               >
//                 <DeleteIcon />
//               </Button>
//             </ButtonGroup>
//           </Grid> */}
//       <Grid item xs={12}>
//         {loading ? (
//           <CircularProgress color="inherit" />
//         ) : (
//           <List className={classes.list} disablePadding>
//             <ListItem
//               disablePadding
//               secondaryAction={
//                 <>
//                   <IconButton edge="end" aria-label="comments">
//                     <LayersClearIcon />
//                   </IconButton>
//                 </>
//               }
//               onClick={() => handleDeletePlane()}
//             >
//               <ListItemButton role={undefined} dense>
//                 <ListItemText primary="Vue globale" />
//               </ListItemButton>
//             </ListItem>

//             {drawings.length > 0 &&
//               drawings.map((drawing, index) => (
//                 <ListItem
//                   key={index}
//                   disablePadding
//                   className={
//                     index === activeViewIndex ? classes.activePlan : ""
//                   }
//                   secondaryAction={
//                     <>
//                       {/* <IconButton
//                       edge="end"
//                       aria-label="comments"
//                       onClick={() => handleDxfPlane(drawing, index)}
//                     >
//                       <DownloadIcon />
//                     </IconButton> */}
//                       <IconButton
//                         // className={
//                         //   index === activeViewIndex ? classes.activePlan : ""
//                         // }
//                         style={{
//                           color: index === activeViewIndex ? "#E6464D" : "",
//                         }}
//                         edge="end"
//                         aria-label="comments"
//                       >
//                         <VisibilityIcon />
//                       </IconButton>
//                       {/* <IconButton
//                       edge="end"
//                       aria-label="comments"
//                       onClick={() => handleDeletePlane(drawing, index)}
//                     >
//                       <CloseIcon />
//                     </IconButton> */}
//                     </>
//                   }
//                   onClick={() => handleShowPlane(index)}
//                 >
//                   <ListItemButton
//                     role={undefined}
//                     dense
//                     //  onClick={() => handleShowElement(ifcClass.eids)}
//                   >
//                     {/* <ListItemIcon>
//                     </ListItemIcon> */}
//                     <ListItemText
//                       id={`checkbox-list-label-${index}`}
//                       primary={`${drawing}`}
//                       // onClick={() => handleShowPlane(index)}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//           </List>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default DrawingList;