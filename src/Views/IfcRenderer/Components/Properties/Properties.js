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
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
}));

const Properties = ({
  viewer,
  element,
  selectedElementID,
  setSelectedElementID,
  setShowProperties,
  addElementsNewProperties,
}) => {
  const classes = useStyles();
  const [ifcElement, setIfcElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function init() {
      console.log('selectedElementID', selectedElementID);
      if (selectedElementID) {
        const elementProperties = await viewer.IFC.getProperties(0, selectedElementID, true, true);
        console.log('elementProperties', elementProperties)
        let psets = [];
        if (elementProperties.psets.length > 0) {
          psets = await Promise.all(elementProperties.psets.map(async (pset) => {
            if (pset.HasProperties && pset.HasProperties.length > 0) {
              const newPset = await Promise.all(pset.HasProperties.map(async (property) => {
                const label = property.Name.value;
                const value = property.NominalValue ? property.NominalValue.value : null;
                return {
                  label,
                  value
                }
              }));

              return {
                ...pset,
                HasProperties: [...newPset]
              }
            }
            if (pset.Quantities && pset.Quantities.length > 0) {
              const newPset = await Promise.all(pset.Quantities.map(async (property) => {
                const label = property.Name.value;
                const value = property.NominalValue ? property.NominalValue.value : null;
                return {
                  label,
                  value
                }
              }));

              return {
                ...pset,
                HasProperties: [...newPset]
              }
            }
            return {
              ...pset,
              HasProperties: []
            }
          }));

        }
        const elem = {
          ...elementProperties,
          name: elementProperties.Name ? elementProperties.Name.value : 'NO NAME',
          type: 'NO TYPE',
          modelID: 0,
          psets
        };
        console.log('elem', elem)
        setIfcElement(elem);
      }

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
    const mesh = await viewer.IFC.visibility.getMesh(modelID);
    console.log("mesh", mesh);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            P
          </Avatar>
        }
        action={
          <div>
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
              {/* <ListItem
                button
                onClick={handleShowElement}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="Visibility" />
              </ListItem> */}
              {/* <ListItem
                button
                onClick={() => {
                  addElementsNewProperties({
                    viewer,
                    modelID: element.modelID,
                    expressIDs: [element.expressID],
                  });
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Ajouter propriété" />
              </ListItem> */}
              <ListItem button onClick={() => {
                setShowProperties(false);
                setSelectedElementID(null);
              }}>
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Fermer" />
              </ListItem>
            </Popover>
          </div>
        }
        title={`${ifcElement ? ifcElement.name : "Undefined"}`}
        subheader={`${ifcElement ? ifcElement.type : "Undefined"}`}
      />
      {isLoading ? (
        <CircularProgress color="inherit" />
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
                      >{`${pset.Name.value}`}</Typography>
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
