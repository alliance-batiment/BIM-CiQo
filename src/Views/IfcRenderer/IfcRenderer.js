import React, { useEffect, useState, useRef } from 'react';
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
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DescriptionIcon from '@material-ui/icons/Description';
import StraightenIcon from '@material-ui/icons/Straighten';
import SpatialStructure from './Components/SpatialStructure/SpatialStructure';
import Properties from './Components/Properties/Properties';
import DraggableCard from './Components/DraggableCard/DraggableCard';
import { IFCSPACE, IFCSTAIR, IFCCOLUMN, IFCWALLSTANDARDCASE, IFCWALL, IFCSLAB, IFCOPENINGELEMENT } from 'web-ifc';
import { exportDXF } from './Utils/dxf';
import {
  Color
} from 'three';


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
  const [spatialStructure, setSpatialStructure] = useState(null);
  const [element, setElement] = useState(null);
  const [showMeasure, setShowMeasure] = useState(true);
  const [showSpatialStructure, setShowSpatialStructure] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [percentageLoading, setPercentageLoading] = useState(0);


  const [state, setState] = useState({
    bcfDialogOpen: false,
    loaded: false,
    loadingIfc: false,
    openLeftView: false,
    leftView: 'spatialStructure',
  });

  useEffect(() => {
    async function init() {
      const container = document.getElementById('viewer-container');
      const newViewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
      // newViewer.addAxes();
      // newViewer.addGrid();
      // newViewer.IFC.setWasmPath('../../');
      newViewer.IFC.setWasmPath('../../files/');
      // newViewer.IFC.applyWebIfcConfig({
      //   COORDINATE_TO_ORIGIN: true,
      //   USE_FAST_BOOLS: false
      // });
      newViewer.IFC.loader.ifcManager.useWebWorkers(true, '../../files/IFCWorker.js');


      let dimensionsActive = false;

      const handleKeyDown = (event) => {
        if (event.code === 'KeyP') {
          console.log('KeyZ')
          dimensionsActive = !dimensionsActive;
          newViewer.dimensions.active = dimensionsActive;
          newViewer.dimensions.previewActive = dimensionsActive;
          newViewer.IFC.unPrepickIfcItems();
          window.onmousemove = dimensionsActive ?
            null :
            newViewer.IFC.prePickIfcItem;
        }
        if (event.code === 'KeyL') {
          newViewer.dimensions.create();
        }
        if (event.code === 'KeyG') {
          console.log('KeyG')
          newViewer.clipper.createPlane();
        }
        if (event.code === 'KeyT') {
          newViewer.dimensions.deleteAll();
          newViewer.clipper.deletePlane();
          newViewer.IFC.unpickIfcItems();
        }

        // if (event.code === 'KeyD') {
        //   exportDXF();
        //   // const scene = viewer.context.getScene();
        //   // fillSection(scene);
        // }
      };

      window.onkeydown = handleKeyDown;

      window.ondblclick = newViewer.addClippingPlane;

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
        [IFCSPACE]: true,
        [IFCOPENINGELEMENT]: false
      });

      const model = await viewer.IFC.loadIfc(files[0], true, ifcOnLoadError);
      model.material.forEach(mat => mat.side = 2);

      const modelID = await viewer.IFC.getModelID();
      console.log('modelID ', modelID)
      const spatialStructure = await viewer.IFC.getSpatialStructure(0, true);
      setSpatialStructure(spatialStructure);
      console.log('spatialStructure', spatialStructure);
      setLoading(false);
    }
  };

  const ifcOnLoadError = async (err) => {
    alert(err.toString());
  };

  const select = (modelID, expressID, pick = true) => {
    if (pick) viewer.IFC.pickIfcItemsByID(modelID, expressID);
    setModelID(modelID);
  }

  const handleClick = async () => {
    const found = await viewer.IFC.pickIfcItem(true, 1);

    if (found == null || found == undefined) return;

    select(found.modelID, found.id, false);
    const props = await viewer.IFC.getProperties(found.modelID, found.id, false);
    console.log(props);
    const type = await viewer.IFC.loader.ifcManager.getIfcType(found.modelID, found.id);
    console.log(type);
    const itemProperties = await viewer.IFC.loader.ifcManager.getItemProperties(found.modelID, found.id);
    console.log(itemProperties);
    const propertySets = await viewer.IFC.loader.ifcManager.getPropertySets(found.modelID, found.id);
    console.log(propertySets);
    if (propertySets.length > 0) {
      const psets = await Promise.all(propertySets.map(async (pset) => {
        if (pset.HasProperties && pset.HasProperties.length > 0) {
          const newPset = await Promise.all(pset.HasProperties.map(async (property) => {
            const prop = await viewer.IFC.loader.ifcManager.getItemProperties(found.modelID, property.value);
            const label = prop.Name.value;
            const value = prop.NominalValue ? prop.NominalValue.value : null;
            return {
              label,
              value
            }
          }));

          return {
            ...pset,
            HasProperties: [...newPset]
          }
        }
        if (pset.Quantities && pset.Quantities.length > 0) {
          const newPset = await Promise.all(pset.Quantities.map(async (property) => {
            const prop = await viewer.IFC.loader.ifcManager.getItemProperties(found.modelID, property.value);
            const label = prop.Name.value;
            const value = prop.NominalValue ? prop.NominalValue.value : null;
            return {
              label,
              value
            }
          }));

          return {
            ...pset,
            HasProperties: [...newPset]
          }
        }
      }));
      const elem = {
        ...itemProperties,
        type: type ? type : 'NO TYPE',
        modelID: found.modelID,
        psets
      };

      if (elem) {
        setElement(elem);
      }
    }
  }

  const handleClickOpen = () => {
    dropzoneRef.current.open();
  };

  const handleToggleClipping = () => {
    viewer.clipper.active = !viewer.clipper.active;
  };


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

  const handleShowSpatialStructure = () => {
    setShowSpatialStructure(!showSpatialStructure);
  };

  const handleShowProperties = () => {
    setShowProperties(!showProperties);
  };

  return (
    <>
      <Grid container>
        {(spatialStructure && showSpatialStructure) &&
          <DraggableCard>
            <SpatialStructure
              viewer={viewer}
              spatialStructure={spatialStructure}
              handleShowSpatialStructure={handleShowSpatialStructure}
            />
          </DraggableCard>

        }
        {(element && showProperties) &&
          <DraggableCard>
            <Properties
              viewer={viewer}
              element={element}
              transformControls={transformControls}
              handleShowProperties={handleShowProperties}
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
