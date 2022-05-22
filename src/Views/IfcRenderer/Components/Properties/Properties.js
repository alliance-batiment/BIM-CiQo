import React, { useEffect, useState } from "react";
import {
  Typography,
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
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import DescriptionIcon from '@material-ui/icons/Description';
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as WebIFC from "web-ifc";
import { Grid } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardExpanded: {
    position: "absolute",
    top: "0px",
    zIndex: 1000,
    left: "0px",
    right: "0px",
    opacity: '0.95',
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175
  },
  card: {
    position: "absolute",
    top: "0px",
    zIndex: 100,
    left: "0px",
    right: "0px",
    opacity: '0.95'
    // width: ({ width }) => width,
    // height: ({ height }) => height,
    // maxWidth: window.innerWidth - 175,
    // maxHeight: window.innerHeight - 175
  },
  cardContent: {
    opacity: '0.95',
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
}));

const Properties = ({
  viewer,
  element,
  selectedElementID,
  setSelectedElementID,
  setShowProperties,
  handleShowMarketplace,
  addElementsNewProperties
}) => {
  const [ifcElement, setIfcElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [viewWidth, setViewWidth] = useState("400px");
  const [viewHeight, setViewHeight] = useState("400px");

  // const props = { width: { viewWidth }, height: { viewHeight } };
  const props = {
    width: viewWidth,
    height: viewHeight,
  };

  const classes = useStyles(props);

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
  useEffect(() => {
    const getWidth = () => window.innerWidth - 175;
    const getHeight = () => window.innerHeight - 175;
    const resizeListener = () => {
      if (!expandedView) {
        setViewWidth(getWidth());
        setViewHeight(getHeight());
      }
    }
    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  useEffect(() => {
    async function init() {
      console.log("selectedElementID", selectedElementID);
      setIsLoading(true);
      if (selectedElementID) {
        const elementProperties = await viewer.IFC.getProperties(
          0,
          selectedElementID,
          true,
          true
        );
        // console.log("elementProperties", elementProperties);

        // console.log("viewer", viewer);
        // console.log(
        //   "ifcClass",
        //   viewer.IFC.loader.ifcManager.getIfcType(0, selectedElementID)
        // );
        const ifcClass = viewer.IFC.loader.ifcManager.getIfcType(
          0,
          selectedElementID
        );
        let psets = [];
        if (elementProperties.psets.length > 0) {
          for (let pset of elementProperties.psets) {
            if (pset.HasProperties && pset.HasProperties.length > 0) {
              const newPset = [];
              for (let property of pset.HasProperties) {
                const label = DecodeIFCString(property.Name.value);
                const value = property.NominalValue
                  ? DecodeIFCString(property.NominalValue.value)
                  : "";
                const unit =
                  property.Unit == null
                    ? ""
                    : property.Unit.value === "null"
                      ? ""
                      : property.Unit.value;
                // console.log("unit", unit);
                newPset.push({
                  label,
                  value,
                  unit,
                });
              }
              psets.push({
                ...pset,
                HasProperties: [...newPset],
              });
            } else if (pset.Quantities && pset.Quantities.length > 0) {
              const newPset = [];
              for (let property of pset.Quantities) {
                const label = DecodeIFCString(property.Name.value);
                const value = property.NominalValue
                  ? DecodeIFCString(property.NominalValue.value)
                  : null;
                newPset.push({
                  label,
                  value,
                });
              }
              psets.push({
                ...pset,
                HasProperties: [...newPset],
              });
            } else {
              psets.push({
                ...pset,
                HasProperties: [],
              });
            }
          }
          // psets = await Promise.all(elementProperties.psets.map(async (pset) => {
          //   if (pset.HasProperties && pset.HasProperties.length > 0) {
          //     const newPset = await Promise.all(pset.HasProperties.map(async (property) => {
          //       console.log('property', property)
          //       const label = DecodeIFCString(property.Name.value);
          //       const value = property.NominalValue ? DecodeIFCString(property.NominalValue.value) : '';
          //       const unit = (property.Unit == null) ? '' : (property.Unit.value === 'null' ? '' : property.Unit.value);
          //       console.log('unit', unit)
          //       return {
          //         label,
          //         value,
          //         unit
          //       }
          //     }));

          //     return {
          //       ...pset,
          //       HasProperties: [...newPset]
          //     }
          //   }
          //   if (pset.Quantities && pset.Quantities.length > 0) {
          //     const newPset = await Promise.all(pset.Quantities.map(async (property) => {
          //       const label = DecodeIFCString(property.Name.value);
          //       const value = property.NominalValue ? DecodeIFCString(property.NominalValue.value) : null;
          //       return {
          //         label,
          //         value
          //       }
          //     }));

          //     return {
          //       ...pset,
          //       HasProperties: [...newPset]
          //     }
          //   }
          //   return {
          //     ...pset,
          //     HasProperties: []
          //   }
          // }));
        }
        const elem = {
          ...elementProperties,
          name: elementProperties.Name
            ? elementProperties.Name.value
            : "NO NAME",
          type: ifcClass ? ifcClass : "NO TYPE",
          modelID: 0,
          psets,
        };
        // console.log("elem", elem);
        setIfcElement(elem);
      }
      setIsLoading(false);
      // else {
      //   if (element) {
      //     console.log("elements", element);
      //     setIfcElement(element);
      //   }
      // }
    }
    init();
  }, [selectedElementID]);

  const handleShowElement = async () => {
    const modelID = element.modelID;
    const ids = [element.expressID];
    console.log("viewer", viewer);
    // const mesh = await viewer.IFC.visibility.getMesh(modelID);
    // console.log("mesh", mesh);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddProperties = async () => {
    handleShowMarketplace("Open dthX");
    setShowProperties(false);
  };

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  // const handleExportToJson = e => {
  //   e.preventDefault()
  //   downloadFile({
  //     data: JSON.stringify(usersData.users),
  //     fileName: `${ifcElement ? ifcElement.name : "Undefined"}.csv`,
  //     fileType: 'text/json',
  //   })
  // }

  const handleExpandView = (e) => {
    const width = window.innerWidth - 175;
    const height = window.innerHeight - 175;

    if (!expandedView) {
      setExpandedView(true);
      setViewWidth(width);
      setViewHeight(height);
      setAnchorEl(null);
    } else if (expandedView) {
      setExpandedView(false);
      setViewWidth("400px");
      setViewHeight("400px");
      setAnchorEl(null);
    }
  };

  const handleExportToCsv = (e) => {
    e.preventDefault();
    // Headers for each column
    let propertiesCsv = [];
    let headers = [
      "modelId",
      "elementName",
      "elementClass",
      "globalId",
      "expressId",
      "psetName",
      "propertyName",
      "propertyValue",
    ].join(",");
    propertiesCsv.push(headers);
    // Convert Properties data to a csv

    // let propertiesCsv = ifcElement.psets?.map(pset => pset.HasProperties?.reduce((acc, property) => {
    //   const { label, value } = property
    //   acc.push([label, `${value} \n`].join(','))
    //   console.log(acc[acc.length - 1])
    //   return acc
    // }, []));

    // console.log("ifcElement", ifcElement);
    ifcElement.psets?.forEach((pset) =>
      pset.HasProperties?.forEach((property) => {
        const modelID = `${ifcElement.modelID}`;
        const elementName = `${ifcElement.name}`;
        const elementClass = `${ifcElement.type}`;
        const globalID = `${ifcElement.GlobalId.value}`;
        const expressID = `${ifcElement.expressID}`;
        const psetName = `${pset.Name.value}`;
        const { label: propertyName, value: propertyValue } = property;
        propertiesCsv.push(
          [
            modelID,
            elementName,
            elementClass,
            globalID,
            expressID,
            psetName,
            propertyName,
            propertyValue,
          ].join(",")
        );
      })
    );

    downloadFile({
      data: [...propertiesCsv].join("\n"),
      fileName: `${ifcElement ? ifcElement.name : "Undefined"}.csv`,
      fileType: "text/csv",
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card className={expandedView ? classes.cardExpanded : classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <DescriptionIcon />
          </Avatar>
        }
        action={
          <div>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleExpandView}
              size="small"
            >
              {expandedView ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={() => {
                setShowProperties(false);
                // setSelectedElementID(null); Empêche réouverture de la view après fermeture
              }}
              size="small"
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleClick}
              size="small"
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
              {ifcElement && (
                <>
                  <ListItem button onClick={handleExportToCsv}>
                    <ListItemIcon>
                      <DownloadIcon />
                    </ListItemIcon>
                    <ListItemText primary="Télécharger CSV" />
                  </ListItem>
                  <ListItem button onClick={handleAddProperties}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ajouter propriété" />
                  </ListItem>
                </>
              )}
              <ListItem
                button
                onClick={() => {
                  setShowProperties(false);
                  // setSelectedElementID(null); Empêche réouverture de la view après fermeture
                }}
              >
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Fermer" />
              </ListItem>
            </Popover>
          </div>
        }
        title={`${ifcElement ? DecodeIFCString(ifcElement.name) : "Undefined"}`}
        subheader={`${ifcElement ? ifcElement.type : "Undefined"}`}
      />
      {isLoading ? (
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      ) : (
        <CardContent className={classes.cardContent}>
          {ifcElement && (
            <>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Attributes
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                      <TableBody>
                        <TableRow key={0}>
                          <TableCell>{`GlobalId`}</TableCell>
                          <TableCell>{`${ifcElement.GlobalId.value}`}</TableCell>
                        </TableRow>
                        <TableRow key={1}>
                          <TableCell>{`Name`}</TableCell>
                          <TableCell>{`${ifcElement.name}`}</TableCell>
                        </TableRow>
                        <TableRow key={2}>
                          <TableCell>{`Type`}</TableCell>
                          <TableCell>{`${ifcElement.type}`}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
              {ifcElement.psets.length > 0 &&
                ifcElement.psets.map((pset, i) => (
                  <Accordion key={i}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography
                        className={classes.heading}
                      >{`${DecodeIFCString(pset.Name.value)}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableBody>
                            {pset.HasProperties &&
                              pset.HasProperties.length > 0 &&
                              pset.HasProperties.map((property, index) => (
                                <TableRow key={index}>
                                  <TableCell>{`${property.label}`}</TableCell>
                                  <TableCell>{`${property.value}`}</TableCell>
                                  <TableCell>{`${property.unit}`}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default Properties;
