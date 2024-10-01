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
  CardActions,
  CardActionArea,
  Chip,
} from "@material-ui/core";
import SearchBar from "../../../../../../../Components/SearchBar";
import Pagination from "@material-ui/lab/Pagination";
import TreeClass from "./TreeClass";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

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
    // height: "8em",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  datBimCardActionArea: {
    width: "100%",
    height: "100%",
  },
  datBimCardContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 0,
  },
  datBimCardTitle: {
    fontSize: 12,
    margin: 0,
    color: "white",
    fontWeight: "bold",
    padding: "1.5em 0 0 1.5em",
  },
  datBimCardDesc: {
    fontSize: 8,
    margin: 0,
    // fontStyle: "italic",
  },
  datBimCardImg: {
    width: "100%",
    height: "100%",
    marginBottom: "1em",
    maxHeight: "250px",
    objectFit: "contain",
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
  link: {
    color: "inherit",
    "&:hover": {
      color: "textPrimary",
      cursor: "pointer",
      textDecoration: "underline",
    },
  },

  noObjectSetsMessage: {
    textAlign: "center",
  },
}));

const ObjectsSetsList = ({
  viewer,
  selectedPortal,
  setSelectedObjectSet,
  setSelectedObjectSetName,
  eids,
  breadcrumbMap,
  setBreadcrumbMap,
  handleNext,
  setActiveStep,
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
    setSearchInput("");

    if (eids.length > 0) {
      getobjectsSetsBySelectedEids();
    } else {
      setObjectsSetsList(objectsSetsListDefault);
      getObjectsSets();
    }
  };

  const getObjectsSets = async () => {
    try {
      setObjectsSetsListLoader(true);

      if (objectsSetsListDefault && objectsSetsListDefault.length > 0) {
        setObjectsSetsListLoader(false);
      } else {
        const getObjectsSetsList = await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/object-sets`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );

        console.log("objectsSetsList", objectsSetsList);

        const objectsSets = getObjectsSetsList.data.data;

        console.log("objectsSetsList", objectsSets);

        setObjectsSetsListDefault(objectsSets);
        setObjectsSetsList(objectsSets);

        console.log("objectsSetsListDefault", objectsSets);
        setObjectsSetsListLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getobjectsSetsBySelectedClass = async (classId) => {
    try {
      setObjectsSetsListLoader(true);
      const objectsSetsBySelectedClass = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/object-sets/classes/${classId}`,
        {
          headers: {
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );

      setObjectsSetsList(objectsSetsBySelectedClass.data.data);
      setObjectsSetsListWithEIDS(objectsSetsBySelectedClass.data.data);
      setObjectsSetsListLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getobjectsSetsBySelectedEids = async () => {
    try {
      setObjectsSetsListLoader(true);
      const ifcClass = await viewer.IFC.loader.ifcManager.getIfcType(
        0,
        eids[0]
      );
      console.log("ifcClass", ifcClass);
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
            `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/object-sets/classes/${treeClassListElement.class_reference_id}`,
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
    } catch (error) {
      console.error(error);
    }
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
          const searchByOrganizationName = objectsSets.organization_name
            .toLowerCase()
            .includes(input.toLowerCase());

          if (searchByObjectName) {
            // console.log("searchByObjectName", searchByObjectName);
            return searchByObjectName;
          } else if (searchByOrganizationName) {
            return searchByOrganizationName;
          }
        });
        setSearchInput(input);
        setObjectsSetsList(filtered);
      } else {
        setSearchInput(input);
      }
    } else {
      if (objectsSetsListDefault && objectsSetsListDefault.length > 0) {
        const filtered = objectsSetsListDefault.filter((objectsSets) => {
          const searchByObjectName = objectsSets.object_name
            .toLowerCase()
            .includes(input.toLowerCase());
          const searchByOrganizationName = objectsSets.organization_name
            .toLowerCase()
            .includes(input.toLowerCase());

          if (searchByObjectName) {
            return searchByObjectName;
          } else if (searchByOrganizationName) {
            return searchByOrganizationName;
          }
        });
        setSearchInput(input);
        setObjectsSetsList(filtered);
      }
    }
  };

  const getObjectsSetsByKeyWord = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const resetObjectsSetsList = () => {
    setSearchInput("");
    setObjectsSetsList(objectsSetsListDefault);

    if (eids.length > 0) {
      getobjectsSetsBySelectedEids();
    }
  };

  const removeDuplicates = (list) => {
    const seen = new Set();
    return list?.filter((item) => {
      const duplicate = seen.has(item?.object_id);
      seen.add(item?.object_id);
      return !duplicate;
    });
  };

  let usedList =
    (eids.length > 0) & (searchInput.length === 0)
      ? removeDuplicates(objectsSetsListWithEIDS)
      : removeDuplicates(objectsSetsList);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Typography
            className={classes.link}
            onClick={(e) => setActiveStep(1)}
          >
            Portails
          </Typography>
          <Typography color="textPrimary">
            {breadcrumbMap[0]?.length > 15
              ? breadcrumbMap[0].slice(0, 15) + "..."
              : breadcrumbMap[0]}
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" component="h3">
          Sélectionnez une collection d'objets:
        </Typography>
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <SearchBar
          disabled={objectsSetsListLoader === true}
          input={searchInput}
          onChange={searchObject}
          className={classes.searchBar}
          placeholder="Mot clé"
          onClickOne={getObjectsSetsByKeyWord}
          onClickTwo={resetObjectsSetsList}
        />
      </Grid>
      {objectsSetsListLoader ? (
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <>
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
                {console.log('eids', eids)}
                {console.log('usedList', usedList)}

                {usedList.length === 0 ? (
                  <Grid item sm={12} className={classes.noObjectSetsMessage}>
                    Aucune collection trouvée. Veuillez faire une recherche par
                    mot clé.
                  </Grid>
                ) : (
                  usedList.map((object, index) => (
                    <Grid item sm={4}>
                      <Card
                        key={index}
                        className={`${classes.root} ${classes.datBimCard}`}
                      >
                        <CardActionArea
                          className={`${classes.datBimCardActionArea}`}
                        >
                          <CardContent
                            className={`${classes.datBimCardContent}`}
                            onClick={() => {
                              setSelectedObjectSet(object.object_id);
                              setSelectedObjectSetName(object.object_name);
                              setBreadcrumbMap([
                                ...breadcrumbMap,
                                object.object_name,
                              ]);
                              handleNext();
                            }}
                          >
                            <Typography className={classes.datBimCardTitle}>
                              {object.object_name}
                              <br />
                            </Typography>
                            <img
                              className={classes.datBimCardImg}
                              src={object.img_ref}
                              alt={object.object_name}
                            />
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          {/* <Typography className={classes.datBimCardDesc}>
                                          {object.organization_name}
                                        </Typography> */}
                          <Chip
                            className={classes.datBimCardDesc}
                            label={`${object.organization_name}`}
                          />
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                )}

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
