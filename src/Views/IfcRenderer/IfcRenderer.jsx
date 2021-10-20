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
import SpatialStructure from './Components/SpatialStructure';
import Properties from './Components/Properties';
import DraggableCard from './Components/DraggableCard';

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
  const [spatialStructure, setSpatialStructure] = useState([]);
  const [element, setElement] = useState(null);
  const [showSpatialStructure, setShowSpatialStructure] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [state, setState] = useState({
    bcfDialogOpen: false,
    loaded: false,
    loadingIfc: false,
    openLeftView: false,
    leftView: 'spatialStructure',
  });

  useEffect(() => {
    async function init() {
      setState({
        ...state,
        loadingIfc: true
      });
      const container = document.getElementById('viewer-container');
      const newViewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
      newViewer.IFC.applyWebIfcConfig({ COORDINATE_TO_ORIGIN: false, USE_FAST_BOOLS: true });
      newViewer.addAxes();
      newViewer.addGrid();
      newViewer.IFC.setWasmPath('../../');

      await newViewer.IFC.loadIfcUrl('https://aryatowers.s3.eu-west-3.amazonaws.com/Pylone+trellis.ifc', true);
      setViewer(newViewer);

      const modelID = await newViewer.IFC.getModelID();

      const spatialStructure = await newViewer.IFC.getSpatialStructure(modelID)
      setSpatialStructure(spatialStructure);

      window.ondblclick = newViewer.addClippingPlane;
      setState({
        ...state, loaded: true, loadingIfc: false
      });
    }
    init();
  }, [])

  const onDrop = async (files) => {
    setState({
      ...state,
      loadingIfc: true
    });
    await viewer.IFC.loadIfc(files[0], true);
    setState({
      ...state, loaded: true, loadingIfc: false
    });
  };

  const select = (modelID, expressID, pick = true) => {
    if (pick) viewer.IFC.pickIfcItemsByID(modelID, expressID);
    setModelID(modelID);
  }

  const handleClick = async () => {
    const found = await viewer.IFC.pickIfcItem(true, 1);

    if (found == null || found == undefined) return;

    select(found.modelID, found.id, false);
    const itemProperties = await viewer.IFC.loader.ifcManager.getItemProperties(found.modelID, found.id);
    const propertySets = await viewer.IFC.loader.ifcManager.getPropertySets(found.modelID, found.id);

    const psets = await Promise.all(propertySets.map(async (pset) => {
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
    }));

    const elem = {
      ...itemProperties,
      modelID: found.modelID,
      psets
    };

    if (elem) {
      setElement(elem);
    }
  }

  const handleToggleClipping = () => {
    viewer.clipper.active = !viewer.clipper.active;
  };

  const handleClickOpen = () => {
    dropzoneRef.current.open();
  };

  const handleShowSpatialStructure = () => {
    setShowSpatialStructure(!showSpatialStructure);
  };

  const handleShowProperties = () => {
    setShowProperties(!showProperties);
  };

  return (
    <>
      <Grid container>
        {showSpatialStructure &&
          <DraggableCard>
            <SpatialStructure
              viewer={viewer}
              spatialStructure={spatialStructure}
              handleShowSpatialStructure={handleShowSpatialStructure}
            />
          </DraggableCard>

        }
        {showProperties &&
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
                <input {...getInputProps()} />
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
        open={state.loadingIfc}
      >
        <CircularProgress />
      </Backdrop>

    </>
  );

}

export default IfcRenderer;
