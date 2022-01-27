import React, { useEffect, useState, useRef } from 'react';
import * as WebIFC from 'web-ifc';
// import * as WebIFCThree from 'web-ifc-three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import Dropzone from 'react-dropzone';
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
import GrainIcon from '@material-ui/icons/Grain';
import StorageIcon from '@material-ui/icons/Storage';
import Models from './Components/Models/Models';
import BcfDialog from './Components/BcfDialog/BcfDialog';
import Marketplace from './Components/Marketplace/Marketplace';
import SpatialStructure from './Components/SpatialStructure/SpatialStructure';
import Properties from './Components/Properties/Properties';
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
  IFCPROPERTYSINGLEVALUE
} from 'web-ifc';
// import { exportDXF, exportPDF } from './Utils/dxf';
import Drawing from 'dxf-writer';
import { jsPDF } from 'jspdf';
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
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';

import { UseIfcRenderer } from './IfcRenderer.hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    spacing: 0,
    justify: 'space-around',
    margin: 0,
    padding: 0,
    flexGrow: 1,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      backgroundColor: 'white'
    },
    '& .MuiContainer-maxWidthLg': {
      maxWidth: '100%'
    },
  },
  infoLeftPannel: {
    // marginTop: '1em',
    left: '1em',
    position: 'absolute',
    zIndex: 100
  },
  infoRightPannel: {
    // marginTop: '1em',
    right: '1em',
    position: 'absolute',
    zIndex: 100
  },
  fab: {
    margin: '0.5em',
    backgroundColor: 'white'
  }
}));

const IfcRenderer = () => {
  const classes = useStyles();
  const dropzoneRef = useRef(null);
  const [viewer, setViewer] = useState(null);
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
  const [isLoading, setLoading] = useState(false);
  const [percentageLoading, setPercentageLoading] = useState(0);
  const [apiWebIfc, setApiWebIfc] = useState();
  const [eid, setEid] = useState(1);
  const [eids, setEids] = useState([]);

  const [state, setState] = useState({
    bcfDialogOpen: false,
    loaded: false,
    loadingIfc: false,
    openLeftView: false,
    leftView: 'spatialStructure',
  });

  const {
    initIndexDB,
    getModels,
    addTransformControls,
    getElementProperties,
    addElementsNewProperties
  } = UseIfcRenderer({
    eids,
    setEids
  });

  useEffect(() => {
    async function init() {
      const container = document.getElementById('viewer-container');
      const newViewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
      // newViewer.addAxes();
      // newViewer.addGrid();
      // newViewer.IFC.setWasmPath('../../');

      const ifcApi = new WebIFC.IfcAPI();
      setApiWebIfc(ifcApi);


      newViewer.IFC.setWasmPath('../../files/');
      // newViewer.IFC.applyWebIfcConfig({
      //   COORDINATE_TO_ORIGIN: true,
      //   USE_FAST_BOOLS: false
      // });
      newViewer.IFC.loader.ifcManager.useWebWorkers(true, '../../files/IFCWorker.js');



      const db = await initIndexDB();
      const allModels = await getModels(db);
      // console.log('allModels', allModels)
      // const model = await newViewer.IFC.loadIfcUrl(allModels[0].file, false);

      let dimensionsActive = false;
      // addTransformControls(newViewer);


      let counter = 0;
      newViewer.shadowDropper.darkness = 1.5;
      const handleKeyDown = async (event) => {
        if (event.code === 'KeyF') {
          // viewer.plans.computeAllPlanViews(0);
          console.log('KeyF')
          console.log('VIEWER', newViewer)
          newViewer.plans.computeAllPlanViews(0);
        }
        if (event.code === 'KeyS') {
          const planNames = Object.keys(newViewer.plans.planLists[0]);
          if (!planNames[counter]) return;
          const current = planNames[counter];
          newViewer.plans.goTo(0, current, true);
          newViewer.edges.toggle('0');
        }
        if (event.code === 'KeyT') {
          // PDF export

          const currentPlans = newViewer.plans.planLists[0];
          const planNames = Object.keys(currentPlans);
          const firstPlan = planNames[0];
          const currentPlan = newViewer.plans.planLists[0][firstPlan];

          const documentName = 'test';
          const doc = new jsPDF('p', 'mm', [1000, 1000]);
          newViewer.pdf.newDocument(documentName, doc, 20);

          newViewer.pdf.setLineWidth(documentName, 0.2);
          newViewer.pdf.drawNamedLayer(documentName, currentPlan, 'thick', 200, 200);

          newViewer.pdf.setLineWidth(documentName, 0.1);
          newViewer.pdf.setColor(documentName, new Color(100, 100, 100));

          const ids = await newViewer.IFC.getAllItemsOfType(0, IFCWALLSTANDARDCASE, false);
          const subset = newViewer.IFC.loader.ifcManager.createSubset({ modelID: 0, ids, removePrevious: true });
          const edgesGeometry = new EdgesGeometry(subset.geometry);
          const vertices = edgesGeometry.attributes.position.array;
          newViewer.pdf.draw(documentName, vertices, 200, 200);

          newViewer.pdf.drawNamedLayer(documentName, currentPlan, 'thin', 200, 200);

          newViewer.pdf.exportPDF(documentName, 'test.pdf');
        }
        if (event.code === 'KeyB') {
          const currentPlans = newViewer.plans.planLists[0];
          const planNames = Object.keys(currentPlans);
          const firstPlan = planNames[0];
          const currentPlan = newViewer.plans.planLists[0][firstPlan];
          const drawingName = "example";

          viewer.dxf.initializeJSDXF(Drawing);

          viewer.dxf.newDrawing(drawingName);
          // const polygons = viewer.edgesVectorizer.polygons;
          // viewer.dxf.drawEdges(drawingName, polygons, 'projection', Drawing.ACI.BLUE );

          viewer.dxf.drawNamedLayer(drawingName, currentPlan, 'thick', 'section_thick', Drawing.ACI.RED);
          viewer.dxf.drawNamedLayer(drawingName, currentPlan, 'thin', 'section_thin', Drawing.ACI.GREEN);

          // const ids = await viewer.IFC.getAllItemsOfType(0, IFCWALLSTANDARDCASE, false);
          // const subset = viewer.IFC.loader.ifcManager.createSubset({ modelID: 0, ids, removePrevious: true });
          // const edgesGeometry = new EdgesGeometry(subset.geometry);
          // const vertices = edgesGeometry.attributes.position.array;
          // viewer.dxf.draw(drawingName, vertices, 'other', Drawing.ACI.BLUE);

          viewer.dxf.exportDXF(drawingName);

        }
        if (event.code === 'KeyC') {
          // viewer.context.ifcCamera.toggleProjection();
          newViewer.shadowDropper.renderShadow(0);
        }
        if (event.code === 'KeyE') {
          newViewer.plans.exitPlanView(true);
          newViewer.edges.toggle('0');
        }
      };

      window.onkeydown = handleKeyDown;

      window.ondblclick = newViewer.addClippingPlane;

      newViewer.shadowDropper.darkness = 1.5;
      setViewer(newViewer);
    }
    init();
  }, [])

  const onDrop = async (files) => {
    if (files && viewer) {
      setLoading(true);
      // setViewer(null);

      viewer.IFC.loader.ifcManager.setOnProgress((event) => {
        const percentage = Math.floor((event.loaded * 100) / event.total);
        console.log('percentage', percentage)
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
      model.material.forEach(mat => mat.side = 2);
      console.log('modelID', model.modelID);
      setModelID(model.modelID);

      await createFill(model.modelID);
      const lineMaterial = new LineBasicMaterial({ color: 0x555555 });
      const baseMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });
      viewer.edges.create(`${model.modelID}`, model.modelID, lineMaterial, baseMaterial);

      await viewer.shadowDropper.renderShadow(model.modelID);

      const newSpatialStructure = await viewer.IFC.getSpatialStructure(model.modelID, true);
      console.log('newSpatialStructure', newSpatialStructure);
      const updateSpatialStructures = [...spatialStructures, newSpatialStructure];
      setSpatialStructures(updateSpatialStructures);
      console.log('updateSpatialStructure', updateSpatialStructures);
      setLoading(false);
    }
  };

  let fills = [];
  async function createFill(modelID) {
    const wallsStandard = await viewer.IFC.loader.ifcManager.getAllItemsOfType(modelID, IFCWALLSTANDARDCASE, false);
    const walls = await viewer.IFC.loader.ifcManager.getAllItemsOfType(modelID, IFCWALL, false);
    const stairs = await viewer.IFC.loader.ifcManager.getAllItemsOfType(modelID, IFCSTAIR, false);
    const columns = await viewer.IFC.loader.ifcManager.getAllItemsOfType(modelID, IFCCOLUMN, false);
    const roofs = await viewer.IFC.loader.ifcManager.getAllItemsOfType(modelID, IFCROOF, false);
    const slabs = await viewer.IFC.loader.ifcManager.getAllItemsOfType(modelID, IFCSLAB, false);
    const ids = [...walls, ...wallsStandard, ...columns, ...stairs, ...slabs, ...roofs];
    const material = new MeshBasicMaterial({ color: 0x555555 });
    material.polygonOffset = true;
    material.polygonOffsetFactor = 10;
    material.polygonOffsetUnits = 1;
    fills.push(viewer.filler.create(`${modelID}`, modelID, ids, material));
  }


  const ifcOnLoadError = async (err) => {
    alert(err.toString());
  };

  const handleClick = async () => {
    await getElementProperties({
      viewer,
      setModelID,
      setElement
    })
  }

  const handleClickOpen = () => {
    dropzoneRef.current.open();
  };

  const handleToggleClipping = () => {
    viewer.clipper.active = !viewer.clipper.active;
  };


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
    console.log('showMeasure', showMeasure)
    if (showMeasure) {
      dimensionsActive = true;
      viewer.dimensions.active = dimensionsActive;
      viewer.dimensions.previewActive = dimensionsActive;
      viewer.IFC.unPrepickIfcItems();
      window.onmousemove = dimensionsActive ?
        null :
        viewer.IFC.prePickIfcItem;

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
      if (event.code === 'Escape') {
        viewer.dimensions.cancelDrawing();
      }
      if (event.code === 'Delete' || event.code === 'Backspace' || event.code === 'keyD') {
        setShowMeasure(false);
        viewer.dimensions.deleteAll();
      }
    };
  }

  const handleShowMarketplace = () => {
    setShowMarketplace(!showMarketplace);
  };

  const handleShowSpatialStructure = () => {
    setShowSpatialStructure(!showSpatialStructure);
  };

  const handleShowProperties = () => {
    setShowProperties(!showProperties);
  };

  const handleDownloadIfc = async () => {
    const modelId = modelID ? modelID : 0;

    // EXPORT FICHIER IFC
    const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(modelId);
    let ifcDataString = new TextDecoder().decode(ifcData);
    // console.log('IFC STRING', ifcDataString);
    let newIfcDataString = ifcDataString.replace("FILE_NAME('no name', '', (''), (''), 'web-ifc-export');", "FILE_NAME('0001','2011-09-07T12:40:02',(''),(''),'Autodesk Revit MEP 2011 - 1.0','20100326_1700 (Solibri IFC Optimizer)','');");
    // console.log('IFC STRING', newIfcDataString);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(newIfcDataString));
    element.setAttribute('download', "export.ifc");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


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

  const handleOpenViewpoint = (viewpoint) => {
    viewer.currentViewpoint = viewpoint;
  };

  return (
    <>
      <Grid container>
        {(showModels) &&
          <DraggableCard>
            <Models />
          </DraggableCard>

        }
        {showBcfDialog &&
          <DraggableCard>
            <BcfDialog
              open={showBcfDialog}
              onClose={handleCloseBcfDialog}
              onOpenViewpoint={handleOpenViewpoint}
            />
          </DraggableCard>
        }
        {(spatialStructures && spatialStructures.length > 0 && showSpatialStructure) &&
          <DraggableCard>
            <SpatialStructure
              viewer={viewer}
              spatialStructures={spatialStructures}
              handleShowSpatialStructure={handleShowSpatialStructure}
              eids={eids}
              setEids={setEids}
            />
          </DraggableCard>

        }
        {(element && showProperties) &&
          <DraggableCard>
            <Properties
              viewer={viewer}
              element={element}
              handleShowProperties={handleShowProperties}
              addElementsNewProperties={addElementsNewProperties}
            />
          </DraggableCard>
        }
        {(showMarketplace) &&
          <DraggableCard
            disableDragging={true}
            width={600}
            height={600}
          >
            <Marketplace
              viewer={viewer}
              modelID={modelID}
              handleShowMarketplace={handleShowMarketplace}
              eids={eids}
              setEids={setEids}
              addElementsNewProperties={addElementsNewProperties}
            />
          </DraggableCard>
        }
        <Grid item xs={2} className={classes.infoLeftPannel}>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleClickOpen}
            >
              <FolderOpenOutlinedIcon />
            </Fab >
          </Grid >
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
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleToggleClipping}
            >
              <CropIcon />
            </Fab>

          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleMeasure}
            >
              <StraightenIcon />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleCapture}
            >
              <PhotoCameraIcon />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowMarketplace}
            >
              <AppsIcon />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowSpatialStructure}
            >
              <AccountTreeIcon />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowProperties}
            >
              <DescriptionIcon />
            </Fab>
          </Grid>
        </Grid >
        <Grid item xs={2} className={classes.infoRightPannel}>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleDownloadIfc}
            >
              <GetAppIcon />
            </Fab >
          </Grid >
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
            id='viewer-container'
            style={{ position: 'absolute', height: '100%', width: '100%', left: '0', top: '0' }}
            onClick={handleClick}
          />
          <Dropzone ref={dropzoneRef} onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} accept='.ifc' />
              </div>
            )}
          </Dropzone>
        </Grid>
      </Grid >
      <Backdrop
        style={{
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          alignContent: "center"
        }}
        open={isLoading}
      >
        <CircularProgress color='inherit' />
        {/* {`${percentageLoading} %`} */}
      </Backdrop>

    </>
  );

}

export default IfcRenderer;
