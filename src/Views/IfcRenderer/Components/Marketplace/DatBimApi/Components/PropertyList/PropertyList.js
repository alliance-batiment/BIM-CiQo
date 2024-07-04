import { useEffect, useState } from "react";

import {
  Grid,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Paper,
  TableCell,
  makeStyles,
  Input,
  InputLabel,
  InputAdornment,
  Tooltip,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SearchBar from "../../../../../../../Components/SearchBar/SearchBar.jsx";
import DefineTypeComponent from "./DefineTypeComponent";
import InfoIcon from "@mui/icons-material/Info";
import { IFCBUILDINGELEMENTPROXY, IFCSIUNIT } from "web-ifc";
import { IFCPROPERTYSINGLEVALUE } from "web-ifc";
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Branche from './Components/Branche';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    width: "100%",
    underline: "black",
    margin: "20px 0px",
    "&:before": {
      borderBottom: "1px solid #E6464D",
    },
    "&:after": {
      borderBottom: `2px solid #E6464D`,
    },
  },
  datBimList: {
    color: "white",
    "&:nth-child(odd)": {
      backgroundColor: "#DCDCDC",
      opacity: 0.8,
    },
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  table: {
    minWidth: "100%",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#E6464D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E6464D",
      color: "white",
    },
    "&:disabled": {
      opacity: 0.8,
      color: "white",
    },
  },
}));

const {
  REACT_APP_THIRD_PARTY_API,
  REACT_APP_API_DATBIM_HISTORY
} = process.env;

const PropertyList = ({
  projectId,
  setLoader,
  objSelected,
  selectedObject,
  bimData,
  setBimData,
  viewer,
  modelID,
  eids,
  setEids,
  addElementsNewProperties,
  handleShowMarketplace,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [propertyListDefault, setPropertyListDefault] = useState([]);
  const [properties, setProperties] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [contextKey, setContextKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState({});
  const [branche, setBranche] = useState({});

  function searchProperty(input) {
    const filtered = propertyListDefault.filter((property) => {
      return property.property_name.toLowerCase().includes(input.toLowerCase());
    });
    setSearchInput(input);
    setProperties(filtered);
  }


  useEffect(() => {
    const getPropertiesValues = async () => {
      try {
        setLoading(true);
        
        if(!contextKey && modelID > -1){
          const ifcSiUnits = await viewer.getAllItemsOfType(modelID, IFCSIUNIT, true, true);
          console.log('ifcSiUnits', ifcSiUnits);
          if(ifcSiUnits){
            const contextPropertyType = {};
            ifcSiUnits?.forEach(ifcSiUnit => {
              if (ifcSiUnit?.UnitType?.value && ifcSiUnit?.Name?.value) {
                const ifcPropertyType = mapIfcPropertyType(ifcSiUnit?.UnitType?.value);
                const unitSymbol = mapUnitSymbol(ifcSiUnit?.Prefix?.value ? ifcSiUnit?.Prefix?.value : ifcSiUnit?.Name?.value);
                contextPropertyType[ifcPropertyType] = unitSymbol;
              }
            });
  
            console.log("context==>", contextPropertyType);
            const context = {
              "propertyContext": {
                "mappings": {
                  "propertyType": "ifcPropertyType"
                },
                "units": {
                  "propertyType": contextPropertyType,
                  "propertyName": {}
                }
              }
            }
    
            const creatContext = await axios({
              method: "post",
              url: `${process.env.REACT_APP_API_DATBIM}/contexts`,
              headers: {
                "content-type": "application/json",
                "X-Auth-Token": sessionStorage.getItem("token"),
              },
              data: context
            });
            console.log('contextKey created', creatContext.data);
            setContextKey(creatContext.data.contextKey);
          }
        }
                
        const { data: dataProp } = await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObject}/properties-values?contextKey=${contextKey}`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );
        console.log("dataProp", dataProp);
        const dataPropFilter = dataProp.data.filter(
          (prop) => prop.property_visibility
        );

        const dataWithCheckStatus = dataPropFilter.map((property) => {
          return {
            ...property,
            checked: true,
          };
        });

        const temporaryFixProperties = dataWithCheckStatus.map((property) => {
          if (
            property.data_type_name === "Entier" &&
            property.text_value === "A saisir"
          ) {
            return {
              ...property,
              text_value: 0,
            };
          }

          if (property.data_type_name === "Lien") {
            const newLink = property.text_value.replace("Https", "https");
            return {
              ...property,
              text_value: newLink,
            };
          }
          // console.log("Property =>", property);
          return property;
        });

        setPropertyListDefault(temporaryFixProperties);
        setProperties(temporaryFixProperties);
        setLoading(false);
        // console.log("temporaryFixProperties", temporaryFixProperties);
      } catch (err) {
        setLoading(false);
        console.log("error", err);
      }
    };

    getPropertiesValues();
  }, [selectedObject, contextKey]);

  const mapIfcPropertyType = (unitType) => {
    switch (unitType) {
      case "LENGTHUNIT":
        return "IfcLengthMeasure"
      case "AREAUNIT":
        return "IfcAreaMeasure"
      case "VOLUMEUNIT":
        return "IfcVolumeMeasure"
      case "TIMEUNIT":
        return "IfcTimeMeasure"
      case "PLANEANGLEUNIT":
        return "IfcPlaneAngleMeasure"
      default:
        return unitType
    }
  }

  const mapUnitSymbol = (unitName) => {
    switch (unitName) {
      case "METRE":
        return "m"
      case "MILLI":
        return "mm"
      
      case "SQUARE_METRE":
        return "m²"
      case "CUBIC_METRE":
        return "m3"
      case "SECOND":
        return "s"
      case "RADIAN":
        return "rad"
      default:
        return unitType
    }
  }

  const handleCheckedProperties = (e) => {
    // console.log(`Checkbox id:`, e.target.id);
    // console.log(`Checkbox check:`, e.target.checked);
    console.log("properties", properties);

    const index = e.target.id;
    const checkStatus = e.target.checked;

    const newPropertiesArr = [...properties];
    newPropertiesArr[index].checked = checkStatus;

    if (!checkStatus) {
      setAllChecked(false);
    } else {
      for (let i = 0; i < properties.length; i++) {
        if (properties[i].checked === true) {
          setAllChecked(true);
        } else {
          setAllChecked(false);
          break;
        }
      }
    }

    setProperties(newPropertiesArr);
  };

  const handleGlobalCheckedProperties = (e) => {
    const checked = e.target.checked;

    if (!checked) {
      // console.log("properties ==>", properties);
      // console.log("All checked ==> now to be unchecked");

      properties.map((property) => {
        property.checked = false;
      });

      setAllChecked(false);
    } else {
      // console.log("properties 2 ==>", properties);
      // console.log("One or more are unchecked ==> all are now checked");

      properties.map((property) => {
        property.checked = true;
      });

      setAllChecked(true);
    }
  };

  const configureProperty = (index, key) => (e, value) => {
    // console.log("Value =>", value);
    // console.log("index=>", index);

    // console.log("properties", properties);

    // let keyValue = key ? key : 'text_value';
    let inputValue = e.target.value;

    let property = properties[index];
    const newPropertiesArr = [...properties];
    switch (property.data_type_name) {
      case "Intervalle":
        newPropertiesArr[index]['num_value'] = inputValue || value;
        newPropertiesArr[index]['text_value'] = inputValue || value;
        break;
      default:
        newPropertiesArr[index]['text_value'] = inputValue || value;
        break;
    }
    // const newPropertiesArr = [...properties];
    // newPropertiesArr[index][keyValue] = inputValue || value;
    // newPropertiesArr[index].value = inputValue || value;

    setProperties(newPropertiesArr);
  };


  const updatePorperty = (property) => {
    switch (property.data_type_name) {
      case "Intervalle":
        return {
          ...property,
          text_value: property.num_value,
          value: property.num_value
        }
      case "Grid/Tableau":
        const { values } = JSON.parse(property.text_value)
        const newValues = [];
        for (let value of values) {
          newValues.push(`${value[0].data}: ${value[1].data}`)
        }
        return {
          ...property,
          text_value: newValues.toString(),
          value: newValues.toString(),
        }
      default:
        return {
          ...property,
          value: property.text_value
        };
    }
  }



  const addElementsDatBimProperties = async (properties, objSelected) => {
    const filteredProperties = properties.filter(
      (property) => property.checked
    );

    const updateProperties = [];
    for (let property of filteredProperties) {
      updateProperties.push(updatePorperty(property));
    }

    console.log('updateProperties', updateProperties)
    console.log('objSelected', objSelected)
    const response = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DATBIM}/objects/${objSelected}/signing`,
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": sessionStorage.getItem("token"),
      },
      data: updateProperties
    });

    console.log('data', response.data)    
    await addElementsNewProperties({
      bimData,
      setBimData,
      viewer,
      modelID,
      expressIDs: eids,
      properties: response?.data?.property ? response?.data?.property : updateProperties,
    });

    // Creat commit
    // await handleAddCommit(response?.data?.property, viewer, modelID, eids);

    handleShowMarketplace("home");
  };

  const handleAddCommit = async (properties, viewer, modelID, eids) => {
    const ifcManager = await viewer.IFC.loader.ifcManager;
    const bimModelId = {};
    const integrityObjectSignatureValue = properties?.find(p => p?.datbim_code === "IntegrityObjectSignature")?.text_value;
  
    for (const expressId of eids) {
      try {
        const itemProperties = await ifcManager.getItemProperties(modelID, expressId);
        const ifcGuid = itemProperties?.GlobalId?.value;
        console.log('ifcGuid:', ifcGuid);
        bimModelId[ifcGuid] = integrityObjectSignatureValue;
      } catch (error) {
        console.error('Error fetching item properties:', error);
      }
    }
  
    const commit = {
      timestamp: new Date().toISOString(),
      author: "string",
      comment: "save enrichment",
      bimModelId: bimModelId
    };
    console.log('commit to add', commit);

    try {
      const newCommit = await axios.post(`${REACT_APP_THIRD_PARTY_API}/history/addCommit`,
      {
        projectId: project,
        branchName: branche?.name,
        commit: commit
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      console.log('newCommit handleAddCommit', newCommit);
     
    } catch (err) {
      console.log('Internal server error', err);
    }
  };

  return (
    <TableContainer component={Paper}>
      {/* <SearchBar
            input={searchInput}
            onChange={searchProperty}
            className={classes.searchBar}
            placeholder="Chercher un Objet"
          /> */}

      {loading && (
        <LinearProgress color="secondary" />
      )}
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={`${classes.root} ${classes.datBimCardTitle}`}>
            <TableCell>Propriété</TableCell>
            <TableCell align="center">Info</TableCell>
            <TableCell align="center">Valeur</TableCell>
            <TableCell align="center">Unité</TableCell>
            {selectedObject ? (
              <TableCell align="center">
                Ajouter
                <Checkbox
                  defaultChecked
                  checked={allChecked}
                  onChange={handleGlobalCheckedProperties}
                />
              </TableCell>
            ) : (
              ""
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {properties?.map((property, propertyIndex) => (
            <TableRow
              key={propertyIndex}
              className={`${classes.root} ${classes.datBimList}`}
            >
              <TableCell width="35%" component="th" scope="row">
                {property.property_name}
              </TableCell>
              <TableCell width="10%" component="th" scope="row">
                {property.property_definition && (
                  <Tooltip
                    title={`${property.property_definition}`}
                    placement="top-start"
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell width="35%" align="right">
                {DefineTypeComponent(
                  property.data_type_name,
                  property,
                  propertyIndex,
                  configureProperty
                )}
              </TableCell>
              <TableCell width="10%" align="center">
                {property.unit}
              </TableCell>
              <TableCell width="10%" align="center">
                <Checkbox
                  defaultChecked
                  checked={properties[propertyIndex].checked}
                  onChange={handleCheckedProperties}
                  id={propertyIndex}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedObject && properties?.length>0 && 
        <>
          <Grid item xs={12} style={{ marginLeft: '20px'}}>
            <Branche 
              selectedObject={selectedObject}
              project={project}
              setProject={setProject}
              branche={branche}
              setBranche={setBranche}
              viewer={viewer}
            />
          </Grid>
          <Grid row align="right">
            <Button
              variant="contained"
              onClick={() => {
                addElementsDatBimProperties(properties, selectedObject);
              }}
              color="primary"
              className={classes.button}
            >
              Ajouter
            </Button>
          </Grid>
        </>
      }
      
    </TableContainer>
  );
};

export default PropertyList;
