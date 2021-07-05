import React, { useEffect, useState, useRef } from 'react';
import { IfcViewerAPI } from 'web-ifc-viewer';
import Dropzone from 'react-dropzone';
import { Rnd } from 'react-rnd';
import {
  Backdrop,
  makeStyles,
  CircularProgress,
  IconButton,
  Fab,
  Grid,
  Card,
  Checkbox,
  FormControlLabel,
  Avatar,
  CardHeader,
  CardContent,
  CardMedia
} from '@material-ui/core';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import CropIcon from '@material-ui/icons/Crop';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DescriptionIcon from '@material-ui/icons/Description';
import LayersIcon from '@material-ui/icons/Layers';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SpatialStructure from './Components/SpatialStructure';
import Properties from './Components/Properties';


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
  infoPannel: {
    marginTop: '1em',
    left: '1em',
    position: 'absolute',
    zIndex: 100
  },
  fab: {
    margin: '0.5em',
    backgroundColor: 'white'
  },
  cardInfo: {
    // position: 'absolute',
    // marginTop: '1em',
    // left: '5em',
    zIndex: 100,
    width: '100%',
    height: '100%',
  },
  cardContent: {
    height: '90%',
    overflowY: 'auto',    /* Trigger vertical scroll    */
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '0px solid slategrey'
    }
  },
  treeView: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
}));

const style = {
  position: 'absolute',
  marginTop: '1em',
  display: "flex",
  left: '5em',
  alignItems: "center",
  justifyContent: "center",
  // border: "solid 1px #ddd",
  // background: "#f0f0f0",
  zIndex: 100
};


const IfcRenderer = () => {
  const classes = useStyles();
  const dropzoneRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [modelID, setModelID] = useState(-1);
  const [informations, setInformations] = useState(false);
  const [spatialStructure, setSpatialStructure] = useState([]);
  const [element, setElement] = useState(null);
  const [state, setState] = useState({
    bcfDialogOpen: false,
    loaded: false,
    loadingIfc: false,
    openLeftView: false,
    leftView: 'spatialStructure',
    width: 400,
    height: 400,
    x: 50,
    y: 10
  });

  useEffect(() => {
    const container = document.getElementById('viewer-container');
    const newViewer = new IfcViewerAPI({ container });
    newViewer.addAxes();
    newViewer.addGrid();
    newViewer.setWasmPath('../../');

    setViewer(newViewer);
    window.onmousemove = newViewer.prepickIfcItem;
    window.ondblclick = newViewer.addClippingPlane;
  }, [])

  const onDrop = async (files) => {
    setState({
      ...state,
      loadingIfc: true
    });
    await viewer.loadIfc(files[0], true);
    console.log('TREE', viewer.getSpatialStructure(0))
    setSpatialStructure(viewer.getSpatialStructure(0));
    setState({
      ...state, loaded: true, loadingIfc: false
    });
  };

  const select = (modelID, expressID, pick = true) => {
    if (pick) viewer.pickIfcItemByID(modelID, expressID);
    setModelID(modelID);
    //this.onSelectActions.forEach((action) => action(modelID, expressID));
  }



  const handleClick = () => {
    const found = viewer.pickIfcItem();
    console.log('FOUND', found);
    if (found == null || found == undefined) return;
    //select(found.modelID, found.id, false);
    console.log('PROPERTIES', viewer.getProperties(found.modelID, found.id, true));
    const elem = viewer.getProperties(found.modelID, found.id, true);
    if (elem) {
      setElement(viewer.getProperties(found.modelID, found.id, true));
    }

    //const typeList = viewer.getAllItemsOfType(found.modelID, 'IfcWallStandardCase', true);
    //console.log('TYPES LIST', typeList);
  }

  const handleToggleClipping = () => {
    viewer.clipper.active = !viewer.clipper.active;
  };

  const handleClickOpen = () => {
    dropzoneRef.current.open();
  };

  const handleTreeViewOpen = () => {
    setInformations(!informations);
  };


  const handleOpenLeftView = (prop) => {
    setState({
      ...state,
      openLeftView: true,
      leftView: `${prop}`
    });
  };

  const handleOpenBcfDialog = () => {
    setState({
      ...state,
      bcfDialogOpen: true
    });
  };

  const handleCloseBcfDialog = () => {
    setState({
      ...state,
      bcfDialogOpen: false
    });
  };

  const handleOpenViewpoint = (viewpoint) => {
    viewer.currentViewpoint = viewpoint;
  };




  return (
    <>
      <Grid container>
        {/* <BcfDialog
					open={this.state.bcfDialogOpen}
					onClose={this.handleCloseBcfDialog}
					onOpenViewpoint={this.handleOpenViewpoint}
				/> */}
        {informations &&

          <Rnd
            style={style}
            size={{ width: state.width, height: state.height }}
            position={{ x: state.x, y: state.y }}
            onDragStop={(e, d) => {
              setState({ x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setState({
                width: ref.style.width,
                height: ref.style.height,
                ...position
              });
            }}
          >
            {/* {state.leftView === 'spatialStructure' &&
              <SpatialStructure
                viewer={viewer}
                spatialStructure={spatialStructure}
              />
            }
            {state.leftView === 'properties' && */}
            <Properties
              viewer={viewer}
              element={element}
            />
            {/* } */}
          </Rnd>

        }
        <Grid item xs={2} className={classes.infoPannel}>
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
              onClick={handleTreeViewOpen}
            >
              <AccountTreeIcon />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleTreeViewOpen}
            >
              <DescriptionIcon />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleTreeViewOpen}
            >
              <LayersIcon />
            </Fab>
          </Grid>
        </Grid >
        <Grid item xs={10}>
          {/* <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}> */}
          <div
            id='viewer-container'
            style={{ position: 'absolute', height: '100%', width: '100%', left: '0' }}
            onClick={handleClick}
          />
          {/* </div> */}
          <Dropzone ref={dropzoneRef} onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
          {/* </div> */}
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
