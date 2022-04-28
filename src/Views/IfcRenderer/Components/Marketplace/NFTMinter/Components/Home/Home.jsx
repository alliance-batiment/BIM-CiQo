import React, { useEffect, useState } from "react";
import {
  Alert
} from "@mui/material";
import {
  Typography,
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
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardMedia,
  Badge,
  Fab,
  TextField,
  CircularProgress,
  Button
} from "@material-ui/core";
import SearchBar from "../../../../../../../Components/SearchBar";
import { useMoralis } from 'react-moralis';
import {
  Vector2
} from "three";

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
}));

const {
  REACT_APP_THIRD_PARTY_API,
  REACT_APP_MORALIS_APPLICATION_ID,
  REACT_APP_MORALIS_SERVER_URL
} = process.env;

const Home = ({
  state,
  setState
}) => {
  const classes = useStyles();

  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();
  const [ifcImg, setIfcImg] = useState('https://ipfs.moralis.io:2053/ipfs/Qme9vKxXj1ym3BnTJUXwKjbBmUL7Cv9mYHTri6Y3izxVKr');

  useEffect(() => {
    const init = async () => {
      await Moralis.start({
        serverUrl: REACT_APP_MORALIS_SERVER_URL,
        appId: REACT_APP_MORALIS_APPLICATION_ID
      });
      let user = Moralis.User.current();
      console.log('user', user);
      console.log('isAuthenticated', isAuthenticated)
      if (!user) {
        try {
          user = await Moralis.authenticate({ signingMessage: 'Hello World' });
          setState({
            ...state,
            loading: false
          })
        } catch (error) {
          console.log(error);
        }
      } else {
        await Moralis.enableWeb3();
        setState({
          ...state,
          loading: false
        })
      }
    }
    init();
    // if (isAuthenticated) {
    //   setState({
    //     ...state,
    //     loading: false
    //   })
    // }
  }, []);

  // if (!isAuthenticated) {
  //   return (
  //     <div>
  //       <button onClick={() => authenticate()}>Authenticate</button>
  //     </div>
  //   );
  // }

  const handleChangeValue = (e, key) => {
    setState({
      ...state,
      nft: {
        ...state.nft,
        [key]: e.target.value
      }
    })
  }

  const handleCreateNFT = async (e) => {
    const viewer = state.bimData.viewer;
    const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);

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
    console.log('imageHash', imageHash);
    const blobImg = new Blob([ab], { type: 'image/png' });
    const data = new File([blobImg], 'ifcImg.png')
    console.log('data', data);
    const imageFile = new Moralis.File(data.name, data)
    await imageFile.saveIPFS();
    console.log('imageFile IPFS', imageFile.ipfs());
    let imageHash = imageFile.hash();
    setIfcImg(`${imageFile.ipfs()}`);
    console.log('imageHash', imageHash);

    let metadata = {
      name: state.nft.name,
      description: state.nft.description,
      image: `/ipfs/${imageHash}`
    }

    const jsonFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
    await jsonFile.saveIPFS();
    let metadataHash = jsonFile.hash();

    setState({
      ...state,
      nft: {
        ...state.nft,
        metadataHash: `/ipfs/${metadataHash}`
      }
    })
  }

  const handleAddInRarible = async (e) => {

    try {
      let res = await Moralis.Plugins.rarible.lazyMint({
        chain: 'rinkeby',
        userAddress: user.get('ethAddress'),
        tokenType: 'ERC721',
        tokenUri: `ipfs://${state.nft.metadataHash}`,
        royaltiesAmount: 5, // 0.05% royalty. Optional
      });

      let {
        tokenAddress,
        tokenId
      } = res.data.result;
      setState({
        ...state,
        nft: {
          ...state.nft,
          rarible: {
            ...state.nft.rarible,
            tokenAddress,
            tokenId
          }
        }
      });
      e.preventDefault();
      var a = document.createElement('a');
      a.target = "_blank";
      a.href = `https://rinkeby.rarible.com/token/${tokenAddress}:${tokenId}`;
      a.click();
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <Grid container spacing={3}>
      {state.loading ?
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
        :
        <>
          <div>
            <h1>Welcome {user.get("username")}</h1>
          </div>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="name"
              onChange={(e) => handleChangeValue(e, 'name')} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="description"
              onChange={(e) => handleChangeValue(e, 'description')} />
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.button}
              onClick={handleCreateNFT}
            >
              Create NFT
        </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.button}
              onClick={handleAddInRarible}
            >
              Rarible
        </Button>
            <a href={`https://rinkeby.rarible.com/token/${state.nft.rarible.tokenAddress}:${state.nft.rarible.tokenId}`} target="_blank">Rarible</a>
          </Grid>
          <Grid item xs={12}>
            <Card className={classes.file}>
              <CardActionArea
              >
                <CardMedia
                  component="img"
                  image={ifcImg}
                  alt={"hello"}
                />
              </CardActionArea>
            </Card>
          </Grid>
        </>
      }
    </Grid>
  );
};

export default Home;
