import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone';
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
import { Matrix4, Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

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
    height: '100%',
    top: 0,
    left: 0,
  },
  map: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%'
  }
}));

const baseStyle = {
  flex: 1,
  display: 'flex',
  height: '200px',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  width: '100%',
  borderColor: '#ddddd',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer'
};


export default function LoadFiles({
  state,
  validation,
  setValidation,
  formInput,
  updateFormInput,
  handleLoadActualModel,
  handleIfcFile,
  maxFileSize
}) {
  const classes = useStyles();
  const style = useMemo(() => ({
    ...baseStyle
  }), []);

  const [models, setModels] = useState(state.bimData.viewer.context.items.ifcModels);
  const ifcOnLoadError = async (err) => {
    alert(err.toString());
  };

  const handleLoadNewModel = useCallback(async (acceptedFiles) => {
    try {
      setValidation({
        ...validation,
        loading: true
      })
      const formData = new FormData();
      formData.append('files', acceptedFiles[0]);
      console.log('', acceptedFiles[0])
      if (acceptedFiles.length > 0) {
        if (acceptedFiles[0].size / 1024 / 1024 > maxFileSize) {
          setValidation({
            loading: false,
            status: false,
            message: `Maximum file size: ${maxFileSize} Mb`
          })
        } else {
          // const container = document.getElementById('viewer-nft');
          // const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
          // viewer.IFC.setWasmPath("../../files/");
          const viewer = state.bimData.viewer;
          const uploadModel = await viewer.IFC.loadIfc(acceptedFiles[0], true, ifcOnLoadError);
          const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
          const blobIfc = new Blob([ifcData], { type: 'text/plain' });
          const ifcFile = new File([blobIfc], 'ifcFile.ifc');

          const {
            file,
            image,
            model
          } = await handleIfcFile({ ifcFile, viewer });
          console.log('added', {
            file,
            image,
            model
          })
          updateFormInput({
            ...formInput,
            file,
            image,
            model
          });
          setValidation({
            ...validation,
            loading: false
          })
        }
      }
    } catch (error) {
      setValidation({
        loading: false,
        status: false,
        message: `Error uploading file: ${error}`
      })
    }
  }, [formInput])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleLoadNewModel, accept: '.ifc' })

  return (
    <>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="name"
              label="name"
              className={classes.textField}
              variant="outlined"
              onChange={e => {
                updateFormInput({ ...formInput, name: e.target.value })
                console.log('formInput', { ...formInput, name: e.target.value })
              }}
              helperText="Name can not be empty"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="description"
              label="description"
              multiline
              rows={4}
              className={classes.textField}
              variant="outlined"
              onChange={e => updateFormInput({ ...formInput, description: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              id="price"
              label="price in ETH"
              className={classes.textField}
              variant="outlined"
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
              helperText="Price can not be empty or equal to 0"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          {(validation.loading) ?
            <>
              <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                <CircularProgress color="inherit" />
              </Grid>
              <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {`${validation.message}`}
                </Typography>
              </Grid>
            </>
            :
            <>
              {(!formInput.model) &&
                <>
                  {models.length > 0 ?
                    <>
                      <Grid item xs={12}>
                        <Button
                          className={classes.button} onClick={handleLoadActualModel}>Load Actual IFC Model</Button>
                      </Grid>
                      {/* <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Typography gutterBottom variant="subtitle1" component="div">
                          {`--- Or ---`}
                        </Typography>
                      </Grid> */}
                    </>
                    :
                    // <Grid item xs={12} style={{ textAlign: 'center' }}>
                    //   <Typography gutterBottom variant="subtitle1" component="div">
                    //     {`No IFC model`}
                    //   </Typography>
                    // </Grid>
                    <Grid item xs={12} align="center" justify="center" alignItems="center">
                      <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        {
                          isDragActive ?
                            <p>Import IFC file</p> :
                            <p>Import IFC file</p>
                        }
                      </div>
                    </Grid>
                  }
                  {/* <Grid item xs={12} align="center" justify="center" alignItems="center">
                    <div {...getRootProps({ style })}>
                      <input {...getInputProps()} />
                      {
                        isDragActive ?
                          <p>Import IFC file</p> :
                          <p>Import IFC file</p>
                      }
                    </div>
                  </Grid> */}
                </>
              }
            </>
          }
          {/* <Grid item xs={12} align="center" justify="center" alignItems="center">
            <div className={classes.map}>
              <div id="viewer-nft" className={classes.gltViewer}></div>
            </div>
          </Grid> */}
          {
            formInput.image && (
              <img className={classes.image} src={formInput.image} />
            )
          }
        </Grid>
      </Grid>
    </>
  )
}
