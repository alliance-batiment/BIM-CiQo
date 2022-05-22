import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal';
import {
  Alert
} from "@mui/material";
import {
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
  Input,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardHeader,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fab,
  CircularProgress,
  Chip
} from "@material-ui/core";
import {
  Stack
} from "@mui/material";
import {
  marketplaceAddress
} from '../../config'
import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import axios from 'axios'

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
    // fontWeight: 'bold'
  },
  textField: {
    width: '100%'
  }
}));

export default function ResellNFT({
  state,
  setState,
  setBimData
}) {
  const classes = useStyles()
  const [validation, setValidation] = useState({
    loading: false,
    status: true,
    message: 'Connected',
  })
  const [formInput, updateFormInput] = useState({ ...state.nfts.value })

  const {
    name,
    image,
    price,
    tokenId,
    tokenURI,
    domain,
    levelOfDevelopment,
    phase,
  } = state.nfts.value;

  useEffect(() => {
    fetchNFT()
  }, [tokenId])

  async function fetchNFT() {
    setValidation({
      ...validation,
      loading: true,
      message: 'Get NFT informations...'
    })
    if (!tokenURI) {
      setValidation({
        ...validation,
        loading: true,
        message: 'No NFT founded'
      })
      return
    }
    try {
      console.log('tokenURI', tokenURI);
      console.log('tokenId', tokenId);
      const meta = await axios.get(tokenURI)
      console.log('meta', meta)
      updateFormInput(state => ({ ...state, ...meta.data }))
      setValidation({
        ...validation,
        loading: false
      })
    } catch (error) {
      setValidation({
        ...validation,
        loading: false,
        status: false,
        message: `Error`
      })
    }
  }

  async function listNFTForSale() {
    setValidation({
      ...validation,
      loading: true
    })
    if (!formInput.price) return
    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      setValidation({
        ...validation,
        loading: true,
        message: 'Connection to the wallet...'
      })
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
      let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      let listingPrice = await contract.getListingPrice()
      setValidation({
        ...validation,
        loading: true,
        message: 'Get contract informations...'
      })
      listingPrice = listingPrice.toString()
      let transaction = await contract.resellToken(tokenId, priceFormatted, { value: listingPrice })
      setValidation({
        ...validation,
        loading: true,
        message: 'Transaction pending...'
      })
      await transaction.wait()
      setValidation({
        ...validation,
        loading: false
      })
      setState({
        ...state,
        views: {
          ...state.views,
          value: 'home'
        }
      });
    } catch (error) {
      setValidation({
        ...validation,
        loading: false,
        status: false,
        message: `Transaction canceled`
      })
    }
  }

  const handleShowModel = async () => {
    setBimData({
      ...state.bimData,
      loading: true
    })
    const viewer = state.bimData.viewer;
    console.log('formInput', formInput.file)
    const model = await viewer.IFC.loadIfcUrl(`${formInput.file}`);

    const newSpatialStructure = await viewer.IFC.getSpatialStructure(
      model.modelID,
      true
    );
    // const updateSpatialStructures = [
    //   ...spatialStructures,
    //   newSpatialStructure,
    // ];
    // setSpatialStructures(updateSpatialStructures);

    setBimData({
      ...state.bimData,
      loading: false
    })
    setState({
      ...state,
      views: {
        ...state.views,
        value: 'home'
      }
    });
  }
  const handleGoHome = () => {
    setState({
      ...state,
      views: {
        ...state.views,
        value: 'home'
      }
    });
  }

  return (
    <Grid container spacing={3}>
      { (!validation.status) ?
        <Grid item xs={12}>
          <Alert severity={`${validation.status ? 'success' : 'error'}`}>{`${validation.message}`}</Alert>
        </Grid>
        :
        <>
          {(validation.status && validation.loading) ?
            <>
              <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                <CircularProgress color="inherit" />
              </Grid>
              <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="div">{`${validation.message}`}    </Typography>
              </Grid>
            </>
            :
            <>
              <Grid item xs={12} justify="center">
                <Typography gutterBottom variant="h6" component="div">
                  Set a price to your NFT:
        </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      id="name"
                      label="name"
                      className={classes.textField}
                      variant="outlined"
                      defaultValue={formInput.name}
                    // onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
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
                      defaultValue={formInput.description}
                    // onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      Attributes:
                </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Table size="small" aria-label="a dense table" className={classes.table}>
                      <TableBody>
                        {formInput.domain &&
                          <TableRow
                            key={0}
                          >
                            <TableCell component="th" scope="row" style={{ width: '3em', border: "none" }}>
                              {`Domain : `}
                            </TableCell>
                            <TableCell align="left" style={{ border: "none" }}>
                              <Stack spacing={1} alignItems="left">
                                <Stack direction="row" spacing={1}>
                                  <Chip label={formInput.domain} color="primary" />
                                </Stack>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        }
                        {formInput.levelOfDevelopment &&
                          <TableRow
                            key={1}
                            style={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row" style={{ width: '3em', border: "none" }}>
                              {`LOD :`}
                            </TableCell>
                            <TableCell align="left" style={{ border: "none" }}>
                              <Stack spacing={1} alignItems="left">
                                <Stack direction="row" spacing={1}>
                                  <Chip label={formInput.levelOfDevelopment} color="primary" />
                                </Stack>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        }
                        {formInput.phase &&
                          <TableRow
                            key={2}
                          >
                            <TableCell component="th" scope="row" style={{ width: '3em', border: "none" }}>
                              {`Phase :`}
                            </TableCell>
                            <TableCell align="left" style={{ border: "none" }}>
                              <Stack spacing={1} alignItems="left">
                                <Stack direction="row" spacing={1}>
                                  <Chip label={formInput.phase} color="primary" />
                                </Stack>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        }
                        {/* <TableRow
                      key={3}
                    >
                      <TableCell component="th" scope="row" style={{ width: '3em' }}>
                        {`Materials`}
                      </TableCell>
                      <TableCell align="left">
                        <Stack spacing={1} alignItems="left">
                          <Stack direction="row" spacing={1}>
                            {formInput.materials?.map(material => (
                              <Chip label={material} />
                            ))}
                          </Stack>
                        </Stack>
                      </TableCell>
                    </TableRow> */}
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      id="file"
                      label="file"
                      className={classes.textField}
                      variant="outlined"
                      defaultValue={formInput.file}
                    // onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      id="tokenURI"
                      label="tokenURI"
                      className={classes.textField}
                      variant="outlined"
                      defaultValue={tokenURI}
                    // onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      id="tokenId"
                      label="tokenId"
                      className={classes.textField}
                      variant="outlined"
                      defaultValue={tokenId}
                    // onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Card className={classes.file}>
                  <CardMedia
                    component="img"
                    // height="140"
                    image={formInput.image}
                  // alt={nft.name}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Input
                          placeholder="Asset Price in Eth"
                          className={classes.price}
                          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "center" }}>
                        <Button onClick={handleGoHome} variant="contained" >Home</Button>
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "center" }}>
                        <Button onClick={handleShowModel} variant="contained" color="primary">Show</Button>
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "center" }}>
                        <Button onClick={listNFTForSale} variant="contained" color="primary">Re-Sell NFT</Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </>
          }
        </>
      }
    </Grid >
  )


}