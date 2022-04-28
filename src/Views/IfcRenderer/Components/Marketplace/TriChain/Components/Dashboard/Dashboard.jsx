/* pages/dashboard.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
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
    color: "black",
    // "&:hover": {
    //   color: "white",
    //   backgroundColor: "black",
    //   cursor: "pointer",
    // },
  },
  price: {
    textAlign: 'center',
    padding: '0.5em',
    backgroundColor: 'lightgray',
    width: '100%',
    // fontWeight: 'bold'
  },
  textField: {
    width: '100%',
    border: '1px'
  }
}));


export default function Dashboard({
  state,
  setState
}) {
  const classes = useStyles();
  const [validation, setValidation] = useState({
    loading: false,
    status: true,
    message: 'Connected',
  })

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // const web3Modal = new Web3Modal({
    //   network: 'mainnet',
    //   cacheProvider: true,
    // })
    setValidation({
      ...validation,
      loading: true
    })

    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      const data = await contract.fetchItemsListed()

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        }
        return item
      }))
      setState({
        ...state,
        loading: false,
        nfts: {
          ...state.nfts,
          list: items
        }
      })
      setValidation({
        ...validation,
        loading: false
      })
    } catch (error) {
      setValidation({
        ...validation,
        loading: false
      })
      return
    }
  }

  return (
    <Grid container spacing={3}>
      {(validation.loading && !state.nfts.list.length) ?
        <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
          {/* <CircularProgress color="inherit" /> */}
          <Typography gutterBottom variant="h5" component="div">
            No NFTs listed
                  </Typography>
        </Grid>
        :
        <>
          <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h5" component="div">
              Items Listed
                  </Typography>
          </Grid>
          {(validation.loading) ?
            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
            </Grid>
            :
            <>
              {state.nfts.list.map((nft, i) => (
                <Grid item xs={4} key={i}>
                  <Card className={classes.file}>
                    <CardActionArea
                    >
                      <CardMedia
                        component="img"
                        height="240"
                        image={nft.image}
                        alt={nft.name}
                      />
                      <CardActions>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" className={classes.price}>
                              {`Price - ${nft.price} Eth`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </>
          }
        </>
      }
    </Grid>
  )
}