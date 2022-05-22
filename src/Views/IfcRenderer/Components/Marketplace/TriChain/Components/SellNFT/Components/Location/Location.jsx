import { useEffect, useState } from 'react'
import {
  Input,
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Divider,
  Slider,
  Paper
} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MapElem from '../../../../../../../../../Components/MapElem';
import { IfcViewerAPI } from 'web-ifc-viewer';
import {
  Color,
  Camera,
  Scene,
  DirectionalLight,
  WebGLRenderer,
  Matrix4,
  Vector3
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, @typescript-eslint/no-var-requires */
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

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
  application: {
    height: "17em",
  },
  avatar: {
    backgroundColor: "transparent",
    width: theme.spacing(7),
    height: theme.spacing(7),
    padding: "5px",
    borderRadius: "0px",
  },
  root: {
    maxWidth: 345,
    margin: "10px",
    cursor: "pointer",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  fab: {
    backgroundColor: "white",
  },
  button: {
    color: "white",
    backgroundColor: 'black',
    width: '100%'
  },
  price: {
    textAlign: 'center',
    padding: '0.5em',
    backgroundColor: 'lightgray',
    width: '100%',
    fontWeight: 'bold'
  },
  textField: {
    width: '100%',
    border: '1px'
  },
  gltViewer: {
    width: '100%',
    height: '100%'
  },
  mapContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: 400,
  },
  map: {
    width: '100%',
    height: '100%'
  }
}));


export default function Location({
  formInput,
  updateFormInput,
  setView
}) {
  const classes = useStyles();
  const [siteList, setSiteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await setSiteList([{ ...formInput }]);

      // const container = document.getElementById('viewer-nft');
      // const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
      // await viewer.GLTF.loadModel('https://ipfs.infura.io/ipfs/QmdoBKwT8rTPL4YRs6kzwXEBRMHkm9ttVe2FfCos12gnH5');

      mapboxgl.accessToken = 'pk.eyJ1IjoidHJpYXp1ciIsImEiOiJja25qN3VucjkzdmY5MnFwOTh0N2x3azU0In0.qSCTe3UaV9YwBYddKOFPWA';

      const {
        latitude,
        longitude,
        altitude,
        scale,
        translateX,
        translateY,
        translateZ,
        rotateX,
        rotateY,
        rotateZ
      } = formInput


      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        zoom: 18,
        center: [longitude, latitude],
        pitch: 60,
        antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
      });

      const modelOrigin = [longitude, latitude];
      const modelAltitude = altitude;
      const modelRotate = [Math.PI / 2, 0, 0];

      const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      );
      console.log('translateX', translateX)
      console.log('Number(rotateX) * Math.PI / 180', Number(rotateX) * Math.PI / 180)
      // transformation parameters to position, rotate and scale the 3D model onto the map
      const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y + Number(translateY),
        translateZ: modelAsMercatorCoordinate.z + translateZ,
        rotateX: modelRotate[0] + Number(rotateX) * Math.PI / 180,
        rotateY: modelRotate[1] + rotateY * Math.PI / 180,
        rotateZ: modelRotate[2] + rotateZ * Math.PI / 180,
        /* Since the 3D model is in real world meters, a scale transform needs to be
        * applied since the CustomLayerInterface expects units in MercatorCoordinates.
        */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * scale
      };


      const customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
          this.camera = new Camera();
          this.scene = new Scene();

          // create two three.js lights to illuminate the model
          const directionalLight = new DirectionalLight(0xffffff);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          const directionalLight2 = new DirectionalLight(0xffffff);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);

          // use the three.js GLTF loader to add the 3D model to the three.js scene
          const loader = new GLTFLoader();
          loader.load(
            // 'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
            `${formInput.model}`,
            (gltf) => {
              this.scene.add(gltf.scene);
            }, (onProgress) => {
              const progression = onProgress.total > 0 ? onProgress.loaded / onProgress.total * 100 : 0;
              setProgress(progression);
              if (progression === 100) {
                setIsLoading(false)
              } else {
                setIsLoading(true)
              }
              console.log(onProgress);
            }, (onError) => {
              console.log(onError);
            });

          this.map = map;

          // use the Mapbox GL JS map canvas for three.js
          this.renderer = new WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
          });

          this.renderer.autoClear = false;
        },
        render: function (gl, matrix) {
          const rotationX = new Matrix4().makeRotationAxis(
            new Vector3(1, 0, 0),
            modelTransform.rotateX
          );
          const rotationY = new Matrix4().makeRotationAxis(
            new Vector3(0, 1, 0),
            modelTransform.rotateY
          );
          const rotationZ = new Matrix4().makeRotationAxis(
            new Vector3(0, 0, 1),
            modelTransform.rotateZ
          );

          const m = new Matrix4().fromArray(matrix);
          const l = new Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          this.camera.projectionMatrix = m.multiply(l);
          // this.renderer.resetState();
          this.renderer.render(this.scene, this.camera);
          this.map.triggerRepaint();
        }
      };

      map.on('style.load', () => {
        map.addLayer(customLayer, 'waterway-label');
      });

      // const size = {
      //   width: container.innerWidth,
      //   height: container.innerHeight,
      // };
      // const camera = viewer.IFC.context.ifcCamera.activeCamera;
      // const renderer = viewer.IFC.context.renderer.renderer;
      // container.addEventListener("resize", () => {
      //   size.width = container.innerWidth;
      //   size.height = container.innerHeight;
      //   camera.aspect = size.width / size.height;
      //   camera.updateProjectionMatrix();
      //   renderer.setSize(size.width, size.height);
      // });

      setIsLoading(false);
    }
    init();
  }, [formInput])
  return (
    <>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h6" component="div">
          {`Coordinates`}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="div">
              {`GPS Coordinates`}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              id="latitude"
              label="Latitude"
              className={classes.textField}
              variant="outlined"
              defaultValue={formInput.latitude}
              onChange={e => updateFormInput({ ...formInput, latitude: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              id="longitude"
              label="Longitude"
              className={classes.textField}
              variant="outlined"
              defaultValue={formInput.longitude}
              onChange={e => updateFormInput({ ...formInput, longitude: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle1" component="div">
              {`Altitude (m)`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              id="altitude"
              label="Altitude"
              className={classes.textField}
              variant="outlined"
              defaultValue={formInput.altitude}
              onChange={e => updateFormInput({ ...formInput, altitude: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography gutterBottom variant="subtitle1" component="div">
                  {`Modification of the model`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      {`Translate`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      id="X"
                      label="X(m)"
                      className={classes.textField}
                      variant="outlined"
                      value={formInput.translateX}
                      onChange={e => updateFormInput({ ...formInput, translateX: e.target.value })} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      id="Y"
                      label="Y(m)"
                      className={classes.textField}
                      variant="outlined"
                      value={formInput.translateY}
                      onChange={e => updateFormInput({ ...formInput, translateY: e.target.value })} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      id="Z"
                      label="Z(m)"
                      className={classes.textField}
                      variant="outlined"
                      value={formInput.translateZ}
                      onChange={e => updateFormInput({ ...formInput, translateZ: e.target.value })} />
                  </Grid> */}
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      {`Scale`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      id="scale"
                      label="Scale"
                      className={classes.textField}
                      variant="outlined"
                      value={formInput.scale}
                      onChange={e => updateFormInput({ ...formInput, scale: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="body2" component="div">
                      {`Scale factor: 1m => ${formInput.scale}m`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      {`Rotation`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle2" component="div">
                      Rotation around X(°):
                </Typography>
                    <Slider
                      size="small"
                      defaultValue={0}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      min={0}
                      max={360}
                      value={formInput.rotateX}
                      onChangeCommitted={(e, newValue) => updateFormInput({ ...formInput, rotateX: newValue })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle2" component="div">
                      Rotation around Y(°):
                </Typography>
                    <Slider
                      size="small"
                      defaultValue={0}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      min={0}
                      max={360}
                      value={formInput.rotateY}
                      onChangeCommitted={(e, newValue) => updateFormInput({ ...formInput, rotateY: newValue })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle2" component="div">
                      Rotation around Z(°):
                </Typography>
                    <Slider
                      size="small"
                      defaultValue={0}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      min={0}
                      max={360}
                      value={formInput.rotateZ}
                      onChangeCommitted={(e, newValue) => updateFormInput({ ...formInput, rotateZ: newValue })}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.mapContainer}>
          {/* <div id="viewer-nft" className={classes.gltViewer}></div> */}
          <div id="map" className={classes.map}>
            <>
              {isLoading &&
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <CircularProgress color="inherit" style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="div" style={{ textAlign: 'center', position: 'absolute', top: '60%', left: '50%' }}>
                      {`${Math.round(progress)} %`}
                    </Typography>
                  </Grid>
                </Grid>
              }
            </>
          </div>
        </Paper>
      </Grid>
    </>
  )
}
