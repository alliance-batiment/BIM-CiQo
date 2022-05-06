import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
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
  Badge,
  Fab,
} from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DatBimApi from "./DatBimApi/DatBimApi";
import DropBox from "./DropBox/DropBox";
import BsDD from "./BsDD";
import AxeoBim from "./AxeoBim";
import Web3 from "./Web3";
import NFTMinter from "./NFTMinter";
import TriChain from "./TriChain";
import TriStructure from "./TriStructure";
import DropboxChooser from "react-dropbox-chooser";
import OpenDthxLogo from "./img/OpenDthxLogo.png";
import DropBoxLogo from "./img/DropBoxLogo.png";
import GoogleDriveLogo from "./img/GoogleDriveLogo.png";
import OneDriveLogo from "./img/OneDriveLogo.png";
import BsDDLogo from "./img/bsDDLogo.png";
import AxeoBimLogo from "./img/AxeoBimLogo.jpeg";
import IpfsLogo from "./img/IpfsLogo.png";
import TriChainLogo from "./img/TriChainLogo.png";
import TriSensorsLogo from "./img/TriSensorsLogo.png";
import TriStructureLogo from "./img/TriStructureLogo.png";
import SearchBar from "../../../../Components/SearchBar";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardExpanded: {
    position: "absolute",
    top: "0px",
    zIndex: 1000,
    left: "0px",
    right: "0px",
    opacity: "0.95",
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175,
  },
  card: {
    position: "absolute",
    top: "0px",
    zIndex: 100,
    left: "0px",
    right: "0px",
    opacity: "0.95",
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175,
  },
  cardContent: {
    opacity: "0.95",
    height: "85%",
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

const applications = [
  {
    name: "Open dthX",
    img: OpenDthxLogo,
    type: "data",
    description: "Base de données permettant l'enrichissement de la maquette",
  },
  // {
  //   name: "DropBox",
  //   img: DropBoxLogo,
  //   type: "storage",
  //   description: "Espace permettant le partage et le stockage de fichier",
  // },
  // {
  //   name: 'TriStructure',
  //   img: TriStructureLogo,
  //   type: 'structural analysis',
  //   tags: ['Coming Soon'],
  //   description: "Application permettant la génération d'un modèle analytique pour du calcul de structure"
  // },
  // {
  //   name: 'Google Drive',
  //   img: GoogleDriveLogo,
  //   type: 'storage',
  //   tags: ['Coming Soon'],
  //   description: 'Espace permettant le partage et le stockage de fichier'
  // },
<<<<<<< HEAD
  {
    name: "AxeoBIM",
    img: AxeoBimLogo,
    type: "storage",
    tags: ["Coming Soon"],
    description: "Espace permettant le partage et le stockage de fichier",
  },
=======
  // {
  //   name: 'AxeoBIM',
  //   img: AxeoBimLogo,
  //   type: 'storage',
  //   tags: ['Coming Soon'],
  //   description: 'Espace permettant le partage et le stockage de fichier'
  // },
>>>>>>> a2bb4ee9 (save)
  // {
  //   name: 'bsDD',
  //   img: BsDDLogo,
  //   type: 'data',
  //   tags: ['Coming Soon'],
  //   description: "The buildingSMART Data Dictionary (bSDD) is an online service that hosts classifications and their properties, allowed values, units and translations"
  // },
  // {
  //   name: 'Web3',
  //   img: IpfsLogo,
  //   type: 'Storage & Validation',
  //   tags: ['Coming Soon'],
  //   description: 'Espace permettant le partage et le stockage de fichier de manière décentralisée'
  // },
  // {
  //   name: 'NFT Minter',
  //   img: IpfsLogo,
  //   type: 'NFT',
  //   tags: ['Coming Soon'],
  //   description: 'Application permettant de minter un NFT de sa maquette'
  // },
  // {
  //   name: 'TriChain',
  //   img: TriChainLogo,
  //   type: 'storage & blockchain',
  //   tags: ['Coming Soon'],
  //   description: "Marketplace décentralisée permettant de stocker et d'échanger des NFT pour le BIM"
  // },
  // {
  //   name: 'TriSensors',
  //   img: TriSensorsLogo,
  //   type: 'iot',
  //   tags: ['Coming Soon'],
  //   description: "Gestion de capteurs IOT connectés à la maquette"
  // },
  // {
  //   name: 'OneDrive',
  //   img: OneDriveLogo,
  //   type: 'storage',
  //   tags: ['Coming Soon'],
  //   description: 'Espace permettant le partage et le stockage de fichier'
  // },
];

const { REACT_APP_DROPBOX_APP_KEY } = process.env;

const Marketplace = ({
  bimData,
  setBimData,
  viewer,
  modelID,
  handleShowMarketplace,
  eids,
  setEids,
  onDrop,
  addElementsNewProperties,
  specificApplication,
  apiConnectors,
  setApiConnectors,
}) => {
  const [selectedApp, setSelectedApp] = useState("home");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [url, setUrl] = useState("");
  const [expandedView, setExpandedView] = useState(false);
  const [viewWidth, setViewWidth] = useState("100%");
  const [viewHeight, setViewHeight] = useState("100%");

  useEffect(() => {
    console.log("apiConnectors", apiConnectors);
    setFilteredData(applications);
    if (specificApplication) {
      setSelectedApp(specificApplication);
    } else {
      setSelectedApp("home");
    }
  }, []);

  const props = {
    width: viewWidth,
    height: viewHeight,
  };

  const classes = useStyles(props);

  useEffect(() => {
    const getWidth = () => window.innerWidth - 175;
    const getHeight = () => window.innerHeight - 175;
    const resizeListener = () => {
      if (!expandedView) {
        setViewWidth(getWidth());
        setViewHeight(getHeight());
      }
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const handleExpandView = (e) => {
    const width = window.innerWidth - 175;
    const height = window.innerHeight - 175;

    if (!expandedView) {
      setExpandedView(true);
      setViewWidth(width);
      setViewHeight(height);
      setAnchorEl(null);
    } else if (expandedView) {
      setExpandedView(false);
      setViewWidth("100%");
      setViewHeight("100%");
      setAnchorEl(null);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchData = (input) => {
    const dataList = [...applications];
    if (dataList && dataList.length > 0) {
      const newFilteredData = dataList.filter((data) => {
        const searchResult = `${data.name} ${data.type} ${data.description}`
          .toLowerCase()
          .includes(input.toLowerCase());
        return searchResult;
      });
      setSearchInput(input);
      setFilteredData(newFilteredData);
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card className={expandedView ? classes.cardExpanded : classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <Fab
              size="small"
              className={classes.fab}
              onClick={handleShowMarketplace}
            >
              <AppsIcon />
            </Fab>
          </Avatar>
        }
        action={
          <div>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleExpandView}
              size="small"
            >
              {expandedView ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleShowMarketplace}
              size="small"
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              className={classes.button}
              onClick={handleClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {/* <ListItem
                button
                onClick={handleShowElement}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="Visibility" />
              </ListItem> */}
              <ListItem button onClick={handleShowMarketplace}>
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Fermer" />
              </ListItem>
            </Popover>
          </div>
        }
        title={`Place de marché`}
        subheader={`Liste des applications BIM`}
      />
      <CardContent className={classes.cardContent}>
        {selectedApp === "home" && (
          <Grid container spacing={3}>
            {filteredData?.length >= 0 && (
              <>
                <Grid item xs={12}>
                  <SearchBar
                    input={searchInput}
                    onChange={handleSearchData}
                    placeholder="Key words"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>{`Number of results: ${filteredData.length}`}</Typography>
                </Grid>
              </>
            )}
            {filteredData?.map((application) => (
              <Grid item xs={4}>
                <Card className={classes.application}>
                  <CardActionArea
                    onClick={() => {
                      // if (application.name === 'Dropbox') {
                      //   viewer.openDropboxWindow();
                      // } else {
                      setSelectedApp(application.name);
                      // }
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label="recipe"
                          className={classes.avatar}
                          src={application.img}
                          alt={application.name}
                          title={application.name}
                        />
                      }
                      title={application.name}
                      subheader={
                        <Badge color="success" pill>
                          {application.type}
                        </Badge>
                      }
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {application.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {selectedApp === "Open dthX" && (
          <DatBimApi
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
          />
        )}
        {selectedApp === "AxeoBIM" && (
          <>
            {/* {apiConnectors[selectedApp] ? */}
            <AxeoBim
              viewer={viewer}
              modelID={modelID}
              eids={eids}
              setEids={setEids}
              addElementsNewProperties={addElementsNewProperties}
              handleShowMarketplace={handleShowMarketplace}
              setSelectedApp={setSelectedApp}
            />
            {/* :
              <Alert severity="warning">La maquette doit provenir d'AxeoBIM pour activer cette application</Alert>
            } */}
          </>
        )}
        {selectedApp === "DropBox" && (
          <DropBox viewer={viewer} onDrop={onDrop} />
        )}
        {selectedApp === "bsDD" && (
          <BsDD
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
          />
        )}
        {selectedApp === "Web3" && (
          <Web3
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
          />
        )}
        {selectedApp === "NFT Minter" && (
          <NFTMinter
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
          />
        )}
        {selectedApp === "TriChain" && (
          <TriChain
            bimData={bimData}
            setBimData={setBimData}
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
          />
        )}
        {selectedApp === "TriStructure" && (
          <TriStructure
            viewer={viewer}
            modelID={modelID}
            eids={eids}
            setEids={setEids}
            addElementsNewProperties={addElementsNewProperties}
            handleShowMarketplace={handleShowMarketplace}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Marketplace;
