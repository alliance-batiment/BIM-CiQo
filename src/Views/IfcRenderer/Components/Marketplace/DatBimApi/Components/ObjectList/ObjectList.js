import { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles, Grid, CircularProgress } from "@material-ui/core";
import PropertyList from "../PropertyList/PropertyList";
import SelectionComponent from "./SelectionComponent";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
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
  navigationBar: {
    margin: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  modalDatBim: {
    width: "50%",
    height: "70%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "hidden scroll",
    position: "relative",
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
    height: "8em",
  },
  datBimTitle: {
    textAlign: "center",
    textTransform: "none",
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  datBimFooterCard: {
    display: "block",
    textAlign: "right",
  },
  datBimCardButton: {
    textAlign: "right",
    color: "white",
  },
  accordionDetails: {
    display: "block",
  },
  datBimIcon: {
    width: "3em",
  },
}));

const ObjectList = ({
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
  const classes = useStyles();

  const [searchBarInput, setSearchBarInput] = useState("");
  const [selectors, setSelectors] = useState([]);
  const [selectorsRequest, setSelectorsRequest] = useState([]);
  const [selectorsLoader, setSelectorsLoader] = useState(false);
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
    setObjectsLoader(true);
    //console.log("selectorsRequest ==>", selectorsRequest);
    const objectsOfAdvancedSearch = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_DATBIM}/objects/${selectedObjectSet}/search-on-selector?tree=1`,
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": sessionStorage.getItem("token"),
      },
      data: {
        keyword: searchBarInput,
        property: selectorsRequest,
      },
    });

    setSelectors(objectsOfAdvancedSearch.data.search);
    // console.log(
    //   "objectsListOfAdvancedSearch.data.result ==>",
    //   objectsOfAdvancedSearch.data.result
    // );
    setObjectListing({
      id: "FiltredObjects",
      name: "Liste des objets filtrés",
      children: objectsOfAdvancedSearch.data.result,
    });
    setSelectorsLoader(false);
    setObjectsLoader(false);
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

    setObjectListing(treeOfObjectSet.data);
    //console.log("objectListing ==>", treeOfObjectSet.data);

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

  const childRenderTree = ([renderedChildren, count], node) => {
    const [renderedChild, newCount] = renderTree(node, count);
    return [renderedChildren.concat(<div>{renderedChild}</div>), newCount];
  };

  const renderTree = (nodes, count) => {
    const [children, newCount] =
      Array.isArray(nodes.children) && nodes.children.length > 0
        ? nodes.children.reduce(childRenderTree, [[], count])
        : [null, count + 1];
    // setObjectCounter(newCount);
    return [
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        onClick={() => setSelectedObject(nodes.id)}
      >
        {children}
      </TreeItem>,
      newCount,
    ];
  };

  let listing = null;

  if (objectListing) {
    const [tree, count] = renderTree(objectListing, 0);

    listing = (
      <div>
        <p>Objets trouvés: {count}</p>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={
            objectListing.id === "FiltredObjects"
              ? [`${objectListing.id}`, `${objectListing.children[0].id}`]
              : [`${objectListing.id}`]
          }
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{
            height: 110,
            flexGrow: 1,
            maxWidth: 400,
            overflowY: "auto",
          }}
        >
          {tree}
        </TreeView>
      </div>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <SelectionComponent
          classes={classes}
          selectors={selectors}
          setSelectors={setSelectors}
          selectorsLoader={selectorsLoader}
          getObjectsOfAdvancedSearch={getObjectsOfAdvancedSearch}
          selectorsRequest={selectorsRequest}
          setSelectorsRequest={setSelectorsRequest}
          getSelectorsOfObjectSet={getSelectorsOfObjectSet}
          setSearchBarInput={setSearchBarInput}
          getObjectsOfSelectedObject={getObjectsOfSelectedObject}
        />
        <Grid item xs={12} style={{ display: "flex" }}>
          <Grid item xs={4}>
            {objectsLoader ? (
              <Grid container justify="center">
                <CircularProgress color="inherit" />
              </Grid>
            ) : (
              <>
                {listing}

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
