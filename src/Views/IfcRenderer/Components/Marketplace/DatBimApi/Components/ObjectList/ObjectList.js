import { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Grid,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Divider,
} from "@material-ui/core";
import PropertyList from "../PropertyList/PropertyList";
import SelectionComponent from "./SelectionComponent";

import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SearchBar from "../../../../../../../Components/SearchBar";

const useStyles = makeStyles((theme) => ({
  link: {
    color: "inherit",
    "&:hover": {
      color: "textPrimary",
      cursor: "pointer",
      textDecoration: "underline",
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
  breadcrumbMap,
  handleShowMarketplace,
  setActiveStep,
}) => {
  const classes = useStyles();

  const [searchBarInput, setSearchBarInput] = useState("");
  const [selectors, setSelectors] = useState([]);
  const [selectorsRequest, setSelectorsRequest] = useState([]);
  const [selectorsLoader, setSelectorsLoader] = useState(false);
  const [objectsLoader, setObjectsLoader] = useState(false);
  const [objectListing, setObjectListing] = useState({});
  const [selectedObjectName, setSelectedObjectName] = useState("");

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

  const getSelectorsOfObjectSet = async () => {
    try {
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
      // console.log("selectorsOfObjectSet.data", selectorsOfObjectSet.data);
      setSelectors(selectorsOfObjectSet.data);
      setSelectorsLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getObjectsOfAdvancedSearch = async (selectorsRequest) => {
    try {
      setSelectorsLoader(true);
      setObjectsLoader(true);
      // console.log("selectorsRequest ==>", selectorsRequest);
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
    } catch (error) {
      console.error(error);
    }
  };

  const getObjectsOfSelectedObject = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleChangeKeyword = (value) => {
    console.log(value);
    setSearchBarInput(value);
  };

  const resetSelectors = () => {
    setSearchBarInput("");
    setSelectorsRequest([]);
    getSelectorsOfObjectSet();
    getObjectsOfSelectedObject();
    setSelectedObject(null);
  };

  const childRenderTree = ([renderedChildren, count], node) => {
    const [renderedChild, newCount] = renderTree(node, count);
    return [renderedChildren.concat(<div>{renderedChild}</div>), newCount];
  };

  const renderTree = (nodes, count) => {
    const [children, newCount] =
      Array.isArray(nodes.children) && nodes.children.length > 0
        ? nodes.children.reduce(childRenderTree, [[], count])
        : [null, count + 1];

    return [
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        onClick={() => {
          setSelectedObject(nodes.id);
          setSelectedObjectName(nodes.name);
        }}
      >
        {children}
      </TreeItem>,
      newCount,
    ];
  };

  let listing = null;

  if (objectListing) {
    const [tree, count] = renderTree(objectListing, 0);

    console.log("objectListing", objectListing);
    listing = (
      <Grid item xs={12}>
        <Typography>Objets trouvés: {count}</Typography>
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
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Typography
              href="/"
              className={classes.link}
              onClick={(e) => setActiveStep(1)}
            >
              Portails
            </Typography>
            <Typography
              href="/"
              className={classes.link}
              onClick={(e) => setActiveStep(2)}
            >
              {breadcrumbMap[0].length > 15
                ? breadcrumbMap[0].slice(0, 15) + "..."
                : breadcrumbMap[0]}
            </Typography>
            <Typography color={selectedObjectName ? "inherit" : "textPrimary"}>
              {breadcrumbMap[1].length > 15
                ? breadcrumbMap[1].slice(0, 15) + "..."
                : breadcrumbMap[1]}
            </Typography>
            <Typography color={selectedObjectName ? "textPrimary" : "inherit"}>
              {selectedObject &&
                (selectedObjectName.length > 20
                  ? selectedObjectName.slice(0, 20) + "..."
                  : selectedObjectName)}
            </Typography>
          </Breadcrumbs>
          {!selectedObject && (
            <Typography color="inherit">Sélectionnez un objet</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <SearchBar
            disabled={objectsLoader === true}
            input={searchBarInput}
            onChange={handleChangeKeyword}
            className={classes.searchBar}
            placeholder="Mot clé"
            onClickOne={() => getObjectsOfAdvancedSearch(selectorsRequest)}
            onClickTwo={resetSelectors}
          />
        </Grid>
        <Divider />

        <Grid item sm={5}>
          {objectsLoader ? (
            <Grid container justify="center">
              <CircularProgress color="inherit" />
            </Grid>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SelectionComponent
                    classes={classes}
                    selectors={selectors}
                    selectorsLoader={selectorsLoader}
                    getObjectsOfAdvancedSearch={getObjectsOfAdvancedSearch}
                    selectorsRequest={selectorsRequest}
                    setSelectorsRequest={setSelectorsRequest}
                  />
                </Grid>
                {listing}
              </Grid>

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

        <Grid item sm={7}>
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
    </>
  );
};

export default ObjectList;
