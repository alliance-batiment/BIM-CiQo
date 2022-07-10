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
  CircularProgress,
  Divider
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import DownloadIcon from '@mui/icons-material/Download';
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
import OpenDthxLogo from './img/OpenDthxLogo.png';
import IfcIcons from '../../Utils/ifc-full-icons.json';
import flatten from 'tree-flatten';

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


const SearchData = ({
  bimData,
  setBimData,
  viewer,
  handleShowMarketplace,
  handleShowProperties,
  handleGetJsonData,
  eids,
  setEids
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [checked, setChecked] = React.useState([0]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [validation, setValidation] = useState({
    loading: false,
    message: `${selectedElements.length} éléments`,
  });
  // const [ifcElementByType, setIfcElementByType] = useState([]);
  // const [expressIDList, setExpressIDList] = useState([]);

  useEffect(() => {
    async function init() {
      console.log('Search data')
      console.log('IfcIcons', IfcIcons)
      const selectedElements = await Promise.all(eids.map(async (eid) => {
        const elementProperties = await viewer.IFC.getProperties(0, eid, false, false);
        const type = await viewer.IFC.loader.ifcManager.getIfcType(0, eid);
        return elementProperties;
      }));

      setSelectedElements(selectedElements);
      console.log('EIDS', eids)
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
    await viewer.IFC.pickIfcItemsByID(0, newEids);
    setEids(newEids);
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

  const handleExportToCsv = async (e, eids) => {
    e.preventDefault()
    // Headers for each column
    let propertiesCsv = [];
    let headers = ['modelId', 'elementName', 'elementClass', 'globalId', 'expressId', 'psetName', 'propertyName', 'propertyValue'].join(',');
    propertiesCsv.push(headers)

    await Promise.all(eids.map(async eid => {
      const ifcElement = await viewer.IFC.getProperties(0, eid, true, true);
      const selectedModelID = await viewer.IFC.getModelID();
      // const ifcLoader = new IFCLoader();
      // const ifcClass = ifcClassType[];
      console.log('ifcClass ', ifcElement)
      await Promise.all(ifcElement.psets?.map(async pset => pset.HasProperties && await Promise.all(pset.HasProperties?.map(async (property) => {
        const modelID = 0;
        const elementName = `${ifcElement.Name?.value}`;
        const elementClass = `NONE`;
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

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
  ];

  const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
  ];

  const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const handleSearchData = async (input) => {
    setValidation({
      loading: true,
      message: 'Chargement...'
    });
    let dataList = [...bimData.models.data];
    if (!dataList || dataList.length === 0) {
      const data = await handleGetJsonData(viewer, flatten(bimData.spatialStructures.list[0], 'children'), setValidation);
      console.log('data', data)
      setBimData({
        ...bimData,
        models: {
          ...bimData.models,
          data: [...data]
        }
      });
      dataList = [...data];
    }
    const filteredEids = [];

    if (dataList && dataList.length > 0) {
      const newFilteredData = await dataList.filter((data) => {
        const searchResult = searchEngine(data, input);
        if (searchResult) {
          filteredEids.push(data.expressID);
        }
        return searchResult;
      });
      setSearchInput(input);
      setFilteredData(newFilteredData);
      setEids(filteredEids);
      setSelectedElements(newFilteredData);
      await viewer.IFC.pickIfcItemsByID(0, filteredEids);
    }
    setValidation({
      loading: false,
      message: `${filteredEids.length} éléments`
    });
  };

  function DecodeIFCString(ifcString) {
    const ifcUnicodeRegEx = /\\X2\\(.*?)\\X0\\/giu;
    let resultString = ifcString;
    let match = ifcUnicodeRegEx.exec(ifcString);
    while (match) {
      const unicodeChar = String.fromCharCode(parseInt(match[1], 16));
      resultString = resultString.replace(match[0], unicodeChar);
      match = ifcUnicodeRegEx.exec(ifcString);
    }
    return resultString;
  }

  const searchEngine = (data, input) => {
    const keyWords = [];
    keyWords.push(`${data.Name?.value} ${data.type} ${data.Description} ${data.GlobalId?.value} ${data.ObjectType?.value} ${data.expressID}`);
    for (let pset of data.psets) {
      keyWords.push(`${pset.Name?.value}`);
      if (pset.HasProperties && pset.HasProperties.length > 0) {
        for (let property of pset.HasProperties) {
          const label = DecodeIFCString(property.Name.value);
          const value = property.NominalValue
            ? DecodeIFCString(property.NominalValue.value)
            : "";

          const description =
            property.Description && property.Description !== ""
              ? DecodeIFCString(property.Description.value)
              : null;
          keyWords.push(`${label} ${value} ${description}`);
        }
      }
    }

    for (let mat of data.mats) {
      keyWords.push(`${mat.ForLayerSet?.Description} ${mat.ForLayerSet?.LayerSetName?.value}`);
      if (mat.ForLayerSet?.MaterialLayers && mat.ForLayerSet?.MaterialLayers.length > 0) {
        for (let material of mat.ForLayerSet.MaterialLayers) {
          const name = DecodeIFCString(material.Material.Name.value);
          // const thickness = DecodeIFCString(material.Material.Name.value);
          keyWords.push(`${name}`);
        }
      }
    }

    const searchResult = keyWords.some(keyWord => keyWord.toLowerCase()
      .includes(input.toLowerCase()));

    return searchResult;
  }


  const handleChange = (input) => {
    setSearchInput(input);
  }

  const handleResetSearch = async () => {
    setSearchInput("");
    setEids([]);
    setSelectedElements([]);
    await viewer.IFC.pickIfcItemsByID(0, []);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SearchBar
          input={searchInput}
          style={{ marginBottom: "1em" }}
          onChange={handleChange}
          placeholder="Mot clé"
          onClickOne={() => handleSearchData(searchInput)}
          onClickTwo={handleResetSearch}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="title2" component="div">
          Remarque: La première recherche par mot clès peut être longue car elle génère les données pour la recherche.
        </Typography>
      </Grid>
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
      <Grid item xs={12}>
        {validation.loading ?
          <>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
            </Grid>
            <Grid item xs={12} justify="center" style={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="div">{`${validation.message}`}    </Typography>
            </Grid>
          </>
          :
          <>
            <Grid item xs={12} >
              <Typography gutterBottom variant="title" component="div">{`${validation.message}`}    </Typography>
            </Grid>
            <Grid item xs={12}>
              <List sx={{ width: "100%" }}>
                {selectedElements.map((element, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <>
                        {/* <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={() => handleGetAllItemsOfType(element)}
                  >
                    <LibraryAddIcon />
                  </IconButton> */}
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={(e) => {
                            handleShowProperties(element.expressID);
                            e.stopPropagation();
                          }}
                        >
                          <DescriptionIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={(e) => handleExportToCsv(e, [element.expressID])}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => handleRemoveElement(element)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      role={undefined}
                      dense
                      onClick={() => handleElementSelection(element)}
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
                        id={`checkbox-list-label-${index}`}
                        primary={`${element.Name ? element.Name.value : 'NO NAME'}`}
                      // secondary={secondary ? 'Secondary text' : null}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </>
        }

      </Grid>
    </Grid>
    // <div style={{ height: 400, width: '100%' }}>
    //   <DataGrid {...data} components={{ Toolbar: GridToolbar }} />
    // </div>
  );
};

export default SearchData;
