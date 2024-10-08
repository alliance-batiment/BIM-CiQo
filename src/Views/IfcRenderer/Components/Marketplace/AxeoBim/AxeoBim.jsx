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
  Divider,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Stack
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
  table: {
    width: "100%",
  },
  iconButton: {
    backgroundColor: 'red'
  }
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
                    <Tooltip
                      title={
                        <p>
                          Accès référentiel:
                  <br />
                  Permet l'enrichissement de la maquette avec de la donnée issue d'un référentiel
                </p>
                      }
                      placement="top"
                    >
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={(e) => setSelectedApp('Open dthX')}
                        className={classes.iconButton}
                      >
                        <AddIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        <p>
                          AxeoBIM:
                  <br />
                  Débloque la maquette dans AxeoBIM afin de permettre son utilisation par un autre utilisateur
                </p>
                      }
                      placement="top"
                    >
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={(e) => {
                          handleUnlockProject();
                          // e.stopPropagation();
                        }}
                        className={classes.iconButton}
                      >
                        <LockIcon style={{ color: 'white' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        <p>
                          AxeoBIM:
                  <br />
                  Mise à jour et déblocage la maquette dans AxeoBIM pour les autres utilisateurs
                </p>
                      }
                      placement="top"
                    >
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={handleUpdateProject}
                        className={classes.icons}
                      >
                        <FileUploadIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </Tooltip>
                  </>
                  :
                  <Tooltip
                    title={
                      <p>
                        AxeoBIM:
                  <br />
                  cliquez ici pour bloquer la maquette dans AxeoBIM et permettre son enrichissement
                </p>
                    }
                    placement="top"
                  >
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={(e) => {
                        handleLockProject()
                        // e.stopPropagation();
                      }}
                    >
                      <LockOpenIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Tooltip>
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
      </Grid >
      {/* <Grid item xs={12}>
        <Typography variant="body1" component="div">
          <strong>Etat de la maquette dans AxeoBIM:</strong>
        </Typography>
        <Divider />
      </Grid> */}
      <Grid item xs={12}>
        <Table size="small" aria-label="a dense table" className={classes.table}>
          <TableBody>
            <TableRow
              key={0}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ width: '30%', border: "none" }}>
                {`Etat de la maquette : `}
              </TableCell>
              <TableCell align="left" sx={{ border: "none" }}>
                <Typography variant="body1" component="div">
                  {locked ?
                    <strong style={{ color: 'red' }}>Bloquée</strong>
                    :
                    <strong style={{ color: 'green' }}>Débloquée</strong>
                  }
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          <strong>Remarque:</strong>
        </Typography>
        <Typography variant="body1" component="div">
          Afin de pouvoir enrichir la maquette BIM, il est nécessaire au préalable de <strong>bloquer le modèle</strong> afin d'empécher sa modification par d'autres utilisateurs.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {(apiInformation.lockProject !== "") &&
          <Alert severity="info">{`${apiInformation.lockProject}`}</Alert>
        }
        {(apiInformation.unlockProject !== "") &&
          <Alert severity="info">{`${apiInformation.unlockProject}`}</Alert>
        }
        {(apiInformation.updateProject !== "") &&
          <Alert severity="info">{`${apiInformation.updateProject}`}</Alert>
        }
      </Grid>
    </Grid >
  );
};

export default AxeoBim;
