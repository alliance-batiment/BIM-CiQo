import React, { useEffect, useState, useReducer, useRef, useCallback } from "react";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { makeStyles, Icon } from "@material-ui/core";
import {
  Avatar,
  Grid,
  Button,
  ButtonGroup,
  CircularProgress
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import OpenDthxLogo from './img/OpenDthxLogo.png';
import TreeComponent from "./Components/Tree";
import reducer from './reducer';
import { deselectAllNodes, toggleNode, loadTree } from './actions';

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
  treeViewLabel: {
    left: "3em",
    position: "absolute",
    textOverflow: "ellipsis",
    overflow: "hidden",
    wordWrap: "break-word",
    warp: true,
    // width: '5em'
  },
  treeViewCheckbox: {
    margin: 0,
    padding: 0,
  },
  treeView: {
    // height: 240,
    flexGrow: 1,
    // maxWidth: 400,
  }
}));

const ProjectTree = ({
  tree,
  viewer,
  handleShowMarketplace,
  handleShowProperties,
  eids,
  setEids
}) => {
  const [{ spatialStructures, loading, selected, hashMapTree, vtree }, dispatch] = useReducer(reducer, { loading: true, loadingCursor: false, selected: [], expanded: [], hashMapTree: {}, vtree: {} });
  const refSelectedItems = useRef(selected);
  const classes = useStyles();

  useEffect(() => {
    refSelectedItems.current = selected
  }, [selected])

  useEffect(() => {
    return () => {
      const selectedItemsIds = refSelectedItems.current.map((selectedItems) => parseInt(selectedItems));
      setEids(selectedItemsIds);
    };
  }, [])

  useEffect(() => {
    loadTree(dispatch)(tree, eids);
  }, [eids]);

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const handleExportToCsv = async (e, eids) => {
    e.preventDefault()
    // Headers for each column
    let propertiesCsv = [];
    let headers = ['modelId', 'elementName', 'elementClass', 'globalId', 'expressId', 'psetName', 'propertyName', 'propertyValue'].join(',');
    propertiesCsv.push(headers)

    await Promise.all(eids.map(async eid => {
      const ifcElement = await viewer.IFC.getProperties(0, eid, true, true);
      const selectedModelID = await viewer.IFC.getModelID();
      const ifcLoader = new IFCLoader();
      // const ifcClass = ifcClassType[];
      const ifcClass = await viewer.IFC.loader.ifcManager.getIfcType(0, eid);

      console.log('ifcClass', await viewer.IFC.loader.ifcManager.getIfcType(0, eid))
      await Promise.all(ifcElement.psets?.map(async pset => pset.HasProperties && await Promise.all(pset.HasProperties?.map(async (property) => {
        const modelID = 0;
        const elementName = `${ifcElement.Name?.value}`;
        const elementClass = ifcClass ? ifcClass : `NONE`;
        const globalID = `${ifcElement.GlobalId.value}`;
        const expressID = `${ifcElement.expressID}`;
        const psetName = `${pset.Name.value}`;
        const propertyName = `${property.Name?.value}`;
        const propertyValue = `${property.NominalValue?.value}`;

        propertiesCsv.push([modelID, elementName, elementClass, globalID, expressID, psetName, propertyName, propertyValue].join(','))
      }))))
    }));

    downloadFile({
      data: [...propertiesCsv].join('\n'),
      fileName: `selection.csv`,
      fileType: 'text/csv',
    })
  }

  function toggleRow(nodeId) {
    toggleNode(dispatch)(selected, hashMapTree, nodeId, viewer);
  }

  function handleRemoveAllElements() {
    deselectAllNodes(dispatch)(viewer);
  }

  return (
    <Grid container>
      <Grid xs={6} style={{ textAlign: 'left' }}>
        <ButtonGroup
          className={classes.buttonGroup}
        >
          <Button
            edge="end"
            aria-label="comments"
            onClick={() => handleRemoveAllElements()}
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid xs={6} style={{ textAlign: 'right' }}>
        <ButtonGroup
          // variant="contained"
          // aria-label="outlined primary button group"
          className={classes.buttonGroup}
        >
          {/* <Button
            edge="end"
            aria-label="comments"
            className={classes.button}
          // onClick={() => handleGetAllItemsOfType(element)}
          >
            <MutltiSelectionIcon />
          </Button> */}
          <Button
            edge="end"
            aria-label="comments"
            className={classes.button}
            onClick={(e) => handleExportToCsv(e, eids)}
          >
            <DownloadIcon />
          </Button>
          <Button
            edge="end"
            aria-label="comments"
            onClick={() => handleShowMarketplace('Open dthX')}
          >
            {/* <img
              src={OpenDthxLogo}
            /> */}
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              src={OpenDthxLogo}
              style={{ width: '1em', height: 'auto' }}
            // alt={application.name}
            // title={application.name}
            />
          </Button>
        </ButtonGroup>
      </Grid>
      {(loading) ?
        <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
        </Grid>
        :
        <div style={{ display: 'flex', width: "100%" }}>

          {
            spatialStructures &&
            spatialStructures.length &&
            spatialStructures.map((spatialStructure) => (
              <div style={{ flex: '1 1 auto', height: '300px' }} key={spatialStructure.expressID}>
                <TreeComponent
                  spatialStructures={spatialStructures}
                  spatialStructure={spatialStructure}
                  handleShowProperties={handleShowProperties}
                  toggleRow={toggleRow}
                  vtree={vtree}
                />
              </div>

            ))
          }
        </div>
      }
    </Grid >
  );
};

export default ProjectTree;

