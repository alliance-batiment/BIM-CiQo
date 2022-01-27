import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Loader from "../../../../../../../Components/Loader";
import SearchBar from "../../../../../../../Components/SearchBar/SearchBar.jsx";
import PropertyList from "../PropertyList/PropertyList";

import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

// const useStyles = makeStyles({
//   root: {
//     height: 240,
//     flexGrow: 1,
//     maxWidth: 400,
//   },
// });

const ObjectList = ({
  classes,
  projectId,
  objSelected,
  addElementsNewProperties,
  selectedObject,
  selectedObjectSet,
  selectedObjectSetName,
  setSelectedObject,
  viewer,
  modelID,
  eids,
  setEids,
  handleNext,
  typeProperties,
  selectedPortal,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [objects, setObjects] = useState([]);
  const [objectListDefault, setObjectListDefault] = useState([]);
  const [objectsLoader, setObjectsLoader] = useState(false);
  const [objectListBeforeFlatting, setObjectListBeforeFlatting] = useState({});

  useEffect(() => {
    setObjectsLoader(true);
    async function getObjectsOfSelectedObject() {
      // const classes = await axios.get(
      //   `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${typeProperties}`,
      //   {
      //     headers: {
      //       "content-type": "application/json",
      //       "X-Auth-Token": sessionStorage.getItem("token"),
      //     },
      //   }
      // );

      const objectSet = await axios.get(
        `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}`,
        {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": sessionStorage.getItem("token"),
          },
        }
      );

      try {
        const values = await Promise.allSettled(
          objectSet.data.children.map(async (children) => {
            return await axios.get(
              `${process.env.REACT_APP_API_DATBIM}/objects/${children.id}`,
              {
                headers: {
                  "X-Auth-Token": sessionStorage.getItem("token"),
                },
              }
            );
          })
        );

        // const objects = values.reduce((acc, value) => {
        // 	if (value.data.properties) {
        // 		return acc.concat(value.data.properties);
        // 	}

        // 	return acc;
        // }, [])

        const objects = values.reduce((acc, value) => {
          if (value.status === "fulfilled") {
            acc.push(value.value.data);
          }
          return acc;
        }, []);

        await getChildren(objects, false);
      } catch (error) {
        console.log("error get objects", error);
      }
    }
    getObjectsOfSelectedObject();
  }, []);

  async function getChildren(objects, isChildrenObject) {
    let newObjects = [...objects];

    for (let i = 0; i < newObjects.length; i++) {
      for (let j = 0; j < newObjects[i].children.length; j++) {
        if (newObjects[i].children[j].name === undefined) {
          const newChildData = await axios.get(newObjects[i].children[j].ref, {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          });
          newObjects[i].children[j] = newChildData.data;
        }

        if (
          newObjects[i].children[j].children !== undefined &&
          newObjects[i].children[j].children.length > 0
        ) {
          await getChildren([newObjects[i].children[j]], true);
        }
      }
    }

    if (!isChildrenObject) {
      setObjectListBeforeFlatting({
        id: selectedObjectSet,
        name: selectedObjectSetName,
        children: [...newObjects],
      });
      flatChildren(newObjects);
      setObjectListDefault(newObjects);
      setObjects(newObjects);
      setObjectsLoader(false);
    }
  }

  async function flatChildren(objects) {
    //console.log("objects ==>", objects);
    objects.forEach((object, index) => {
      if (
        object.children !== undefined &&
        object.children.length > 0 &&
        (object.flatened === undefined || object.flatened === false)
      ) {
        objects.splice(index + 1, 0, ...object.children);
        object.flatened = true;
      }
    });
    let haveChildren = false;
    objects.forEach((object) => {
      if (
        object.children !== undefined &&
        object.children.length > 0 &&
        (object.flatened === undefined || object.flatened === false)
      ) {
        haveChildren = true;
      }
    });

    if (haveChildren) {
      flatChildren(objects);
    }
  }

  async function getObjects(typeProperties, selectedPage) {
    const classes = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${typeProperties}`,
      {
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );

    Promise.all(
      classes.data.properties.map(async (classProperty) => {
        return await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/objects/${classProperty.class_reference_id}`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );
      })
    ).then(function (values) {
      const objects = values.reduce((acc, value) => {
        if (value.data.properties) {
          return acc.concat(value.data.properties);
        }

        return acc;
      }, []);
      setObjectListDefault(objects);
      setObjects(objects);
      setObjectsLoader(false);
    });
  }

  function searchObject(input) {
    if (objectListDefault && objectListDefault.length > 0) {
      const filtered = objectListDefault.filter((object) => {
        const searchByObjectName = object.object_name
          .toLowerCase()
          .includes(input.toLowerCase());
        const searchByOrganizationName = object.organization_name
          .toLowerCase()
          .includes(input.toLowerCase());

        if (searchByObjectName) {
          return searchByObjectName;
        } else if (searchByOrganizationName) {
          return searchByOrganizationName;
        }
      });
      setSearchInput(input);
      setObjects(filtered);
    }
  }

  async function getObjectByKeyWord() {
    setObjectsLoader(true);

    try {
      const objectsList = await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_DATBIM}/datbim/portals/${selectedPortal}/objects`,
        params: { search: `${searchInput}` },
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      });
      console.log("getObjectByKeyWord", objectsList);
      setObjectListDefault(objectsList.data.objects.data);
      setObjects(objectsList.data.objects.data);
      setObjectsLoader(false);
    } catch (error) {
      setObjects([]);
      setObjectsLoader(false);
    }

    // const objects = objectsList.reduce((acc, value) => {
    // 	if (value.data.properties) {
    // 		return acc.concat(value.data.properties);
    // 	}

    // 	return acc;
    // }, [])
  }

  console.log(objectListBeforeFlatting);

  // Deux ID reçus parent + enfant.
  // Si pas d'enfant, récupérer premier ID (le second étant le parent)
  // Passer l'ID dans properties et afficher ses propriétés.

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => setSelectedObject(nodes.id)}
    >
      {Array.isArray(nodes.children) &&
        nodes.children.map((node) => <div>{renderTree(node)}</div>)}
    </TreeItem>
  );

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <SearchBar
            input={searchInput}
            onChange={searchObject}
            className={classes.searchBar}
            placeholder="Chercher un Objet"
          />
        </Grid>
        <Grid item xs={4}>
          <Button className={classes.button} onClick={getObjectByKeyWord}>
            Recherche par mot clé
          </Button>
        </Grid>
        <Grid item xs={12} style={{ display: "flex" }}>
          <Grid item xs={4}>
            {objectsLoader ? (
              <Grid container justify="center">
                <CircularProgress color="inherit" />
              </Grid>
            ) : (
              <>
                {/* {objects?.map((object, index) => (
                  <Card
                    key={index}
                    className={`${classes.root} ${classes.datBimCard}`}
                  >
                    <CardContent
                      onClick={() => {
                        setSelectedObject(object.id);
                        //console.log("object.id ==>", object.id);
                      }}
                    >
                      <p className={classes.datBimCardTitle}>
                        {object.parent_name}
                      </p>
                      <p className={classes.datBimCardTitle}>
                        {object.organization_name} - {object.name}
                      </p>
                    </CardContent>
                  </Card>
                ))} */}
                {objectListBeforeFlatting && (
                  <TreeView
                    aria-label="rich object"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={["root"]}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                      height: 110,
                      flexGrow: 1,
                      maxWidth: 400,
                      overflowY: "auto",
                    }}
                  >
                    {renderTree(objectListBeforeFlatting)}
                  </TreeView>
                )}

                {/* {objects?.meta && (
                  <Pagination
                    count={objects.meta.current_items}
                    onChange={(e, value) => getObjects(typeProperties, value)}
                    variant="outlined"
                  />
                )} */}
              </>
            )}
          </Grid>
          <Grid item xs={8}>
            <PropertyList
              classes={classes}
              projectId={projectId}
              objSelected={objSelected}
              selectedObject={selectedObject}
              viewer={viewer}
              modelID={modelID}
              eids={eids}
              setEids={setEids}
              addElementsNewProperties={addElementsNewProperties}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ObjectList;
