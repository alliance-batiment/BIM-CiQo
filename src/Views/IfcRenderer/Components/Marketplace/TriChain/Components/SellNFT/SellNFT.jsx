import { useEffect, useState } from 'react'
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
  Divider
} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  marketplaceAddress
} from '../../config'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import {
  Vector2
} from "three";

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
  }
}));


export default function SellNFT({
  state,
  setState
}) {
  const classes = useStyles();
  const [validation, setValidation] = useState({
    loading: false,
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
    X: 0,
    Y: 0,
    Z: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    external_url: '',
    attributes: [],
  });

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleIfcFile = async () => {
    const viewer = state.bimData.viewer;

    // Add IFC File
    const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
    const blobIfc = new Blob([ifcData], { type: 'text/plain' });
    const ifcFile = new File([blobIfc], 'ifcFile.png');

    const ifcFilePath = await client.add(
      ifcFile,
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )

    // Add IFC Img
    const imgCapture = state.bimData.viewer.context.renderer.newScreenshot(
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
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )

    // Add IFC 3D Model
    console.log('viewer.GLTF', viewer.GLTF)
    const ifcGltf = await viewer.GLTF.exportIfcAsGltf(0);
    const ifcModel = await viewer.GLTF.glTFToFile(ifcGltf, 'ifcModel.gltf');

    const ifcModelPath = await client.add(
      ifcModel,
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )


    return {
      file: `https://ipfs.infura.io/ipfs/${ifcFilePath.path}`,
      image: `https://ipfs.infura.io/ipfs/${ifcImgPath.path}`,
      model: `https://ipfs.infura.io/ipfs/${ifcModelPath.path}`,
    };
  }

  const handleLoadActualModel = async () => {
    try {
      setValidation({
        ...validation,
        loading: true
      })
      const {
        file,
        image,
        model
      } = await handleIfcFile();

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
    } catch (error) {
      console.log('Error uploading file: ', error)
      setValidation({
        loading: false,
        status: false,
        message: `Error uploading file: ${error}`
      })
    }
  }

  async function handleLoadNewModel(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
    try {

      // const added = await client.add(
      //   file,
      //   {
      //     progress: (prog) => console.log(`received: ${prog}`)
      //   }
      // )
      const {
        file,
        image
      } = await handleIfcFile();
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log('added', {
        file,
        image
      })
      // setFileUrl(url)

      updateFormInput({
        ...formInput,
        file,
        image
      })
    } catch (error) {
      console.log('Error uploading file: ', error)
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
      file
    } = formInput
    if (!name || !description || !price || !image) {
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
      setState({
        ...state,
        views: {
          ...state.views,
          value: 'home'
        },
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
    const url = await uploadToIPFS()
    // const web3Modal = new Web3Modal({
    //   network: 'mainnet',
    //   cacheProvider: true,
    // })
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    console.log('listingPrice', listingPrice)
    console.log('url', url)
    try {
      let transaction = await contract.createToken(url, price, { value: listingPrice })
      await transaction.wait()
      console.log('transaction', transaction)
    } catch (error) {
      console.log('error', error)
      setValidation({
        loading: false,
        status: false,
        message: `Transaction error: ${error}`
      })
    }

    setValidation({
      ...validation,
      loading: true
    })
    setState({
      ...state,
      views: {
        ...state.views,
        index: 0
      }
    })
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h6" component="div">
          Create NFT:
        </Typography>
      </Grid>
      { !validation.status &&
        <Grid item xs={12}>
          <Alert severity={`error`}>{`${validation.message}`}</Alert>
        </Grid>
      }
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="name"
              label="name"
              className={classes.textField}
              variant="outlined"
              onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Coordinates (Optional)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      id="x"
                      label="x"
                      className={classes.textField}
                      variant="outlined"
                      onChange={e => updateFormInput({ ...formInput, x: e.target.value })} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      id="y"
                      label="y"
                      className={classes.textField}
                      variant="outlined"
                      onChange={e => updateFormInput({ ...formInput, y: e.target.value })} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      id="z"
                      label="z"
                      className={classes.textField}
                      variant="outlined"
                      onChange={e => updateFormInput({ ...formInput, z: e.target.value })} />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
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
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          {validation.loading ?
            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
            </Grid>
            :
            <Grid item xs={12}>
              <Button className={classes.button} onClick={handleLoadActualModel}>Load Actual IFC Model</Button>
            </Grid>
          }
          {/* <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
             Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
              </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </Box> */}
          {/* <Divider />
          <h3>Or</h3>
          <Grid item xs={12}>
            <Input
              type="file"
              name="Load New Model"
              className={classes.button}
              onChange={handleLoadNewModel}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              type="file"
              name="Load file of the model"
              className={classes.button}
              onChange={handleLoadNewModel}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              type="file"
              name="Load png/jpg of the model"
              className={classes.button}
              onChange={handleLoadNewModel}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              type="file"
              name="Load glb/gltf of the model"
              className={classes.button}
              onChange={handleLoadNewModel}
            />
          </Grid> */}
          {
            formInput.image && (
              <img className="rounded mt-4" width="350" src={formInput.image} />
            )
          }
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {validation.loading ?
          <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
          </Grid>
          :
          <Button onClick={listNFTForSale} className={classes.button}>
            Create NFT
        </Button>
        }
      </Grid>
    </Grid>
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