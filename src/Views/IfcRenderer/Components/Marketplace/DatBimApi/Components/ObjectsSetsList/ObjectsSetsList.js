import { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Breadcrumbs,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import SearchBar from "../../../../../../../Components/SearchBar";
import Pagination from "@material-ui/lab/Pagination";
import TreeClass from "./TreeClass";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
    height: "8em",
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
    fontWeight: "bold",
  },
  datBimCardDesc: {
    margin: 0,
    fontStyle: "italic",
  },
  button: {
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

const ObjectsSetsList = ({
  viewer,
  selectedPortal,
  setSelectedObjectSet,
  setSelectedObjectSetName,
  eids,
  handleNext,
}) => {
  const classes = useStyles();

  const [objectsSetsList, setObjectsSetsList] = useState([]);
  const [objectsSetsListDefault, setObjectsSetsListDefault] = useState([]);
  const [objectsSetsListWithEIDS, setObjectsSetsListWithEIDS] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [objectsSetsListLoader, setObjectsSetsListLoader] = useState(false);

  useEffect(() => {
    getObjectsSetsList();
  }, [eids]);

  const getObjectsSetsList = () => {
    if ((eids.length > 0) & (searchInput.length > 0)) {
      getobjectsSetsBySelectedEids();
    } else if (eids.length > 0) {
      getobjectsSetsBySelectedEids();
    } else {
      setSearchInput("");
      setObjectsSetsList(objectsSetsListDefault);
      getObjectsSets();
    }
  };

  const getObjectsSets = async () => {
    setObjectsSetsListLoader(true);

    if (objectsSetsListDefault && objectsSetsListDefault.length > 0) {
      setObjectsSetsListLoader(false);
    } else {
      const organizations = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/organizations`,
        {
          headers: {
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );

      Promise.allSettled(
        organizations.data.data.map(async (organizationProperty) => {
          return await axios.get(
            `${process.env.REACT_APP_API_DATBIM}/organizations/${organizationProperty.organization_id}/object-sets`,
            {
              headers: {
                "X-Auth-Token": sessionStorage.getItem("token"),
              },
            }
          );
        })
      ).then(function (values) {
        const objectsSets = values.reduce((acc, value) => {
          if (value.status === "fulfilled") {
            value.value.data.data.map((value) => acc.push(value));
          }
          return acc;
        }, []);
        setObjectsSetsListDefault(objectsSets);
        setObjectsSetsList(objectsSets);

        // console.log("objectsSetsListDefault", objectsSets);
        setObjectsSetsListLoader(false);
      });
    }
  };

  const getobjectsSetsBySelectedClass = async (classId) => {
    setObjectsSetsListLoader(true);
    const objectsSetsBySelectedClass = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/classes/${classId}/object-sets`,
      {
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );

    setObjectsSetsList(objectsSetsBySelectedClass.data.data);
    setObjectsSetsListLoader(false);
  };

  const getobjectsSetsBySelectedEids = async () => {
    setObjectsSetsListLoader(true);
    const ifcClass = await viewer.IFC.loader.ifcManager.getIfcType(0, eids[0]);
    const treeClassList = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${ifcClass}`,
      {
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );
    // console.log("treeClassList.data.data", treeClassList.data.data);

    Promise.allSettled(
      treeClassList.data.data.map(async (treeClassListElement) => {
        return await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/classes/${treeClassListElement.class_reference_id}/object-sets`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );
      })
    ).then(function (values) {
      const objectsSets = values.reduce((acc, value) => {
        if (value.status === "fulfilled") {
          value.value.data.data.map((value) => acc.push(value));
        }
        return acc;
      }, []);
      setObjectsSetsListWithEIDS(objectsSets);
      setObjectsSetsList(objectsSets);
      // console.log("ObjectsSetsListWithEIDS", objectsSets);
      setObjectsSetsListLoader(false);
    });
  };

  const searchObject = (input) => {
    // console.log("input ==>", input);
    if (eids.length > 0) {
      if (objectsSetsListWithEIDS && objectsSetsListWithEIDS.length > 0) {
        const filtered = objectsSetsListWithEIDS.filter((objectsSets) => {
          // console.log("objectsSetsListWithEIDS", objectsSetsListWithEIDS);
          const searchByObjectName = objectsSets.object_name
            .toLowerCase()
            .includes(input.toLowerCase());
          // const searchByOrganizationName = object.organization_name
          //   .toLowerCase()
          //   .includes(input.toLowerCase());

          if (searchByObjectName) {
            // console.log("searchByObjectName", searchByObjectName);
            return searchByObjectName;
          }
          // else if (searchByOrganizationName) {
          //   return searchByOrganizationName;
          // }
        });
        setSearchInput(input);
        setObjectsSetsList(filtered);
      }
    } else {
      if (objectsSetsListDefault && objectsSetsListDefault.length > 0) {
        const filtered = objectsSetsListDefault.filter((objectsSets) => {
          const searchByObjectName = objectsSets.object_name
            .toLowerCase()
            .includes(input.toLowerCase());
          // const searchByOrganizationName = object.organization_name
          //   .toLowerCase()
          //   .includes(input.toLowerCase());

          if (searchByObjectName) {
            return searchByObjectName;
          }
          // else if (searchByOrganizationName) {
          //   return searchByOrganizationName;
          // }
        });
        setSearchInput(input);
        setObjectsSetsList(filtered);
      }
    }
  };

  const getObjectsSetsByKeyWord = async () => {
    setObjectsSetsListLoader(true);

    const organizations = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/organizations`,
      {
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );

    Promise.allSettled(
      organizations.data.data.map(async (organizationProperty) => {
        return await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_DATBIM}/organizations/${organizationProperty.organization_id}/object-sets`,
          params: { search: `${searchInput}` },
          headers: {
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        });
      })
    ).then(function (values) {
      // console.log("values", values);
      const objectsSets = values.reduce((acc, value) => {
        if (value.status === "fulfilled") {
          value.value.data.data.map((value) => acc.push(value));
        }
        return acc;
      }, []);
      // console.log("objectsSets", objectsSets);
      setObjectsSetsList(objectsSets);

      // console.log("objectsSetsListDefault", objectsSets);
      setObjectsSetsListLoader(false);
    });
  };

  const resetObjectsSetsList = () => {
    setObjectsSetsList(objectsSetsListDefault);
  };

  return (
    <Grid container spacing={3}>
      {objectsSetsListLoader ? (
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography color="text.primary">{selectedPortal}</Typography>
            </Breadcrumbs>
          </Grid>
          <Divider />
          <Grid item xs={6}>
            <SearchBar
              input={searchInput}
              onChange={searchObject}
              className={classes.searchBar}
              placeholder="Mot clé"
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              className={classes.button}
              onClick={getObjectsSetsByKeyWord}
            >
              Recherche par mot clé
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button className={classes.button} onClick={resetObjectsSetsList}>
              Réinitialiser
            </Button>
          </Grid>

          <Grid item xs={4}>
            <TreeClass
              selectedPortal={selectedPortal}
              getobjectsSetsBySelectedClass={getobjectsSetsBySelectedClass}
            />
          </Grid>
          <Grid item xs={8}>
            {objectsSetsListLoader ? (
              <Grid container justify="center">
                <CircularProgress color="inherit" />
              </Grid>
            ) : (
              <Grid container spacing={1}>
                {((eids.length > 0) & (searchInput.length === 0)
                  ? objectsSetsListWithEIDS
                  : objectsSetsList
                )?.map((object, index) => (
                  <Grid item sm={4}>
                    <Card
                      key={index}
                      className={`${classes.root} ${classes.datBimCard}`}
                    >
                      <CardContent
                        onClick={() => {
                          setSelectedObjectSet(object.object_id);
                          setSelectedObjectSetName(object.object_name);
                          handleNext();
                        }}
                      >
                        <Typography className={classes.datBimCardTitle}>
                          {object.object_name}
                          <br />-
                        </Typography>
                        <Typography className={classes.datBimCardDesc}>
                          {object.organization_name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {objectsSetsList?.meta && (
                  <Pagination
                    count={objectsSetsList.meta.current_items}
                    onChange={(e, value) => getObjectsSetsList()}
                    variant="outlined"
                  />
                )}
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ObjectsSetsList;
