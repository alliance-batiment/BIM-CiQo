import React, { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Fab
} from "@material-ui/core";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Badge,
  ListItemText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Popover,
  Grid,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { FirstPersonControl } from 'web-ifc-viewer/dist/components/context/camera/FirstPersonControl';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import axios from 'axios';

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
  avatar: {
    backgroundColor: 'transparent',
    width: theme.spacing(7),
    height: theme.spacing(7),
    // padding: '5px',
    borderRadius: '0px'
  },
  fab: {
    backgroundColor: 'white'
  },
  button: {
    color: "white",
    backgroundColor: 'black',
    width: '100%'
  },
}));

const Validation = ({
  bimData,
  setBimData,
  showValidation,
  setShowValidation
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModelValidation = async () => {
    try {
      const ifcData = await bimData.viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
      const blobIfc = new Blob([ifcData], { type: 'text/plain' });
      const ifcFile = new File([blobIfc], 'ifcFile.png');


      const formData = new FormData();
      formData.append('files', ifcFile);


      // const analysis = await axios.post(process.env.REACT_APP_API_URL, formData);
      // console.log('projectId', analysis.data)
      // const { projectId } = analysis.data;

      // const logs = await axios.get(`${process.env.REACT_APP_API_URL}/log/${projectId}.json`);
      // console.log('logs', logs.data);

      // const jsonData = await JSON.parse(logs.data);
      // console.log('jsonData', jsonData["level"]);
      axios.post(process.env.REACT_APP_API_URL, formData).then((value) => {
        console.log('value.data', value.data)
        return value.data;
      })
        .then(async ({ projectId }) => {
          const logs = await axios.get(`${process.env.REACT_APP_API_URL}/log/${projectId}.json`)
          console.log('logs', logs)
        }).catch((error) => {
          console.log('ERRORRR', error)
        })

      // res.status(200).send(response.data);
    } catch (err) {
      // return res.status(500).json({ error: err });
    }
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
            >
              <FactCheckIcon />
            </Fab>
          </Avatar>
        }
        title={`Validation`}
        subheader={`Système de validation d'un fichier IFC`}
        action={<div>
          <IconButton
            aria-label="settings"
            aria-describedby={id}
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
            <ListItem button onClick={() => setShowValidation(false)}>
              <ListItemIcon>
                <ClearIcon />
              </ListItemIcon>
              <ListItemText primary="Fermer" />
            </ListItem>
          </Popover>
        </div>}
      />
      <CardContent>
        <Grid item xs={12}>
          <Button onClick={handleModelValidation} className={classes.button}>Vérificateur</Button>
        </Grid>
      </CardContent>
    </Card>
  )
};

export default Validation;