import React, { useEffect, useState } from "react";
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
  Divider,
  Badge
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchBar from '../../../../Components/SearchBar';
import { IFCSLAB, IFCMEMBER, IFCSTRUCTURALCURVEMEMBER } from "web-ifc";
import CommentIcon from '@mui/icons-material/Comment';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MutltiSelectionIcon from '@mui/icons-material/ControlPointDuplicate';
import DownloadIcon from '@mui/icons-material/Download';
import OpenDthxLogo from './img/OpenDthxLogo.png';

import ifcClasses from './utils/ifcClasses';
import IfcIcons from '../../Utils/ifc-full-icons.json';
import * as WebIFC from "web-ifc";

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
  buttonGroup: {
    backgroundColor: 'white',
    marginTop: '1em'
  }
}));


const Settings = ({
  viewer,
  handleShowMarketplace,
  handleShowProperties,
  eids,
  setEids
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [checked, setChecked] = React.useState([0]);
  const [ifcModelsClasses, setIfcModelsClasses] = useState([]);
  const [eidsHidden, setEidsHidden] = useState([]);

  // useEffect(() => {
  //   const models = viewer.context.items.ifcModels;
  //   const ifcModel = models[0];
  //   const allIDs = Array.from(
  //     new Set(ifcModel.geometry.attributes.expressID.array)
  //   );
  //   const subset = getWholeSubset(viewer, ifcModel, allIDs);
  //   replaceOriginalModelBySubset(viewer, ifcModel, subset);
  //   setupEvents(viewer, allIDs);
  // }, []);

  useEffect(() => {
    async function init() {
      console.log('Settings')
      // const ifcApi = new WebIFC.IfcAPI();
      const newIfcModelsClasses = [];
      for (let ifcClass of ifcClasses) {
        if (WebIFC[`${ifcClass.toUpperCase()}`]) {
          const classEids = await viewer.getAllItemsOfType(0, WebIFC[`${ifcClass.toUpperCase()}`], false, false);
          if (classEids && classEids.length > 0) {
            newIfcModelsClasses.push({
              name: ifcClass,
              icon: IfcIcons[`${ifcClass}`],
              eids: [...classEids],
              hide: false
            })
          }
        }

      }
      setIfcModelsClasses(newIfcModelsClasses);

    }
    init();
  }, [eids]);

  const handleElementsMultiSelection = async () => {
    const found = await viewer.IFC.pickIfcItem(true, 1);
    setEids([...eids, found.id]);
  }

  const handleElementSelection = async (element) => {
    const currentIndex = checked.indexOf(element);
    const newChecked = [...checked];
    //await viewer.IFC.pickIfcItemsByID(0, [element.expressID]);
    if (currentIndex === -1) {
      newChecked.push(currentIndex);
    } else {
      // await viewer.IFC.pickIfcItemsByID(0, [element.expressID]);
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }

  const handleRemoveAllElements = async () => {
    setEids([]);
    await viewer.IFC.unpickIfcItems();
  }


  const handleGetAllItemsOfType = async (element) => {
    console.log('element', element);
    const elementsByType = await viewer.getAllItemsOfType(0, element.type, false, false);
    console.log('elementsByType', elementsByType)
    setEids([...eids, ...elementsByType]);
  }

  const handleRemoveElement = async (element) => {
    const newEids = eids.filter(eid => eid !== element.expressID);
    setEids(newEids);
  }


  const handleShowElement = async (ids) => {
    setEids(ids);
    await viewer.IFC.pickIfcItemsByID(0, ids, false, 0);
  }


  function handleRestoreElements(eids, index) {
    const idsHidden = eidsHidden.reduce(function (acc, id) {
      if (eids.indexOf(id) === -1) {
        acc.push(id);
      }
      return acc;
    }, []);
    setEidsHidden(idsHidden)

    const models = viewer.context.items.ifcModels;
    const ifcModel = models[0];
    const allIDs = Array.from(
      new Set(ifcModel.geometry.attributes.expressID.array)
    )
    const idsRestore = allIDs.reduce(function (acc, id) {
      if (idsHidden.indexOf(id) === -1) {
        acc.push(id);
      }
      return acc;
    }, []);

    viewer.IFC.loader.ifcManager.createSubset({
      modelID: ifcModel.modelID,
      ids: idsRestore,
      applyBVH: true,
      scene: ifcModel.parent,
      removePrevious: true,
      customID: 'full-model-subset',
    });

    const newIfcModelsClasses = [...ifcModelsClasses];
    newIfcModelsClasses[index] = {
      ...newIfcModelsClasses[index],
      hide: false
    }

    setIfcModelsClasses(newIfcModelsClasses);
  }

  const handleHideElements = async (eids, index) => {
    setEidsHidden([...eidsHidden, ...eids]);
    viewer.IFC.loader.ifcManager.removeFromSubset(
      0,
      eids,
      'full-model-subset',
    );

    const newIfcModelsClasses = [...ifcModelsClasses];
    newIfcModelsClasses[index] = {
      ...newIfcModelsClasses[index],
      hide: true
    }

    setIfcModelsClasses(newIfcModelsClasses);
  }

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

  const handleExportToCsv = async (e, ifcClass) => {
    e.preventDefault()
    // Headers for each column
    let propertiesCsv = [];
    let headers = ['modelId', 'elementName', 'elementClass', 'globalId', 'expressId', 'psetName', 'propertyName', 'propertyValue'].join(',');
    propertiesCsv.push(headers)

    for (let eid of ifcClass.eids) {
      const ifcElement = await viewer.IFC.getProperties(0, eid, true, true);
      console.log('ifcElement', ifcElement)
      if (ifcElement && ifcElement.psets && ifcElement.psets.length > 0) {
        for (let pset of ifcElement.psets) {
          console.log('pset', pset)
          if (pset.HasProperties && pset.HasProperties.length > 0) {
            for (let property of pset.HasProperties) {
              console.log('property', property)
              const modelID = 0;
              const elementName = `${ifcElement.Name?.value}`;
              const elementClass = `${ifcClass.name}`;
              const globalID = `${ifcElement.GlobalId.value}`;
              const expressID = `${ifcElement.expressID}`;
              const psetName = `${pset.Name.value}`;
              const propertyName = `${property.Name?.value}`;
              const propertyValue = `${property.NominalValue?.value}`;

              propertiesCsv.push([modelID, elementName, elementClass, globalID, expressID, psetName, propertyName, propertyValue].join(','))
            }
          }
        }
      }
    }

    downloadFile({
      data: [...propertiesCsv].join('\n'),
      fileName: `${ifcClass ? ifcClass.name : "Undefined"}.csv`,
      fileType: 'text/csv',
    })
  }
  return (
    <Grid container>
      {/* <Grid item xs={12}>
        <SearchBar style={{ marginBottom: "1em" }} />
      </Grid> */}
      <Grid item xs={6} style={{ textAlign: 'left' }}>
        <ButtonGroup
          // color="secondary" aria-label="medium secondary button group"
          className={classes.buttonGroup}
        >
          {/* <Button
            edge="end"
            aria-label="comments"
          // onClick={() => handleGetAllItemsOfType(element)}
          >
            <CheckBoxIcon />
          </Button>
          <Button
            edge="end"
            aria-label="comments"
            onClick={handleRemoveAllElements}
          >
            <DeleteIcon />
          </Button> */}
        </ButtonGroup>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }}>
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
      <Grid item xs={12}>
        <List sx={{ width: "100%" }}>
          {ifcModelsClasses.map((ifcClass, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  {/* { ifcClass.hide ?
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleRestoreElements(ifcClass.eids, index)}
                    >
                      <VisibilityOffIcon />
                    </IconButton>
                    :
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleHideElements(ifcClass.eids, index)}
                    >
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  } */}
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={(e) => handleExportToCsv(e, ifcClass)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </>
              }
              disablePadding
            >
              <ListItemButton
                role={undefined}
                dense
                onClick={() => handleShowElement(ifcClass.eids)}
              >
                <ListItemIcon>
                  {/* <Checkbox
                    edge="start"
                    checked={checked.indexOf(element) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                  /> */}
                  <Badge badgeContent={`${ifcClass.eids.length}`} color="primary">
                    <i class='material-icons'>{`${ifcClass.icon}`}</i>
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  id={`checkbox-list-label-${index}`}
                  primary={`${ifcClass.name}`}
                // secondary={secondary ? 'Secondary text' : null}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
    // <div style={{ height: 400, width: '100%' }}>
    //   <DataGrid {...data} components={{ Toolbar: GridToolbar }} />
    // </div>
  );
};

export default Settings;
