import React, { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Fab
} from "@material-ui/core";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import Drawing from 'dxf-writer';
import { DxfParser } from 'dxf-parser';
import { Viewer } from 'three-dxf';

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
  }
}));


const DxfViewer = ({
  viewer
}) => {
  const classes = useStyles();

  useEffect(() => {
  }, []);

  const handleUploadDxf = async (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    console.log('dxf', e.target.files[0])
    reader.onload = function () {
      try {
        const parser = new DxfParser();
        const dxf = parser.parseSync(reader.result);
        console.log('dxf', dxf)
        let cadCanvas = new Viewer(dxf, document.getElementById('cad-view'), 400, 300);
      } catch (err) {
        return console.error(err.stack);
      }
    }
    reader.onerror = function () {
      console.log(reader.error);
    };
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          type="file"
          id="input"
          accept="dxf"
          onChange={handleUploadDxf}>Import DXF</TextField>
      </Grid>
      <Grid item xs={12}>
        <div id="cad-view">

        </div>
      </Grid>
    </Grid>
  )
};

export default DxfViewer;