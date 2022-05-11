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
import { set } from 'immutable';

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
  card: {
    width: '100%',
    height: "350px"
    // width: '320px',
    // height: '415px'
  },
  media: {
    height: '170px',
    //paddingTop: "56.25%", // 16:9
    // height: 'auto',
    // maxHeight: '250px',
    // width: 'auto',
    // maxWidth: '250px'
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
  }
}));



export default function Home({
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
    //   window.ethereum.request({
    //     method: "wallet_addEthereumChain",
    //     params: [{
    //         chainId: "0x89",
    //         rpcUrls: ["https://rpc-mainnet.matic.network/"],
    //         chainName: "Matic Mainnet",
    //         nativeCurrency: {
    //             name: "MATIC",
    //             symbol: "MATIC",
    //             decimals: 18
    //         },
    //         blockExplorerUrls: ["https://polygonscan.com/"]
    //     }]
    // });
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        console.log('HELLo')
        loadNFTs();
      })
      window.ethereum.on('accountsChanged', () => {
        loadNFTs();
      })
    }
    loadNFTs()
  }, [])

  async function loadNFTs() {
    setValidation({
      ...validation,
      loading: true,
      message: 'Connection to the wallet...'
    })
    /* create a generic provider and query for unsold market items */
    // const provider = await new ethers.providers.JsonRpcProvider(state.connection.provider);
    const web3Modal = new Web3Modal()

    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const { chainId } = await provider.getNetwork()
    const existingChainId = state.connection.chainIds.find(cId => cId === chainId);
    setValidation({
      ...validation,
      loading: true,
      message: 'Check blockchain availability...'
    })
    if (provider && existingChainId) {
      let contract;
      let data;
      let error;
      try {
        contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
        setValidation({
          ...validation,
          loading: true,
          message: 'Get market items...'
        })
        data = await contract.fetchMarketItems()
        /*
     *  map over items returned from smart contract and format 
     *  them as well as fetch their token metadata
   */

        const items = await Promise.all(data.map(async i => {
          const tokenUri = await contract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          }
          return item
        }))
        setValidation({
          ...validation,
          loading: false
        })
        setState({
          ...state,
          nfts: {
            ...state.nfts,
            list: items
          }
        })
      } catch (error) {
        setValidation({
          ...validation,
          loading: false,
          status: false,
          message: `Not connected to a blockchain`
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

    } else {
      setValidation({
        ...validation,
        loading: false,
        status: false,
        message: `Not connected to a blockchain`
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

  async function buyNft(nft) {
    setValidation({
      ...validation,
      loading: true
    })
    try {
      /* needs the user to sign the transaction, so will use Web3Provider and sign it */
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      setValidation({
        ...validation,
        loading: true,
        message: 'Connection to the wallet...'
      })
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      setValidation({
        ...validation,
        loading: true,
        message: 'Get contract informations...'
      })
      /* user will be prompted to pay the asking proces to complete the transaction */
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price
      })
      setValidation({
        ...validation,
        loading: true,
        message: 'Transaction pending...'
      })
      await transaction.wait()
      setValidation({
        ...validation,
        loading: true,
        message: 'Transaction validated...'
      })
      loadNFTs()
      setValidation({
        ...validation,
        loading: false
      })
    } catch (error) {
      setValidation({
        ...validation,
        loading: false,
        status: false,
        message: `Transaction canceled`
      })
    }
  }

  return (
    <Grid container spacing={3}>
      { (!validation.status) ?
        <Grid item xs={12}>
          <Alert severity={`${validation.status ? 'success' : 'error'}`}>{`${validation.message}`}</Alert>
        </Grid>
        : <>
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
              {state.nfts?.list?.length === 0 &&
                <Grid item xs={12}>
                  {/* <Alert severity={`warning`}>{`No`}</Alert> */}
                  <Typography gutterBottom variant="h6" component="div">
                    No NFTs in the Marketplace on this blockchain. Please go on <a href='https://polygon.technology/' target='_blank'>Polygon</a>.
                    </Typography>
                </Grid>
              }
              {state.nfts.list.map((nft, i) => (
                <Grid item xs={6} key={i}>
                  <Card>
                    <CardActionArea
                    >
                      <CardContent
                        className={classes.cardContentMedia}
                      >
                        <CardMedia
                          component="img"
                          // className={classes.media}
                          height="240"
                          image={nft.image}
                          alt={nft.name}
                        />
                      </CardContent>
                      <CardContent
                        className={classes.cardContentMedia}
                      >
                        <Typography gutterBottom variant="h5" component="div">
                          {nft.name}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
                      {nft.description}
                    </Typography> */}
                      </CardContent>
                      <CardActions>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" className={classes.price}>
                              {`${nft.price} ETH`}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Button onClick={() => buyNft(nft)} className={classes.button}>Get Model</Button>
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
