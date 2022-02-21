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
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SearchBar from "../../../../../../../Components/SearchBar/SearchBar.jsx";
import DefineTypeComponent from "./DefineTypeComponent";

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

const PropertyList = ({
  projectId,
  setLoader,
  objSelected,
  selectedObject,
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
  const history = useHistory();
  const classes = useStyles();

  function searchProperty(input) {
    const filtered = propertyListDefault.filter((property) => {
      return property.property_name.toLowerCase().includes(input.toLowerCase());
    });
    setSearchInput(input);
    setProperties(filtered);
  }

  function addProperties(properties, objSelected) {
    setLoader(true);

    const formatedProperties = properties.map((property) => {
      if (property.data_type_name === "Date") {
        return {
          ...property,
          text_value: moment(property.text_value).format("DD/MM/YYYY"),
        };
      }
      return property;
    });
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/createPset/${projectId}`,
        {
          products: formatedProperties,
          target: objSelected,
        },
        {
          headers: {
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      )
      .then(({ data }) => {
        const formData = new FormData();
        formData.append("files", data);
        axios
          .post(process.env.REACT_APP_API_URL, formData)
          .then((value) => {
            return value.data;
          })
          .then(({ projectId }) => {
            axios
              .get(`${process.env.REACT_APP_API_URL}/p/${projectId}`)
              .then(() => {
                history.push(`/temp`);
                history.goBack();
                setLoader(false);
              });
          })
          .catch((error) => {
            console.log("ERRORRR", error);
            alert("Echec de l'enrichissement");
            setLoader(false);
          });
      })
      .catch((error) => {
        console.log("ERRORRR", error);
        alert("Echec de l'enrichissement");
        setLoader(false);
      });
  }

  useEffect(() => {
    async function getPropertiesValues() {
      try {
        const { data: dataProp } = await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObject}/properties-values`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );
        //console.log("data", dataProp);
        const temporaryFixProperties = dataProp.data.map((property) => {
          if (
            property.data_type_name === "Entier" &&
            property.text_value === "A saisir"
          ) {
            return {
              ...property,
              text_value: 0,
            };
          }
          return property;
        });
        setPropertyListDefault(temporaryFixProperties);
        setProperties(temporaryFixProperties);
      } catch (err) {
        console.log("error", err);
      }
    }

    getPropertiesValues();
  }, [selectedObject]);

  const configureProperty = (index) => (e, value) => {
    let inputValue = e.target.value;
    let newPropertiesArr = [...properties];
    newPropertiesArr[index].text_value = inputValue || value;
    setProperties(newPropertiesArr);
  };

  const addElementsDatBimProperties = (properties, objSelected) => {
    addElementsNewProperties({
      viewer,
      modelID,
      expressIDs: eids,
      properties,
    });
    handleShowMarketplace("home");
  };

  return (
    <TableContainer component={Paper}>
      {/* <SearchBar
            input={searchInput}
            onChange={searchProperty}
            className={classes.searchBar}
            placeholder="Chercher un Objet"
          /> */}
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={`${classes.root} ${classes.datBimCardTitle}`}>
            <TableCell>Propriété</TableCell>
            <TableCell align="center">Valeur</TableCell>
            <TableCell align="center">Unité</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties?.map((property, propertyIndex) => (
            <TableRow
              key={property.property_id}
              className={`${classes.root} ${classes.datBimList}`}
            >
              <TableCell width="40%" component="th" scope="row">
                {property.property_name}
              </TableCell>
              <TableCell width="40%" align="right">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid row align="right">
        <Button
          variant="contained"
          onClick={() => addElementsDatBimProperties(properties, objSelected)}
          color="primary"
          className={classes.button}
        >
          Ajouter
        </Button>
      </Grid>
    </TableContainer>
  );
};

export default PropertyList;
