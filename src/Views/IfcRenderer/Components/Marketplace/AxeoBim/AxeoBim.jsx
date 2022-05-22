import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Tabs,
  Tab,
  Chip,
  ListItemButton,
  Grid,
  Button,
  ButtonGroup,
  Divider
} from "@mui/material";
import ToolTipsElem from '../../../../../Components/ToolTipsElem/ToolTipsElem';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";
import Check from "@material-ui/icons/Check";
import axios from "axios";
import OAuth2Login from 'react-simple-oauth2-login';
import OpenDthxLogo from './img/OpenDthxLogo.png';
import { UseAxeoBim } from './AxeoBim.hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  button: {
    backgroundColor: "#E6464D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E6464D",
      color: "white",
    },
    "&:disabled": {
      opacity: 0.8,
      color: "white",
    },
  },
  navigationBar: {
    margin: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDatBim: {
    width: "50%",
    height: "70%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "hidden scroll",
    position: "relative",
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
  },
  datBimTitle: {
    textAlign: "center",
    // color: '#E6464D',
    textTransform: "none",
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  datBimFooterCard: {
    display: "block",
    textAlign: "right",
  },
  datBimCardButton: {
    textAlign: "right",
    color: "white",
  },
  accordionDetails: {
    display: "block",
  },
  datBimIcon: {
    width: "3em",
  },
}));


const {
  REACT_APP_THIRD_PARTY_API
} = process.env;

const AxeoBim = ({
  openProperties,
  projectId,
  objSelected,
  viewer,
  modelID,
  eids,
  setEids,
  addElementsNewProperties,
  handleShowMarketplace,
  setSelectedApp
}) => {
  const classes = useStyles();

  const {
    locked,
    setLocked,
    apiInformation,
    setApiInformation,
    handleLockProject,
    handleUnlockProject,
    handleUpdateProject
  } = UseAxeoBim({
    viewer
  });

  useEffect(() => {
    async function init() {
      const lockToken = sessionStorage.getItem("axeobim_lock_token");
      console.log('lockToekn', lockToken)
      if (!lockToken || lockToken === "") {
        setLocked(false);
      } else {
        setLocked(true);
      }
    }
    init();
  }, []);

  return (
    <Grid container spacing={1}>
      {/* <OAuth2Login
        authorizationUrl="https://app.axxone.fr/system_aplus/api/oauth/authorize"
        // authorizationUrl={`${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/authorize`}
        responseType="code"
        clientId="JTy0XiRuehb19eJK7j5PbTon0Ukps2HA"
        redirectUri="http://localhost:3000"
        scope="workflow files:read projects:read"
        onSuccess={handleOauthLoginOnSuccess}
        onFailure={handleOauthLoginOnFailure} /> */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" component="h3">
          Modèle BIM en cours de traitement:
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <List sx={{ width: "100%", backgroundColor: '#1890ff', color: 'white', borderRadius: '1em' }}>
          <ListItem
            key={0}
            secondaryAction={
              <>
                {locked ?
                  <>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={(e) => setSelectedApp('Open dthX')}
                    >
                      <AddIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={(e) => {
                        handleUnlockProject();
                        // e.stopPropagation();
                      }}
                    >
                      <LockIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={handleUpdateProject}
                    >
                      <FileUploadIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </>
                  :
                  <ToolTipsElem
                    title={
                      <p>
                        AxeoBIM:
                  <br />
                  cliquez ici pour bloquer la maquette dans AxeoBIM et permettre son enrichissement
                </p>
                    }
                    placement="top"
                    // className={classes.fab}
                    onClick={(e) => {
                      handleLockProject()
                      // e.stopPropagation();
                    }}
                  >
                    {/* <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={(e) => {
                        handleLockProject()
                        // e.stopPropagation();
                      }}
                    > */}
                    <LockOpenIcon sx={{ color: 'white' }} />
                    {/* </IconButton> */}
                  </ToolTipsElem>
                }
                {/* <IconButton
                  edge="end"
                  aria-label="comments"
                // onClick={() => handleRemoveElement(element)}
                >
                  <CloseIcon sx={{ color: 'white' }} />
                </IconButton> */}
              </>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              dense
            >
              {/* <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(element) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                  />
                </ListItemIcon> */}
              <ListItemText
                id={`checkbox-list-label-${0}`}
                // primary={`${element.Name ? 'NOM DU MODEL' : 'NO NAME'}`}
                primary={`Contrôle du modèle: `}
              // secondary={secondary ? 'Secondary text' : null}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          <strong>Remarque:</strong>
        </Typography>
        <Typography variant="body1" component="div">
          Afin de pouvoir enrichir la maquette BIM, il faut au préalable <strong>bloquer le modèle</strong> afin d'empécher sa modification par d'autres utilisateurs:
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {(apiInformation.lockProject !== "") &&
          <Alert severity="error">{`${apiInformation.lockProject}`}</Alert>
        }
        {(apiInformation.unlockProject !== "") &&
          <Alert severity="error">{`${apiInformation.unlockProject}`}</Alert>
        }
        {(apiInformation.updateProject !== "") &&
          <Alert severity="error">{`${apiInformation.updateProject}`}</Alert>
        }
      </Grid>
    </Grid>
  );
};

export default AxeoBim;
