import React, { useEffect, useState } from "react";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { makeStyles } from "@material-ui/core";
import {
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
  CircularProgress
} from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import { IFCSLAB, IFCMEMBER, IFCSTRUCTURALCURVEMEMBER } from "web-ifc";
import SearchData from '../SearchData';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import OpenDthxLogo from './img/OpenDthxLogo.png';
import ifcClassType from '../../Utils/types-ifcClass-map';

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
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProjectTree = ({
  state,
  setState,
  viewer,
  handleShowMarketplace,
  handleShowProperties,
  eids,
  setEids
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState([]);
  const [expressIDList, setExpressIDList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spatialStructures, setSpatialStructures] = useState([...state.spatialStructures.list]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const modelID = await viewer.IFC.getModelID();
      // const expandedNode = await eids.map(eid => String(eid))
      // setExpanded(expandedNode);
      if (spatialStructures && spatialStructures.length > 0) {
        const expandedNodes = [];
        const getExpandedNodes = (node, count) => {
          // console.log('node', node[0]);
          if (node.children && node.children.length > 0 && count < 3) {
            expandedNodes.push(`${node.expressID}`);
            count++;
            node.children.forEach((child) => {
              getExpandedNodes(child, count);
            });
          }
        }

        let count = 0;
        getExpandedNodes(spatialStructures[0], count);
        setExpanded(expandedNodes);
      }

      setLoading(false);
    }
    init();
  }, []);

  const resetSelection = async () => {
    setEids([]);
  }

  const handleRemoveAllElements = async () => {
    setEids([]);
    await viewer.IFC.unpickIfcItems();
  }

  const handleShowElement = async () => {
    await viewer.IFC.pickIfcItemsByID(0, expressIDList, false, 0);
  };

  const handleToggle = async (event, nodes) => {
    // const expandedNode = await eids.map(eid => String(eid))
    setExpanded(nodes);
  };

  const handleExpressId = async (node) => {
    const newEids = [...eids];
    const index = eids.findIndex(
      (eid) => eid === node.expressID
    );

    const addExpressId = (node) => {
      newEids.push(node.expressID);
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          addExpressId(child);
        });
      }
    };

    const removeExpressId = (node) => {
      const index = newEids.findIndex(
        (eid) => eid === node.expressID
      );
      newEids.splice(index, 1);
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          removeExpressId(child);
        });
      }
    };

    if (index < 0) {
      await addExpressId(node);
    } else {
      await removeExpressId(node);
    }

    // await viewer.IFC.selector.highlightIfcItemsByID(0, newExpressIDList, false);
    setEids(newEids);
    await viewer.IFC.pickIfcItemsByID(0, newEids);
  };

  const isChecked = (expressIDList, node) => {
    const index = expressIDList.findIndex(
      (expressID) => expressID === node.expressID
    );
    return index >= 0 ? true : false;
  };

  const handleTreeViewItemById = async (event, node) => {
    if (node && node.children.length === 0) {
      await viewer.IFC.unpickIfcItems();
      if (event.target.checked) {
        console.log("CHECKED");
        const ids = [...expressIDList, node.expressID];
        await viewer.IFC.pickIfcItemsByID(0, ids, false, 0);
        setExpressIDList(ids);
      } else {
        console.log("UNCHECKED");
        const index = expressIDList.findIndex(
          (index) => index === node.expressID
        );
        const ids = expressIDList.splice(index, 1);
        await viewer.IFC.pickIfcItemsByID(0, ids, false, 0);
        setExpressIDList(ids);
      }
    }
  };

  // const handleElementsVisibility = async (index) => {
  //   const ids = ifcElementByType[index].elements.map(
  //     (element) => element.expressID
  //   );
  //   // await viewer.IFC.hideAllItems(0);
  //   // await viewer.IFC.showItems(0, ids);
  //   console.log('ids', ids)
  //   await viewer.IFC.pickIfcItemsByID(1, ids);
  // };


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

  const handleExportToCsv = async (e) => {
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


  const renderTree = (nodes, index) => (
    <TreeItem
      key={`${nodes.expressID}`}
      nodeId={`${nodes.expressID}`}
      label={
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Checkbox
              className={classes.treeViewCheckbox}
              checked={isChecked(eids, nodes)}
              onChange={(e) => {
                // handleTreeViewItemById(e, nodes);
                handleExpressId(nodes);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Grid>
          <Grid item xs={8}>
            {/* <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '5em' }}> */}
            <Typography nowrap mt={1.2} className={classes.treeViewLabel}>
              {`${nodes.type} ${nodes.Name ? nodes.Name.value : ""}`}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={(e) => {
                console.log('nodes.expressID', nodes.expressID);
                handleShowProperties(nodes.expressID);
                e.stopPropagation();
              }}
            >
              <DescriptionIcon />
            </IconButton>
          </Grid>
        </Grid>
        // <FormControlLabel
        //   control={<Checkbox
        //     checked={isChecked(expressIDList, nodes)}
        //     onChange={(e) => {
        //       // handleTreeViewItemById(e, nodes);
        //       handleAddId(nodes);
        //     }}
        //   />}
        //   name={nodes.expressID}
        //   label={`${nodes.type} ${nodes.Name ? nodes.Name.value : ""}`}
        // />
      }
    // label={`${nodes.type} ${nodes.Name ? nodes.Name.value : ""}`}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Grid container>
      <Grid xs={6} style={{ textAlign: 'left' }}>
        <ButtonGroup
          className={classes.buttonGroup}
        >
          {/* <Button
            edge="end"
            aria-label="comments"
          // onClick={() => handleGetAllItemsOfType(element)}
          >
            <CheckBoxIcon />
          </Button> */}
          <Button
            edge="end"
            aria-label="comments"
            onClick={handleRemoveAllElements}
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
            onClick={(e) => handleExportToCsv(e)}
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
      {loading ?
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
        :
        <>
          {spatialStructures &&
            spatialStructures.length &&
            spatialStructures.map((spatialStructure) => (
              <>
                {spatialStructure.children &&
                  spatialStructure.children.length > 0 && (
                    <Grid xs={12}>
                      <TreeView
                        aria-label="rich object"
                        className={classes.treeView}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        // defaultExpanded={expanded}
                        defaultExpandIcon={<ChevronRightIcon />}
                        expanded={expanded}
                        // multiSelect
                        onNodeToggle={handleToggle}
                      >
                        {renderTree(spatialStructure)}
                      </TreeView>
                    </Grid>
                  )}
              </>
            ))}
        </>
      }
    </Grid>
  );
};

export default ProjectTree;

