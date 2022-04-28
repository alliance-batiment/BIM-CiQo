import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal';
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
  CircularProgress
} from "@material-ui/core";
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
  const [formInput, updateFormInput] = useState({ ...state.nfts.value })

  const {
    name,
    image,
    price,
    tokenId,
    tokenURI } = state.nfts.value;

  useEffect(() => {
    fetchNFT()
  }, [tokenId])

  async function fetchNFT() {
    if (!tokenURI) return
    setState({
      ...state,
      loading: true
    })
    console.log('tokenURI', tokenURI);
    console.log('tokenId', tokenId);
    const meta = await axios.get(tokenURI)
    console.log('meta', meta)
    updateFormInput(state => ({ ...state, ...meta.data }))
    setState({
      ...state,
      loading: false
    })
  }

  async function listNFTForSale() {
    if (!formInput.price) return
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(tokenId, priceFormatted, { value: listingPrice })
    await transaction.wait()

    setState({
      ...state,
      views: {
        ...state.views,
        value: 'home'
      }
    });
  }

  const handleBack = async () => {
    setBimData({
      ...state.bimData,
      loading: true
    })
    const viewer = state.bimData.viewer;
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} justify="center">
        <Typography gutterBottom variant="h6" component="div">
          Set a price to your NFT:
        </Typography>
      </Grid>
      {(state.loading) ?
        <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
        </Grid>
        :
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
                  defaultValue={formInput.name}
                // onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
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
                {/* <Typography gutterBottom variant="h5" component="div">
          {nft.name}
        </Typography> */}
                {/* <Typography variant="body2" color="text.secondary">
          {nft.description}
        </Typography> */}



                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Input
                      placeholder="Asset Price in Eth"
                      className={classes.price}
                      onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={handleBack} className={classes.button}>Show</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={listNFTForSale} className={classes.button}>List NFT</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </>
      }
    </Grid >
  )


}