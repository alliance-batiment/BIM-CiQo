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
  Badge,
  Fab,
} from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DatBimApi from "./DatBimApi/DatBimApi";
import DropBox from "./DropBox/DropBox";
import BsDD from "./BsDD";
import AxeoBim from "./AxeoBim";
import Web3 from "./Web3";
import TriStructure from "./TriStructure";
import DropboxChooser from "react-dropbox-chooser";
import OpenDthxLogo from "./img/OpenDthxLogo.png";
import DropBoxLogo from "./img/DropBoxLogo.png";
import GoogleDriveLogo from "./img/GoogleDriveLogo.png";
import BsDDLogo from "./img/bsDDLogo.png";
import AxeoBimLogo from "./img/AxeoBimLogo.jpeg";
import IpfsLogo from "./img/IpfsLogo.png";
import TriStructureLogo from "./img/TriStructureLogo.png";

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
    color: "#E6464D",
    "&:hover": {
      color: "white",
      backgroundColor: "#E6464D",
      cursor: "pointer",
    },
  },
}));

const applications = [
  {
    name: "Open dthX",
    img: OpenDthxLogo,
    type: "data",
    description: "Base de données permettant l'enrichissement de la maquette",
  },
  {
    name: "DropBox",
    img: DropBoxLogo,
    type: "storage",
    description: "Espace permettant le partage et le stockage de fichier",
  },
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
  {
    name: 'AxeoBIM',
    img: AxeoBimLogo,
    type: 'storage',
    tags: ['Coming Soon'],
    description: 'Espace permettant le partage et le stockage de fichier'
  },
  // {
  //   name: 'bsDD',
  //   img: BsDDLogo,
  //   type: 'data',
  //   tags: ['Coming Soon'],
  //   description: 'Espace permettant le partage et le stockage de fichier'
  // },
  // {
  //   name: 'Web3',
  //   img: IpfsLogo,
  //   type: 'Storage & Validation',
  //   tags: ['Coming Soon'],
  //   description: 'Espace permettant le partage et le stockage de fichier de manière décentralisée'
  // },
];

const { REACT_APP_DROPBOX_APP_KEY } = process.env;

const Marketplace = ({
  viewer,
  modelID,
  handleShowMarketplace,
  eids,
  setEids,
  onDrop,
  addElementsNewProperties,
  specificApplication,
  apiConnectors,
  setApiConnectors
}) => {
  const classes = useStyles();
  const [selectedApp, setSelectedApp] = useState("home");
  const [anchorEl, setAnchorEl] = useState(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log("apiConnectors", apiConnectors)
    if (specificApplication) {
      setSelectedApp(specificApplication);
    } else {
      setSelectedApp("home");
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleSuccess(files) {
    // setUrl(files[0].thumbnailLink);
    const rawResponse = await fetch(files[0].link);
    const result = await rawResponse.text();
    const ifcBlob = new Blob([result], { type: "text/plain" });
    const file = new File([ifcBlob], "ifcFile");
    onDrop([file]);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card className={classes.cardInfo}>
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
              className={classes.button}
              onClick={handleClick}
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
            {applications.map((application) => (
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
        {(selectedApp === "AxeoBIM") && (
          <>
            {apiConnectors[selectedApp] ?
              <AxeoBim
                viewer={viewer}
                modelID={modelID}
                eids={eids}
                setEids={setEids}
                addElementsNewProperties={addElementsNewProperties}
                handleShowMarketplace={handleShowMarketplace}
                setSelectedApp={setSelectedApp}
              />
              :
              <Alert severity="warning">La maquette doit provenir d'AxeoBIM pour activer cette application</Alert>
            }
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