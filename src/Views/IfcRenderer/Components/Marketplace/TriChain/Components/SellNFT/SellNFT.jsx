import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal';
import {
  Alert
} from "@mui/material";
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
  Stepper,
  Step,
  StepLabel
} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  marketplaceAddress
} from '../../config'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  Vector2,
  Color
} from "three";
import LoadFiles from './Components/LoadFiles';
import Location from './Components/Location';
import Attributes from './Components/Attributes';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

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
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));


function getSteps() {
  return ['Load files', 'Location & Geometry', 'Attributes'];
}


export default function SellNFT({
  state,
  setState
}) {
  const classes = useStyles();
  const maxFileSize = 50;
  const [view, setView] = useState('main');

  const [validation, setValidation] = useState({
    loading: false,
    creationLoading: false,
    status: true,
    message: 'Connected',
  })
  const [formInput, updateFormInput] = useState({
    name: '',
    description: '',
    image: null,
    model: null,
    file: null,
    metadataHash: '',
    tokenId: '',
    tokenURI: '',
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    // latitude: 148.9819,
    // longitude: -35.39847,
    latitude: 48.858093,
    longitude: 2.294694,
    altitude: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    external_url: '',
    attributes: [],
    domain: 'architecture',
    domains: [
      { value: 'architecture', label: 'Architecture' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'structural', label: 'Structural' },
      { value: 'mep', label: 'MEP' },
      { value: 'fireAlarm', label: 'Fire Alarm' },
      { value: 'Plumbing', label: 'Plumbing' },
      { value: 'Sprinkler', label: 'Sprinkler' },
      { value: 'HVAC', label: 'HVAC' },
    ],
    levelOfDevelopment: 'lod300',
    levelOfDevelopments: [
      { value: 'lod100', label: 'LOD100' },
      { value: 'lod200', label: 'LOD200' },
      { value: 'lod300', label: 'LOD300' },
      { value: 'lod400', label: 'LOD400' },
      { value: 'lod500', label: 'LOD500' },
    ],
    phase: 'basicProject',
    phases: [
      { value: 'strategy', label: 'PHASE 0 Strategy' },
      { value: 'previousStudies', label: 'PHASE 1 Previous studies' },
      { value: 'blueprint', label: 'PHASE 2 Blueprint' },
      { value: 'basicProject', label: 'PHASE 3 Basic Project' },
      { value: 'executionProject', label: 'PHASE 4 Execution Project' },
      { value: 'construction', label: 'PHASE 5 Construction' },
      { value: 'reception', label: 'PHASE 6 End of Work / Reception' },
      { value: 'maintenance', label: 'PHASE 7 Operation and Maintenance' },
      { value: 'recycling', label: 'PHASE 8 Demolition adn Recycling' },
    ],
    material: ['concrete', 'steel', 'wood', 'aluminium'],
    materials: ['concrete', 'steel', 'wood', 'aluminium'],

    // materialsDB: [
    //   { value: 'concrete', label: 'Concrete' },
    //   { value: 'steel', label: 'Steel' },
    //   { value: 'wood', label: 'Wood' },
    //   { value: 'aluminium', label: 'Aluminium' }
    // ],
  });

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleIfcFile = async ({ ifcFile, viewer }) => {
    try {
      // Add IFC File
      const ifcFilePath = await client.add(
        ifcFile,
        {
          progress: (prog) => {
            setValidation({
              ...validation,
              loading: true,
              message: `Upload IFC in progress...`
            })
          }
        }
      )

      // Add IFC Img
      const imgCapture = await viewer.context.renderer.newScreenshot(
        false,
        undefined,
        new Vector2(4000, 4000)
      );
      var byteString = atob(imgCapture.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blobImg = new Blob([ab], { type: 'image/png' });
      const ifcImg = new File([blobImg], 'ifcImg.png');


      const ifcImgPath = await client.add(
        ifcImg,
        {
          progress: (prog) => {
            setValidation({
              ...validation,
              loading: true,
              message: `Upload generated image in progress...`
            })
          }
        }
      )

      // Add IFC 3D Model
      console.log('viewer.GLTF', viewer.GLTF)
      const ifcGltf = await viewer.GLTF.exportIfcAsGltf(0);
      const ifcModel = await viewer.GLTF.glTFToFile(ifcGltf, 'ifcModel.gltf');

      const ifcModelPath = await client.add(
        ifcModel,
        {
          progress: (prog) => {
            setValidation({
              ...validation,
              loading: true,
              message: `Upload generated 3D model in progress...`
            })
          }
        }
      )


      return {
        file: `https://ipfs.infura.io/ipfs/${ifcFilePath.path}`,
        image: `https://ipfs.infura.io/ipfs/${ifcImgPath.path}`,
        model: `https://ipfs.infura.io/ipfs/${ifcModelPath.path}`,
      };

    } catch (error) {
      alert(error);
    }

  }

  const handleLoadActualModel = async () => {
    try {
      setValidation({
        ...validation,
        loading: true,
        message: 'Connection...'
      })
      const viewer = state.bimData.viewer;
      // Add IFC File
      const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
      const blobIfc = new Blob([ifcData], { type: 'text/plain' });
      const ifcFile = new File([blobIfc], 'ifcFile.ifc');
      if (ifcFile.size / 1024 / 1024 > maxFileSize) {
        setValidation({
          loading: false,
          status: false,
          message: `Maximum file size: ${maxFileSize} Mb`
        })
      } else {
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
    } catch (error) {
      setValidation({
        loading: false,
        status: false,
        message: `Error uploading file: ${error}`
      })
    }
  }

  async function uploadToIPFS() {
    const {
      name,
      description,
      price,
      image,
      file,
      model
    } = formInput
    if (!name || !description || !price || !image || !file || !model) {
      setValidation({
        loading: false,
        status: false,
        message: `Incomplete informations`
      })
      return
    }
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      ...formInput
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log("metadata added", added)
      setState({
        ...state,
        nfts: {
          ...state.nfts,
          value: {
            ...state.nfts.value,
            ...formInput
          }
        }
      })
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
      setValidation({
        loading: false,
        status: false,
        message: `Error uploading file: ${error}`
      })
    }
  }

  async function listNFTForSale() {
    setValidation({
      ...validation,
      loading: true
    })
    try {
      const url = await uploadToIPFS()
      // const web3Modal = new Web3Modal({
      //   network: 'mainnet',
      //   cacheProvider: true,
      // })
      console.log('debut')
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      console.log('signer', signer)
      /* create the NFT */
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      console.log('contract', contract)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()

      console.log('listingPrice', listingPrice)
      console.log('url', url)

      let transaction = await contract.createToken(url, price, { value: listingPrice })
      await transaction.wait()
      console.log('transaction', transaction)
      setValidation({
        ...validation,
        loading: false
      })
      setState({
        ...state,
        views: {
          ...state.views,
          index: 0
        }
      })
    } catch (error) {
      console.log('error', error)
      setValidation({
        loading: false,
        status: false,
        message: `Transaction error: ${error}`
      })
    }
  }


  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  function getStepContent(step) {
    switch (step) {
      case 0:
        return <LoadFiles
          state={state}
          validation={validation}
          formInput={formInput}
          updateFormInput={updateFormInput}
          handleLoadActualModel={handleLoadActualModel}
          handleIfcFile={handleIfcFile}
          setValidation={setValidation}
          maxFileSize={maxFileSize}
        />;
      case 1:
        return <Location
          formInput={formInput}
          updateFormInput={updateFormInput}
          setView={setView}
        />;
      case 2:
        return <Attributes
          validation={validation}
          formInput={formInput}
          updateFormInput={updateFormInput}
          listNFTForSale={listNFTForSale}
          setView={setView}
        />;
      default:
        return 'Unknown step';
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h5" component="div">
          Create NFT:
        </Typography>
      </Grid>
      {!validation.status &&
        <Grid item xs={12}>
          <Alert severity={`error`}>{`${validation.message}`}</Alert>
        </Grid>
      }
      <Grid item xs={12}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      {activeStep === steps.length ? (
        <div>
          <Typography className={classes.instructions}>All steps completed</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      ) : (
        <>
          {getStepContent(activeStep)}
          {
            (!formInput.name || !formInput.description || !formInput.price || !formInput.image || !formInput.file || !formInput.model) ? (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6} style={{ textAlign: "left" }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                  </Button>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    <Button variant="contained" color="primary" onClick={handleNext} disabled={true}>
                      {activeStep === steps.length - 1 ? 'Create NFT' : 'Next'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6} style={{ textAlign: "left" }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                  </Button>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {activeStep !== steps.length - 1 ?
                      <Button variant="contained" color="primary" onClick={handleNext} >
                        {'Next'}
                      </Button>
                      :
                      <>
                        {validation.creationLoading ?
                          <>
                            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                              <CircularProgress color="inherit" />
                            </Grid>
                            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                              <Typography gutterBottom variant="h5" component="div">
                                {`${validation.message}`}
                              </Typography>
                            </Grid>
                          </>
                          :
                          <Button onClick={listNFTForSale} className={classes.button}>
                            Create NFT
          </Button>
                        }

                      </>
                    }
                  </Grid>
                </Grid>
              </Grid>
            )
          }
        </>
      )
      }
      {/* <Grid item xs={12}>
        {validation.creationLoading ?
          <>
            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
            </Grid>
            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="div">
                {`${validation.message}`}
              </Typography>
            </Grid>
          </>
          :
          <Button onClick={listNFTForSale} className={classes.button}>
            Create NFT
          </Button>
        }
      </Grid> */}
    </Grid >
  )
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}