import React, { useEffect, useState, useRef, useCallback } from "react";
import * as WebIFC from "web-ifc";
// import * as WebIFCThree from 'web-ifc-three';
import { IfcViewerAPI } from "web-ifc-viewer";
import Dropzone from "react-dropzone";
import {
  Backdrop,
  makeStyles,
  CircularProgress,
  Fab,
  Grid
} from '@material-ui/core';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import CropIcon from '@material-ui/icons/Crop';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DescriptionIcon from '@material-ui/icons/Description';
import StraightenIcon from '@material-ui/icons/Straighten';
import AppsIcon from '@material-ui/icons/Apps';
import GetAppIcon from '@material-ui/icons/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapIcon from '@mui/icons-material/Map';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import GrainIcon from '@material-ui/icons/Grain';
import StorageIcon from '@material-ui/icons/Storage';
import MutltiSelectionIcon from '@mui/icons-material/ControlPointDuplicate';
import Models from './Components/Models/Models';
import BcfDialog from './Components/BcfDialog/BcfDialog';
import Marketplace from './Components/Marketplace/Marketplace';
import SpatialStructure from './Components/SpatialStructure/SpatialStructure';
import Properties from './Components/Properties/Properties';
import Camera from './Components/Camera/Camera';
import Cuts from './Components/Cuts';
import Drawings from './Components/Drawings/Drawings';
import Measures from './Components/Measures/Measures';
import ContextMenu from './Components/ContextMenu';
import DraggableCard from './Components/DraggableCard/DraggableCard';
import {
  IFCPROJECT,
  IFCSPACE,
  IFCOPENINGELEMENT,
  IFCWALLSTANDARDCASE,
  IFCWALL,
  IFCSTAIR,
  IFCCOLUMN,
  IFCSLAB,
  IFCROOF,
  IFCSTRUCTURALCURVEMEMBER,
  IFCSTRUCTURALANALYSISMODEL,
  IFCSTRUCTURALSURFACEMEMBER,
  IFCFOOTING,
  IFCFURNISHINGELEMENT,
  IFCRELDEFINESBYPROPERTIES,
  IFCPROPERTYSET,
  IFCPROPERTYSINGLEVALUE,
} from "web-ifc";
// import { exportDXF, exportPDF } from './Utils/dxf';
import Drawing from "dxf-writer";
import { jsPDF } from "jspdf";
import {
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  Color,
  DoubleSide,
  MathUtils,
  EdgesGeometry,
  LineBasicMaterial,
  MeshBasicMaterial,
  Vector2
} from 'three';
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";

import { UseIfcRenderer } from "./IfcRenderer.hooks";
import ToolTipsElem from '../../Components/ToolTipsElem/ToolTipsElem.js';
import animationClippedVue from "./Images/animation-vue-de-coupe.gif";
import animationMeasureTool from "./Images/animation-outil-de-mesure.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    spacing: 0,
    justify: "space-around",
    margin: 0,
    padding: 0,
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
    "& .MuiContainer-maxWidthLg": {
      maxWidth: "100%",
    },
  },
  infoLeftPannel: {
    // marginTop: '1em',
    left: "1em",
    position: "absolute",
    zIndex: 100,
  },
  infoRightPannel: {
    // marginTop: '1em',
    right: "1em",
    position: "absolute",
    zIndex: 100,
  },
  fab: {
    margin: "0.5em",
    backgroundColor: "white",
  },
}));

const IfcRenderer = () => {
  const classes = useStyles();
  const dropzoneRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [ifcModels, setIfcModels] = useState([]);
  const [modelID, setModelID] = useState(-1);
  const [transformControls, setTransformControls] = useState(null);
  const [spatialStructures, setSpatialStructures] = useState([]);
  const [element, setElement] = useState(null);
  const [showBcfDialog, setShowBcfDialog] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [showMeasure, setShowMeasure] = useState(true);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showSpatialStructure, setShowSpatialStructure] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showCuts, setShowCuts] = useState(false);
  const [showDrawings, setShowDrawings] = useState(false);
  const [showMeasures, setShowMeasures] = useState(false);
  const [selectedElementID, setSelectedElementID] = useState(null);
  const [specificApplication, setSpecificApplication] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [percentageLoading, setPercentageLoading] = useState(0);
  const [apiWebIfc, setApiWebIfc] = useState();
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [eids, setEids] = useState([]);
  const [subsets, setSubsets] = useState([]);

  const [state, setState] = useState({
    bcfDialogOpen: false,
    loaded: false,
    loadingIfc: false,
    openLeftView: false,
    leftView: "spatialStructure",
  });

  const {
    initIndexDB,
    meshMaterials,
    getModels,
    addTransformControls,
    getElementProperties,
    addElementsNewProperties,
    addGeometryToIfc
  } = UseIfcRenderer({
    eids,
    setEids
  });

  useEffect(() => {
    async function init() {
      const container = document.getElementById("viewer-container");
      const newViewer = new IfcViewerAPI({
        container,
        backgroundColor: new Color(0xffffff),
      });
      // newViewer.addAxes();
      // newViewer.addGrid();
      // newViewer.IFC.setWasmPath('../../');

      const ifcApi = new WebIFC.IfcAPI();
      setApiWebIfc(ifcApi);

      newViewer.IFC.setWasmPath("../../files/");
      // newViewer.IFC.applyWebIfcConfig({
      //   COORDINATE_TO_ORIGIN: true,
      //   USE_FAST_BOOLS: false
      // });
      newViewer.IFC.loader.ifcManager.useWebWorkers(
        true,
        "../../files/IFCWorker.js"
      );

      const db = await initIndexDB();
      const allModels = await getModels(db);
      // console.log('allModels', allModels)
      // const model = await newViewer.IFC.loadIfcUrl(allModels[0].file, false);

      let dimensionsActive = false;
      // addTransformControls(newViewer);

      let counter = 0;
      newViewer.shadowDropper.darkness = 1.5;
      // const handleKeyDown = async (event) => {
      //   if (event.code === "KeyF") {
      //     // viewer.plans.computeAllPlanViews(0);
      //     console.log("KeyF");
      //     console.log("VIEWER", newViewer);
      //     newViewer.plans.computeAllPlanViews(0);
      //   }
      //   if (event.code === 'KeyS') {
      //     const planNames = Object.keys(newViewer.plans.planLists[0]);
      //     if (!planNames[counter]) return;
      //     const current = planNames[counter];
      //     newViewer.plans.goTo(0, current, true);
      //     newViewer.edges.toggle("0");
      //   }
      //   if (event.code === "KeyT") {
      //     // PDF export

      //     const currentPlans = newViewer.plans.planLists[0];
      //     const planNames = Object.keys(currentPlans);
      //     const firstPlan = planNames[0];
      //     const currentPlan = newViewer.plans.planLists[0][firstPlan];

      //     const documentName = "test";
      //     const doc = new jsPDF("p", "mm", [1000, 1000]);
      //     newViewer.pdf.newDocument(documentName, doc, 20);

      //     newViewer.pdf.setLineWidth(documentName, 0.2);
      //     newViewer.pdf.drawNamedLayer(
      //       documentName,
      //       currentPlan,
      //       "thick",
      //       200,
      //       200
      //     );

      //     newViewer.pdf.setLineWidth(documentName, 0.1);
      //     newViewer.pdf.setColor(documentName, new Color(100, 100, 100));

      //     const ids = await newViewer.IFC.getAllItemsOfType(
      //       0,
      //       IFCWALLSTANDARDCASE,
      //       false
      //     );
      //     const subset = newViewer.IFC.loader.ifcManager.createSubset({
      //       modelID: 0,
      //       ids,
      //       removePrevious: true,
      //     });
      //     const edgesGeometry = new EdgesGeometry(subset.geometry);
      //     const vertices = edgesGeometry.attributes.position.array;
      //     newViewer.pdf.draw(documentName, vertices, 200, 200);

      //     newViewer.pdf.drawNamedLayer(
      //       documentName,
      //       currentPlan,
      //       "thin",
      //       200,
      //       200
      //     );

      //     newViewer.pdf.exportPDF(documentName, "test.pdf");
      //   }
      //   if (event.code === 'KeyB') {
      //     const currentPlans = newViewer.plans.planLists[0];
      //     const planNames = Object.keys(currentPlans);
      //     const firstPlan = planNames[0];
      //     const currentPlan = newViewer.plans.planLists[0][firstPlan];
      //     const drawingName = "example";

      //     viewer.dxf.initializeJSDXF(Drawing);

      //     viewer.dxf.newDrawing(drawingName);
      //     // const polygons = viewer.edgesVectorizer.polygons;
      //     // viewer.dxf.drawEdges(drawingName, polygons, 'projection', Drawing.ACI.BLUE );

      //     viewer.dxf.drawNamedLayer(drawingName, currentPlan, 'thick', 'section_thick', Drawing.ACI.RED);
      //     viewer.dxf.drawNamedLayer(drawingName, currentPlan, 'thin', 'section_thin', Drawing.ACI.GREEN);

      //     // const ids = await viewer.IFC.getAllItemsOfType(0, IFCWALLSTANDARDCASE, false);
      //     // const subset = viewer.IFC.loader.ifcManager.createSubset({ modelID: 0, ids, removePrevious: true });
      //     // const edgesGeometry = new EdgesGeometry(subset.geometry);
      //     // const vertices = edgesGeometry.attributes.position.array;
      //     // viewer.dxf.draw(drawingName, vertices, 'other', Drawing.ACI.BLUE);

      //     viewer.dxf.exportDXF(drawingName);

      //   }
      //   if (event.code === 'KeyC') {
      //     // viewer.context.ifcCamera.toggleProjection();
      //     newViewer.shadowDropper.renderShadow(0);
      //   }
      //   if (event.code === "KeyE") {
      //     newViewer.plans.exitPlanView(true);
      //     newViewer.edges.toggle("0");
      //   }
      // };

      // window.onkeydown = handleKeyDown;

      // window.ondblclick = newViewer.clipper.createPlane;

      newViewer.shadowDropper.darkness = 1.5;
      setViewer(newViewer);
    }
    init();
  }, []);

  const onDrop = async (files) => {
    if (files && viewer) {
      setLoading(true);
      // setViewer(null);

      viewer.IFC.loader.ifcManager.setOnProgress((event) => {
        const percentage = Math.floor((event.loaded * 100) / event.total);
        console.log("percentage", percentage);
        setPercentageLoading(percentage);
      });

      viewer.IFC.loader.ifcManager.parser.setupOptionalCategories({
        [IFCSPACE]: false,
        [IFCOPENINGELEMENT]: false,
        [IFCSTRUCTURALANALYSISMODEL]: true,
        [IFCSTRUCTURALSURFACEMEMBER]: true,
        [IFCSTRUCTURALCURVEMEMBER]: true,
      });

      const model = await viewer.IFC.loadIfc(files[0], true, ifcOnLoadError);

      model.material.forEach((mat) => (mat.side = 2));
      console.log("modelID", model.modelID);
      setModelID(model.modelID);

      await createFill(model.modelID);
      const lineMaterial = new LineBasicMaterial({ color: 0x555555 });
      const baseMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });
      viewer.edges.create(
        `${model.modelID}`,
        model.modelID,
        lineMaterial,
        baseMaterial
      );


      const newIfcModels = [...ifcModels, model];
      setIfcModels(newIfcModels);

      await viewer.shadowDropper.renderShadow(model.modelID);

      const newSpatialStructure = await viewer.IFC.getSpatialStructure(
        model.modelID,
        true
      );
      console.log("newSpatialStructure", newSpatialStructure);
      const updateSpatialStructures = [
        ...spatialStructures,
        newSpatialStructure,
      ];
      setSpatialStructures(updateSpatialStructures);
      console.log("updateSpatialStructure", updateSpatialStructures);

      setLoading(false);
    }
  };

  let fills = [];
  async function createFill(modelID) {
    const wallsStandard = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      IFCWALLSTANDARDCASE,
      false
    );
    const walls = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      IFCWALL,
      false
    );
    const stairs = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      IFCSTAIR,
      false
    );
    const columns = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      IFCCOLUMN,
      false
    );
    const roofs = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      IFCROOF,
      false
    );
    const slabs = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      IFCSLAB,
      false
    );
    const ids = [
      ...walls,
      ...wallsStandard,
      ...columns,
      ...stairs,
      ...slabs,
      ...roofs,
    ];
    const material = new MeshBasicMaterial({ color: 0x555555 });
    material.polygonOffset = true;
    material.polygonOffsetFactor = 10;
    material.polygonOffsetUnits = 1;
    fills.push(viewer.filler.create(`${modelID}`, modelID, ids, material));
  }

  const ifcOnLoadError = async (err) => {
    alert(err.toString());
  };

  const select = (viewer, setModelID, modelID, expressID, pick = true) => {
    if (pick) viewer.IFC.pickIfcItemsByID(modelID, expressID);
    setModelID(modelID);
  }

  const handleClick = async () => {
    console.log('viewer.IFC.loader.ifcManager.subsets', viewer.IFC.loader.ifcManager.subsets)
    if (showContextMenu) {
      setShowContextMenu(false);
    }

    const found = await viewer.IFC.pickIfcItem(false, 1);

    if (found == null || found == undefined) {
      await viewer.IFC.unpickIfcItems();
      setEids([]);
      return
    };
    setModelID(found.modelID);
    setEids([found.id]);
    select(viewer, setModelID, found.modelID, found.id, false);
    console.log('found.id', found.id)
    setSelectedElementID(found.id);

    // await getElementProperties({
    //   viewer,
    //   setModelID,
    //   setElement,
    // });
  };

  const handleClickOpen = () => {
    dropzoneRef.current.open();
  };

  const handleShowCuts = () => {
    setShowCuts(!showCuts);
  }

  const handleShowDrawings = () => {
    setShowDrawings(!showDrawings);
  }

  const handleShowMeasures = () => {
    setShowMeasures(!showMeasures);
  }

  const handleShowModels = () => {
    setShowModels(!showModels);
  };

  const handleCapture = () => {
    const link = document.createElement('a');
    link.href = viewer.context.renderer.newScreenshot(false, undefined, new Vector2(4000, 4000));
    const date = new Date();
    link.download = `capture-${date}.jpeg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleMeasure = () => {
    setShowMeasure(!showMeasure);
    let dimensionsActive = false;
    console.log("showMeasure", showMeasure);
    if (showMeasure) {
      dimensionsActive = true;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.IFC.unPrepickIfcItems();
      window.onmousemove = dimensionsActive ? null : viewer.IFC.prePickIfcItem;

      window.onmousedown = () => {
        viewer.dimensions.create();
      };
    } else {
      dimensionsActive = false;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.IFC.unpickIfcItems();
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
        setShowMeasure(false);
        viewer.dimensions.deleteAll();
      }
    };
  };

  const handleShowMarketplace = (specificApp) => {
    setSpecificApplication(specificApp);
    setShowMarketplace(!showMarketplace);
  };

  const handleShowSpatialStructure = () => {
    setShowSpatialStructure(!showSpatialStructure);
  };

  const handleShowProperties = (selectedElemID) => {
    console.log('selectedElemID', selectedElemID)
    if (selectedElemID) {
      setSelectedElementID(selectedElemID);
    }
    setShowProperties(true);
  };

  const handleDownloadIfc = async () => {
    const modelId = modelID ? modelID : 0;

    // EXPORT FICHIER IFC
    const ifcData =
      await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(modelId);
    let ifcDataString = new TextDecoder().decode(ifcData);
    // console.log('IFC STRING', ifcDataString);
    let newIfcDataString = ifcDataString.replace(
      "FILE_NAME('no name', '', (''), (''), 'web-ifc-export');",
      "FILE_NAME('0001','2011-09-07T12:40:02',(''),(''),'Autodesk Revit MEP 2011 - 1.0','20100326_1700 (Solibri IFC Optimizer)','');"
    );
    // console.log('IFC STRING', newIfcDataString);
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(newIfcDataString)
    );
    element.setAttribute("download", "export.ifc");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const handleShowBcfDialog = () => {
    setShowBcfDialog(!showBcfDialog);
    // setState({
    //   ...state,
    //   bcfDialogOpen: true
    // });
  };

  const handleCloseBcfDialog = () => {
    setShowBcfDialog(false);
    // setState({
    //   ...state,
    //   bcfDialogOpen: false
    // });
  };

  const handleShowCamera = () => {
    setShowCamera(!showCamera);
  };

  const handleOpenViewpoint = (viewpoint) => {
    viewer.currentViewpoint = viewpoint;
  };

  const handleRefreshPage = () => {
    window.location.reload();
  }

  return (
    <>
      <Grid container>
        {showModels && (
          <DraggableCard>
            <Models />
          </DraggableCard>
        )}
        {showBcfDialog && (
          <DraggableCard>
            <BcfDialog
              open={showBcfDialog}
              onClose={handleCloseBcfDialog}
              onOpenViewpoint={handleOpenViewpoint}
            />
          </DraggableCard>
        )}
        {(showSpatialStructure) &&
          <DraggableCard width={700} height={600}>
            <SpatialStructure
              viewer={viewer}
              spatialStructures={spatialStructures}
              handleShowSpatialStructure={handleShowSpatialStructure}
              handleShowMarketplace={handleShowMarketplace}
              handleShowProperties={handleShowProperties}
              eids={eids}
              setEids={setEids}
            />
          </DraggableCard>

        }
        {(selectedElementID && showProperties) && (
          <DraggableCard>
            <Properties
              viewer={viewer}
              element={element}
              setShowProperties={setShowProperties}
              selectedElementID={selectedElementID}
              setSelectedElementID={setSelectedElementID}
              handleShowMarketplace={handleShowMarketplace}
              addElementsNewProperties={addElementsNewProperties}
            />
          </DraggableCard>
        )}
        {showMarketplace && (
          <DraggableCard disableDragging={true} width={600} height={600}>
            <Marketplace
              viewer={viewer}
              modelID={modelID}
              handleShowMarketplace={handleShowMarketplace}
              specificApplication={specificApplication}
              setSpecificApplication={setSpecificApplication}
              onDrop={onDrop}
              eids={eids}
              setEids={setEids}
              addElementsNewProperties={addElementsNewProperties}
            />
          </DraggableCard>
        )}
        {showCamera && (
          <DraggableCard>
            <Camera
              viewer={viewer}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
            />
          </DraggableCard>
        )}
        {showCuts && (
          <DraggableCard>
            <Cuts
              viewer={viewer}
              showCuts={showCuts}
              setShowCuts={setShowCuts}
            />
          </DraggableCard>
        )}
        {showDrawings && (
          <DraggableCard>
            <Drawings
              viewer={viewer}
              showDrawings={showDrawings}
              setShowDrawings={setShowDrawings}
            />
          </DraggableCard>
        )}
        {showMeasures && (
          <DraggableCard>
            <Measures
              viewer={viewer}
              showMeasures={showMeasures}
              setShowMeasures={setShowMeasures}
            />
          </DraggableCard>
        )}
        <Grid item xs={2} className={classes.infoLeftPannel}>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Importer IFC"
              placement="right"
              className={classes.fab}
              onClick={handleClickOpen}
            >
              <FolderOpenOutlinedIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Reinitialise la page"
              placement="right"
              className={classes.fab}
              onClick={handleRefreshPage}
            >
              <RefreshIcon />
            </ToolTipsElem>
          </Grid>
          {/* <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowModels}
            >
              <StorageIcon />
            </Fab >
          </Grid >
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowBcfDialog}
            >
              BCF
            </Fab>
          </Grid> */}
          <Grid item xs={12}>
            <ToolTipsElem
              // title={
              //   <div>
              //     <p>
              //       Outil de coupe :
              //       <br />
              //       1. Cliquez sur cet icône
              //       <br />
              //       2. Double-cliquez sur une surface, puis faites glisser les
              //       flèches
              //     </p>
              //     <img src={animationClippedVue} alt="animation" />
              //   </div>
              // }
              title="Coupes"
              placement="right"
              className={classes.fab}
              // onClick={() => {
              //   addGeometryToIfc({
              //     viewer,
              //     modelId: 0
              //   })
              // }}
              onClick={handleShowCuts}
            >
              <CropIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Plans"
              // title={
              //   <div>
              //     <p>
              //       Outil de coupe :
              //       <br />
              //       1. Cliquez sur cet icône
              //       <br />
              //       2. Double-cliquez sur une surface, puis faites glisser les
              //       flèches
              //     </p>
              //     <img src={animationClippedVue} alt="animation" />
              //   </div>
              // }
              placement="right"
              className={classes.fab}
              onClick={handleShowDrawings}
            >
              <MapIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Camera"
              placement="right"
              className={classes.fab}
              onClick={handleShowCamera}
            >
              <ControlCameraIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Outils de mesure"
              // title={
              //   <div>
              //     <p>
              //       Outil de mesure :
              //       <br />
              //       1. Cliquez sur cet icône
              //       <br />
              //       2. Cliquez sur un point de départ de mesure
              //       <br />
              //       3. Cliquez sur un point d'arrivée
              //     </p>
              //     <img src={animationMeasureTool} alt="animation" />
              //   </div>
              // }
              placement="right"
              className={classes.fab}
              onClick={handleShowMeasures}
            // onClick={handleMeasure}
            >
              <StraightenIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Capture d'écran"
              placement="right"
              className={classes.fab}
              onClick={handleCapture}
            >
              <PhotoCameraIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Place de marché"
              placement="right"
              className={classes.fab}
              onClick={() => handleShowMarketplace("home")}
            >
              {/* <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowMarketplace}
            > */}
              <AppsIcon />
              {/* </Fab> */}
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Arborescence du projet"
              placement="right"
              className={classes.fab}
              onClick={handleShowSpatialStructure}
            >
              <AccountTreeIcon />
            </ToolTipsElem>
          </Grid>
          <Grid item xs={12}>
            <ToolTipsElem
              title={
                <p>
                  Propriétés:
                  <br />
                  cliquez sur un objet de votre maquette, puis sur cet icône
                  pour accéder à ses propriétés
                </p>
              }
              placement="right"
              className={classes.fab}
              onClick={() => handleShowProperties()}
            >
              <DescriptionIcon />
            </ToolTipsElem>
          </Grid>
        </Grid>
        <Grid item xs={2} className={classes.infoRightPannel}>
          <Grid item xs={12}>
            <ToolTipsElem
              title="Exporter IFC"
              placement="bottom"
              className={classes.fab}
              onClick={handleDownloadIfc}
            >
              <GetAppIcon />
            </ToolTipsElem>
          </Grid>
          {/* <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowStructuralAnalysis}
            >
              <GrainIcon />
            </Fab >
          </Grid > */}
        </Grid>
        <Grid item xs={10}>
          <div
            id="viewer-container"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: "0",
              top: "0",
            }}
            onClick={handleClick}
          />
          <Dropzone ref={dropzoneRef} onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} accept=".ifc" />
              </div>
            )}
          </Dropzone>
        </Grid>
      </Grid>
      <ContextMenu
        viewer={viewer}
        showContextMenu={showContextMenu}
        meshMaterials={meshMaterials}
        setShowContextMenu={setShowContextMenu}
        setShowProperties={setShowProperties}
        setShowSpatialStructure={setShowSpatialStructure}
        handleShowMarketplace={handleShowMarketplace}
        eids={eids}
        setEids={setEids}
        subsets={subsets}
        setSubsets={setSubsets}
      />
      <Backdrop
        style={{
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          alignContent: "center",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
        {/* {`${percentageLoading} %`} */}
      </Backdrop>
    </>
  );
};

export default IfcRenderer;
