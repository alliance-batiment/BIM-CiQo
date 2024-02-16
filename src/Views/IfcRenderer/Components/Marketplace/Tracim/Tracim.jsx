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
import TracimLogo from './img/TracimLogo.svg'
import { UseTracim } from './Tracim.hooks';

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

const Tracim = ({
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
    handleUpdateProject
  } = UseTracim({
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
                <Tooltip
                  title={
                    <p>
                      Tracim:
                      <br />
                      Mise à jour de la maquette dans Tracim pour les autres utilisateurs
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
            }
            disablePadding
          >
            Mise à jour de la maquette dans Tracim
          </ListItem>
        </List>
      </Grid >
      
    </Grid >
  );
};

export default Tracim;
