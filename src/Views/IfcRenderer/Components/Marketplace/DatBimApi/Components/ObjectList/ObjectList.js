import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, CircularProgress } from "@material-ui/core";
import PropertyList from "../PropertyList/PropertyList";
import SelectionComponent from "./SelectionComponent";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const ObjectList = ({
  classes,
  projectId,
  objSelected,
  addElementsNewProperties,
  selectedObject,
  selectedObjectSet,
  setSelectedObject,
  viewer,
  modelID,
  eids,
  setEids,
  handleShowMarketplace,
}) => {
  const [searchBarInput, setSearchBarInput] = useState("");
  const [selectors, setSelectors] = useState([]);
  const [objectsListOfAdvancedSearch, setObjectsListOfAdvancedSearch] =
    useState([]);
  const [selectorsRequest, setSelectorsRequest] = useState([]);
  const [selectorsLoader, setSelectorsLoader] = useState(false);
  const [objects, setObjects] = useState([]);
  //const [objectListDefault, setObjectListDefault] = useState([]);
  const [objectsLoader, setObjectsLoader] = useState(false);
  const [objectListing, setObjectListing] = useState({});
  const [keepSelectedObjectColor, setKeepSelectedObjectColor] = useState(true);

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
    getSelectorsOfObjectSet();
    getObjectsOfSelectedObject();
  }, []);

  async function getSelectorsOfObjectSet() {
    setSelectorsLoader(true);
    const selectorsOfObjectSet = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/get-selector`,
      {
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );
    //console.log("selectorsOfObjectSet.data", selectorsOfObjectSet.data);
    setSelectors(selectorsOfObjectSet.data);
    setSelectorsLoader(false);
  }

  const getObjectsOfAdvancedSearch = async (selectorsRequest) => {
    setSelectorsLoader(true);
    console.log("selectorsRequest ==>", selectorsRequest);
    const objectsOfAdvancedSearch = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/search-on-selector`,
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": sessionStorage.getItem("token"),
      },
      data: {
        keyword: searchBarInput,
        property: selectorsRequest,
      },
    });

    console.log("objectsListOfAdvancedSearch ==>", objectsOfAdvancedSearch);

    setSelectors(objectsOfAdvancedSearch.data.search);
    setObjectsListOfAdvancedSearch(objectsOfAdvancedSearch.data.result);
    console.log(
      "objectsListOfAdvancedSearch.data.result ==>",
      objectsOfAdvancedSearch.data.result
    );
    setSelectorsLoader(false);
  };

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
    //console.log("selectedObjectSet ==>", selectedObjectSet);

    setObjectListing(treeOfObjectSet.data);
    console.log("objectListing ==>", treeOfObjectSet.data);

    setObjectsLoader(false);
  }

  // async function getObjects(typeProperties, selectedPage) {
  //   const classes = await axios.get(
  //     `${process.env.REACT_APP_API_DATBIM}/classes/mapping/${typeProperties}`,
  //     {
  //       headers: {
  //         "X-Auth-Token": sessionStorage.getItem("token"),
  //       },
  //     }
  //   );

  //   Promise.all(
  //     classes.data.properties.map(async (classProperty) => {
  //       return await axios.get(
  //         `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/objects/${classProperty.class_reference_id}`,
  //         {
  //           headers: {
  //             "X-Auth-Token": sessionStorage.getItem("token"),
  //           },
  //         }
  //       );
  //     })
  //   ).then(function (values) {
  //     const objects = values.reduce((acc, value) => {
  //       if (value.data.properties) {
  //         return acc.concat(value.data.properties);
  //       }

  //       return acc;
  //     }, []);
  //     setObjectListDefault(objects);
  //     setObjects(objects);
  //     setObjectsLoader(false);
  //   });
  // }

  // function searchObject(input) {
  //   if (objectListDefault && objectListDefault.length > 0) {
  //     const filtered = objectListDefault.filter((object) => {
  //       const searchByObjectName = object.object_name
  //         .toLowerCase()
  //         .includes(input.toLowerCase());
  //       const searchByOrganizationName = object.organization_name
  //         .toLowerCase()
  //         .includes(input.toLowerCase());

  //       if (searchByObjectName) {
  //         return searchByObjectName;
  //       } else if (searchByOrganizationName) {
  //         return searchByOrganizationName;
  //       }
  //     });
  //     setSearchInput(input);
  //     setObjects(filtered);
  //   }
  // }

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        style={{
          color: keepSelectedObjectColor
            ? `${objectsListOfAdvancedSearch.findIndex(
              (object) => object.id === nodes.id
            ) !== -1
              ? "red"
              : ""
            }`
            : "",
        }}
        onClick={() => setSelectedObject(nodes.id)}
      >
        {Array.isArray(nodes.children) &&
          nodes.children.map((node) => <div>{renderTree(node)}</div>)}
      </TreeItem>
    );
  };

  return (
    <>
      <Grid container spacing={3}>
        <SelectionComponent
          classes={classes}
          selectors={selectors}
          selectorsLoader={selectorsLoader}
          setSelectors={setSelectors}
          selectorsRequest={selectorsRequest}
          setSelectorsRequest={setSelectorsRequest}
          getObjectsOfAdvancedSearch={getObjectsOfAdvancedSearch}
          getSelectorsOfObjectSet={getSelectorsOfObjectSet}
          setSearchBarInput={setSearchBarInput}
          setKeepSelectedObjectColor={setKeepSelectedObjectColor}
        />
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
                    {console.log("objectListing ==>", objectListing)}
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
