import React, { useEffect, useState, useRef, useCallback } from "react";
import * as WebIFC from "web-ifc";
// import * as WebIFCThree from 'web-ifc-three';
import { IfcViewerAPI } from "web-ifc-viewer";
import Dropzone from "react-dropzone";
import {
  Router,
  Switch,
  Route,
  useLocation
} from 'react-router-dom';
import {
  Backdrop,
  makeStyles,
  CircularProgress,
  Fab,
  Grid,
  Paper
} from '@material-ui/core';
import Alert from '@mui/material/Alert';
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
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import GrainIcon from '@material-ui/icons/Grain';
import StorageIcon from '@material-ui/icons/Storage';
import MutltiSelectionIcon from '@mui/icons-material/ControlPointDuplicate';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Models from './Components/Models/Models';
import BcfDialog from './Components/BcfDialog/BcfDialog';
import Marketplace from './Components/Marketplace/Marketplace';
import SpatialStructure from './Components/SpatialStructure/SpatialStructure';
import Properties from './Components/Properties/Properties';
import Camera from './Components/Camera/Camera';
import Validation from './Components/Validation';
import Cuts from './Components/Cuts';
import Drawings from './Components/Drawings/Drawings';
import Measures from './Components/Measures/Measures';
import ContextMenu from './Components/ContextMenu';
import DraggableCard from './Components/DraggableCard/DraggableCard';
import { OrbitControlsGizmo } from "./Utils/OrbitControlsGizmo";
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
  Vector2,
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";

import { UseIfcRenderer } from "./IfcRenderer.hooks";
import ToolTipsElem from "../../Components/ToolTipsElem/ToolTipsElem.js";
import animationClippedVue from "./Images/animation-vue-de-coupe.gif";
import animationMeasureTool from "./Images/animation-outil-de-mesure.gif";
import axios from "axios";

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

const {
  REACT_APP_COMPANY,
  REACT_APP_THIRD_PARTY_API
} = process.env;

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
  const [showValidation, setShowValidation] = useState(false);
  const [selectedElementID, setSelectedElementID] = useState(null);
  const [specificApplication, setSpecificApplication] = useState(false);
  const [percentageLoading, setPercentageLoading] = useState(0);
  const [apiWebIfc, setApiWebIfc] = useState();
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [eids, setEids] = useState([]);
  const [subsets, setSubsets] = useState([]);
  const [apiConnectors, setApiConnectors] = useState({
    AxeoBim: false
  });

  const [state, setState] = useState({
    loading: false,
    alertStatus: true,
    alertMessage: 'Connecté',
    bcfDialogOpen: false,
    loaded: false,
    loadingIfc: false,
    openLeftView: false,
    leftView: "spatialStructure",
    viewer: '',
    models: {
      value: 0,
      list: []
    },
    spatialStructures: {
      value: {},
      list: []
    },
    subsets: {
      value: {},
      list: []
    },
  });

  const {
    initIndexDB,
    meshMaterials,
    getModels,
    addTransformControls,
    getElementProperties,
    addElementsNewProperties,
    addGeometryToIfc,
    editIfcModel,
    handleCheckNetworkStatus,
    handleGetJsonData,
    handleModelValidation
  } = UseIfcRenderer({
    eids,
    setEids,
    state,
    setState
  });

  useEffect(() => {
    async function init() {
      const container = document.getElementById("viewer-container");
      const newViewer = new IfcViewerAPI({
        container,
        backgroundColor: new Color(0xffffff),
      });

      setState({
        ...state,
        viewer: newViewer
      })
      // newViewer.addAxes();
      // newViewer.addGrid();
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

      // const db = await initIndexDB();
      // const allModels = await getModels(db);
      // console.log('allModels', allModels)

      // const model = await newViewer.IFC.loadIfcUrl(allModels[0].file, false);


      // const model = await newViewer.IFC.loadIfcUrl('../../files/Duplex.ifc');
      // const newIfcModels = [...ifcModels, model];
      // setIfcModels(newIfcModels);

      // const models = newViewer.context.items.ifcModels;
      // const pickableModels = newViewer.context.items.pickableIfcModels;

      // const ifcModel = models[0];
      // const scene = ifcModel.parent;
      // const ids = Array.from(
      //   new Set(ifcModel.geometry.attributes.expressID.array)
      // )

      // let subset = newViewer.IFC.loader.ifcManager.createSubset({
      //   modelID: ifcModel.modelID,
      //   ids: ids,
      //   scene,
      //   applyBH: true,
      //   removePrevious: true,
      //   customID: 'ALL MODEL'
      // });

      // let index = pickableModels.indexOf(ifcModel);
      // if (index >= 0) pickableModels.splice(index);
      // index = models.indexOf(ifcModel);
      // if (index >= 0) models.splice(index)

      // scene.remove(model);
      // models.push(subset);

      // console.log('model', model);
      // // pickableModels.push(subset);
      // model.position.set(10, 10, 10)
      // // subset.position.set(10, 10, 10)
      // const newSpatialStructure = await newViewer.IFC.getSpatialStructure(
      //   model.modelID,
      //   true
      // );
      // const updateSpatialStructures = [
      //   ...spatialStructures,
      //   newSpatialStructure,
      // ];
      // setSpatialStructures(updateSpatialStructures);

      newViewer.shadowDropper.darkness = 1.5;
      newViewer.clipper.active = true;
      setViewer(newViewer);

      await handleInitAxeoBim({
        viewer: newViewer
      });

      handleCheckNetworkStatus();
    }
    init();
  }, []);

  const onDrop = async ({ files, viewer }) => {
    if (files && viewer) {
      setState({
        ...state,
        loading: true
      });
      // setViewer(null);
      console.log('MODEL', files[0]);

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

      let model;
      try {
        model = await viewer.IFC.loadIfc(files[0], true, ifcOnLoadError);
      } catch (error) {
        console.log('error:', error)
        return
      }


      // model.material.forEach((mat) => (mat.side = 2));
      // console.log("modelID", model.modelID);
      setModelID(model.modelID);

      // await createFill({ modelID: model.modelID, viewer });
      // const lineMaterial = new LineBasicMaterial({ color: 0x555555 });
      // const baseMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });
      // viewer.edges.create(
      //   `${model.modelID}`,
      //   model.modelID,
      //   lineMaterial,
      //   baseMaterial
      // );

      const newIfcModels = [...ifcModels, model];
      setIfcModels(newIfcModels);

      // model.position.set(10, 10, 10)
      // await viewer.shadowDropper.renderShadow(model.modelID);

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

      setState({
        ...state,
        loading: false,
        spatialStructures: {
          value: { ...newSpatialStructure },
          list: [...updateSpatialStructures]
        }
      });
    }
  };

  let fills = [];
  async function createFill({ modelID, viewer }) {
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

  const handleInitAxeoBim = async ({ viewer }) => {
    // Accès à AxeoBIM
    const query = new URLSearchParams(window.location.search);
    // const decodeQuery = decodeURI(query);
    const code = query.get('code');
    const state = query.get('state');

    if (code && state) {
      setState({
        state,
        loading: true
      });
      const accessToken = sessionStorage.getItem("axeobim_access_token");
      const refreshToken = sessionStorage.getItem("axeobim_refresh_token");
      const {
        idDocument,
        idEnvironnement,
        access_token,
        refresh_token,
        // lock_token,
        file
      } = await handleGetAxeoBimModel({ code, state, accessToken, refreshToken });
      sessionStorage.setItem("axeobim_access_token", access_token);
      sessionStorage.setItem("axeobim_refresh_token", refresh_token);
      // sessionStorage.setItem("axeobim_lock_token", lock_token);
      sessionStorage.setItem("axeobim_id_document", idDocument);
      sessionStorage.setItem("axeobim_id_environnement", idEnvironnement);
      const ifcBlob = new Blob([file], { type: 'text/plain' });
      console.log('ifcBlob', ifcBlob)
      const model = new File([ifcBlob], 'ifcFile');
      console.log('model', model)
      onDrop({ files: [model], viewer });
      setState({
        state,
        loading: false
      });
      setApiConnectors({
        ...apiConnectors,
        AxeoBim: true
      });
    }
  }

  const handleGetAxeoBimModel = async ({ code, state, accessToken, refreshToken }) => {
    try {
      console.log('code', code)
      const resGetModel = await axios({
        method: "post",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/getModel`,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          code,
          state,
          accessToken,
          refreshToken
        }
      })

      const lockToken = sessionStorage.getItem("axeobim_lock_token");
      if (resGetModel.data && !lockToken) {
        const {
          idDocument,
          idEnvironnement,
          access_token,
          refresh_token,
        } = resGetModel.data;
        console.log('LOCK')
        const resLockModel = await axios({
          method: "post",
          url: `${REACT_APP_THIRD_PARTY_API}/axeobim/lockModel`,
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            idDocument,
            idEnvironnement,
            accessToken: access_token,
            refreshToken: refresh_token
          }
        });
        sessionStorage.setItem("axeobim_lock_token", resLockModel.data.lock_token);
      }

      setState({
        ...state,
        alertStatus: true,
        alertMessage: 'Connecté'
      })

      return resGetModel.data;
      // const rawResponse = await fetch(files[0].link);
      // sessionStorage.setItem("axeobim_access_token", res.data.@);
      // sessionStorage.setItem("axeobim_refresh_token", res.data.refresh_token);
      // sessionStorage.setItem("axeobim_token_type", res.data.token_type);
    } catch (err) {
      console.log('err', err);
      setState({
        ...state,
        loading: false,
        alertStatus: false,
        alertMessage: err.response.data.error
      })
    }
  }

  const handleUpdateAxeoBimModel = async () => {
    try {
      const accessToken = sessionStorage.getItem("axeobim_access_token");
      const refreshToken = sessionStorage.getItem("axeobim_refresh_token");
      const lockToken = sessionStorage.getItem("axeobim_lock_token");
      const idDocument = sessionStorage.getItem("axeobim_id_document");
      const idEnvironnement = sessionStorage.getItem("axeobim_id_environnement");
      const res = await axios({
        method: "put",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/updateModel`,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          idDocument,
          idEnvironnement,
          accessToken,
          refreshToken,
          lockToken
        }
      })
      console.log('res.data', res.data);
    } catch (err) {
      console.log('err', err)
    }
  }


  const ifcOnLoadError = async (err) => {
    alert(err.toString());
  };

  const select = (viewer, setModelID, modelID, expressID, pick = true) => {
    if (pick) viewer.IFC.pickIfcItemsByID(modelID, expressID);
    setModelID(modelID);
  };

  const handleClick = async () => {
    console.log(
      "viewer.IFC.loader.ifcManager.subsets",
      viewer.IFC.loader.ifcManager.subsets
    );
    if (showContextMenu) {
      setShowContextMenu(false);
    }

    const found = await viewer.IFC.pickIfcItem(false, 1);

    if (found == null || found == undefined) {
      await viewer.IFC.unpickIfcItems();
      if (eids.length > 0) {
        setEids([]);
      }

      return;
    }
    setModelID(found.modelID);

    console.log("eids ==>", eids);
    if (eids[0] !== found.id) {
      setEids([found.id]);
    }

    select(viewer, setModelID, found.modelID, found.id, false);
    console.log("found.id", found.id);
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
  };

  const handleShowDrawings = () => {
    setShowDrawings(!showDrawings);
  };

  const handleShowMeasures = () => {
    setShowMeasures(!showMeasures);
  };

  const handleShowModels = () => {
    setShowModels(!showModels);
  };

  const handleCapture = () => {
    const link = document.createElement("a");
    link.href = viewer.context.renderer.newScreenshot(
      false,
      undefined,
      new Vector2(4000, 4000)
    );
    const date = new Date();
    link.download = `capture-${date}.jpeg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
    console.log("selectedElemID", selectedElemID);
    if (selectedElemID) {
      setSelectedElementID(selectedElemID);
    }
    setShowProperties(true);
  };

  const handleDownloadIfc = async () => {
    const modelId = modelID ? modelID : 0;
    // EXPORT FICHIER IFC
    const ifcData =
      await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
    console.log('ifcData', ifcData);
    let ifcDataString = new TextDecoder().decode(ifcData);
    // console.log('IFC STRING', ifcDataString);
    let newIfcDataString = ifcDataString.replace(
      "FILE_NAME('no name', '', (''), (''), 'web-ifc-export');",
      "FILE_NAME('0001','2011-09-07T12:40:02',(''),(''),'Autodesk Revit MEP 2011 - 1.0','20100326_1700 (Solibri IFC Optimizer)','');"
    );
    console.log('newIfcDataString', newIfcDataString);
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

  const handleShowValidation = () => {
    setShowValidation(!showValidation);
  };

  const handleOpenViewpoint = (viewpoint) => {
    viewer.currentViewpoint = viewpoint;
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      <Grid container>
        <Grid item xs={2} className={classes.infoLeftPannel}>
          {showMeasures && (
            <DraggableCard>
              <Measures
                viewer={viewer}
                showMeasures={showMeasures}
                setShowMeasures={setShowMeasures}
              />
            </DraggableCard>
          )}
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
          {showSpatialStructure && (
            <DraggableCard width={700} height={600}>
              <SpatialStructure
                state={state}
                setState={setState}
                viewer={viewer}
                spatialStructures={spatialStructures}
                handleShowSpatialStructure={handleShowSpatialStructure}
                handleShowMarketplace={handleShowMarketplace}
                handleShowProperties={handleShowProperties}
                eids={eids}
                setEids={setEids}
              />
            </DraggableCard>
          )}
          {selectedElementID && showProperties && (
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
                bimData={state}
                setBimData={setState}
                viewer={viewer}
                modelID={modelID}
                handleShowMarketplace={handleShowMarketplace}
                specificApplication={specificApplication}
                setSpecificApplication={setSpecificApplication}
                onDrop={onDrop}
                eids={eids}
                setEids={setEids}
                addElementsNewProperties={addElementsNewProperties}
                apiConnectors={apiConnectors}
                setApiConnectors={setApiConnectors}
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
          {showValidation && (
            <DraggableCard>
              <Validation
                bimData={state}
                setBimData={setState}
                showValidation={showValidation}
                setShowValidation={setShowValidation}
              />
            </DraggableCard>
          )}
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
            <ToolTipsElem
              title="Système de validation de l'IFC"
              placement="right"
              className={classes.fab}
              onClick={handleShowValidation}
            >
              <FactCheckIcon />
            </ToolTipsElem>
          </Grid> */}
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
              disabled={!state.alertStatus}
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
            <ToolTipsElem
              title="Exporter IFC"
              placement="bottom"
              className={classes.fab}
              onClick={handleUpdateAxeoBimModel}
            >
              <ArrowCircleUpIcon />
            </ToolTipsElem>
          </Grid> */}
          {/* <Grid item xs={12}>
            <ToolTipsElem
              title="Modifications"
              placement="bottom"
              className={classes.fab}
              onClick={handleModelValidation}
            >
              <StorageIcon />
            </ToolTipsElem>
          </Grid> */}
          {/* <Grid item xs={12}>
            <ToolTipsElem
              title="Exporter IFC"
              placement="bottom"
              className={classes.fab}
              onClick={() => editIfcModel({
                viewer,
                modelId: 0,
                expressIDs: [5498],
                properties: [
                  {
                    property_name: 'Existing property',
                    text_value: 'True',
                    property_definition: 'deeeee',
                    // unit: 'm',
                    ifc_class: 'Pset_WallCommon',
                    ifc_property_name: 'LoadBearing',
                    ifc_factor_multiplicator: '',
                    ifc_type: ''
                  },
                  {
                    property_name: 'Existing Normalized Pset',
                    text_value: 'value',
                    property_definition: 'deeeee',
                    // unit: 'm',
                    ifc_class: 'Pset_WallCommon',
                  },
                  {
                    property_name: 'New Normalized Pset',
                    text_value: 'value',
                    property_definition: 'deeeee',
                    // unit: 'm',
                    ifc_class: 'Pset_Stair'
                  },
                  {
                    property_name: 'New property',
                    text_value: 'value',
                    property_definition: 'deeeee1',
                    // unit: 'm',
                    ifc_class: ''
                  }
                ]
              })}
            >
              <ArrowCircleUpIcon />
            </ToolTipsElem>
          </Grid> */}
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
          <Dropzone ref={dropzoneRef} onDrop={files => onDrop({ files, viewer })}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} accept=".ifc" />
              </div>
            )}
          </Dropzone>
        </Grid>
      </Grid>
      {state.alertStatus ?
        <Alert severity="success" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>{`${state.alertMessage}`}</Alert>
        :
        <Alert severity="error" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>{`${state.alertMessage}`}</Alert>
      }
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
        open={state.loading}
      >
        <CircularProgress color="inherit" />
        {/* {`${percentageLoading} %`} */}
      </Backdrop>
    </>
  );
};

export default IfcRenderer;
