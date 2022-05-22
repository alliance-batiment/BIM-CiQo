/* pages/my-nfts.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {
  Alert
} from "@mui/material";
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

export default function MyNFTs({
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
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        loadNFTs();
      })
      window.ethereum.on('accountsChanged', () => {
        loadNFTs();
      })
    }
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // const web3Modal = new Web3Modal({
    //   network: "mainnet",
    //   cacheProvider: true,
    // })
    setValidation({
      ...validation,
      loading: true,
      message: 'Connection to the wallet...'
    })
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
      })

      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const { chainId } = await provider.getNetwork()
      setValidation({
        ...validation,
        loading: true,
        message: 'Check blockchain availability...'
      })
      const existingChainId = state.connection.chainIds.find(cId => cId === chainId);
      if (existingChainId) {
        const signer = provider.getSigner()
        setValidation({
          ...validation,
          loading: true,
          message: 'Get contract informations...'
        })
        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        const data = await marketplaceContract.fetchMyNFTs()
        setValidation({
          ...validation,
          loading: true,
          message: 'Get NFTs...'
        })
        const items = await Promise.all(data.map(async i => {
          const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
          console.log('tokenURI', tokenURI)
          const meta = await axios.get(tokenURI)
          console.log('meta', meta)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          console.log('price', price)
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            tokenURI
          }
          return item
        }))
        setState({
          ...state,
          nfts: {
            ...state.nfts,
            list: items
          }
        })
        setValidation({
          ...validation,
          loading: false,
          status: true
        })
        return
      } else {
        setState({
          ...state,
          nfts: {
            ...state.nfts,
            list: []
          }
        })
        setValidation({
          ...validation,
          loading: false,
          status: false,
          message: `Not connected to a correct blockchain.`
        })
      }
    } catch (error) {
      console.log('error', error)
      setValidation({
        ...validation,
        loading: false,
        status: false,
        message: `Contract not found.`
      })

      setState({
        ...state,
        nfts: {
          ...state.nfts,
          list: []
        }
      })
      return
    }
  }

  function listNFT(nft) {
    setState({
      ...state,
      views: {
        ...state.views,
        value: 'resell-nft'
      },
      nfts: {
        ...state.nfts,
        value: {
          ...state.nfts.value,
          tokenId: `${nft.tokenId}`,
          tokenURI: `${nft.tokenURI}`
        }
      }
    })
    // router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  return (
    <Grid container spacing={3}>
      {(!validation.status) &&
        <Grid item xs={12}>
          <Alert severity={`error`}>{`${validation.message}`}</Alert>
        </Grid>
      }
      {(validation.loading) ?
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
        <>
          {(state.nfts.list.length) ?
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
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {nft.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {nft.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" className={classes.price}>
                              {`Price - ${nft.price} Eth`}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Button size="small" onClick={() => listNFT(nft)} className={classes.button}>Get Informations</Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </>
            :
            <>
              <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="div">
                  No NFTs owned
                </Typography>
              </Grid>
            </>
          }
        </>
      }
    </Grid>
  )
}