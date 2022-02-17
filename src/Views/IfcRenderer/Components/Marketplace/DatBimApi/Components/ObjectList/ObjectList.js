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
  handleShowMarketplace,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [objects, setObjects] = useState([]);
  const [objectListDefault, setObjectListDefault] = useState([]);
  const [objectsLoader, setObjectsLoader] = useState(false);
  const [objectListing, setObjectListing] = useState({});

  // const classes = await axios.get(
  //   `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${typeProperties}`,
  //   {
  //     headers: {
  //       "content-type": "application/json",
  //       "X-Auth-Token": sessionStorage.getItem("token"),
  //     },
  //   }
  // );

  useEffect(() => {
    getObjectsOfSelectedObject();
  }, []);

  async function getObjectsOfSelectedObject() {
    setObjectsLoader(true);

    const treeOfObjectSet = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/tree-structure`,
      {
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );

    setObjects(treeOfObjectSet.data.children);

    setObjectListing(treeOfObjectSet.data);

    setObjectsLoader(false);
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
  }

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
        {/* <Grid item xs={8}>
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
        </Grid> */}
        <Grid item xs={12} style={{ display: "flex" }}>
          <Grid item xs={4}>
            {objectsLoader ? (
              <Grid container justify="center">
                <CircularProgress color="inherit" />
              </Grid>
            ) : (
              <>
                {objectListing && (
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
                    {renderTree(objectListing)}
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
              handleShowMarketplace={handleShowMarketplace}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ObjectList;
