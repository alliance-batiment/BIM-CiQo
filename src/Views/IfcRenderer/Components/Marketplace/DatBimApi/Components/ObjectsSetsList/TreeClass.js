import { useState, useEffect } from "react";
import axios from "axios";
import { Grid, CircularProgress } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const TreeClass = ({
  selectedPortal,
  setSelectedClassID,
  getobjectsSetsBySelectedClass,
  handleNext,
}) => {
  const [classListing, setClassListing] = useState({});
  const [treeClassListLoader, setTreeClassListLoader] = useState(false);

  useEffect(() => {
    getTreeClassList();
  }, []);

  async function getTreeClassList() {
    setTreeClassListLoader(true);
    const treeClassList = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/tree-class`,
      {
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      }
    );
    console.log(treeClassList);
    setClassListing({
      id: "ClassList",
      name: "Liste des classes",
      children: treeClassList.data,
    });
    setTreeClassListLoader(false);
  }

  // async function getObjectsSets() {
  //   setObjectsSetsListLoader(true);
  //   const organizations = await axios.get(
  //     `${process.env.REACT_APP_API_DATBIM}/portals/${selectedPortal}/organizations`,
  //     {
  //       headers: {
  //         "X-Auth-Token": sessionStorage.getItem("token"),
  //       },
  //     }
  //   );

  //   Promise.allSettled(
  //     organizations.data.data.map(async (organizationProperty) => {
  //       return await axios.get(
  //         `${process.env.REACT_APP_API_DATBIM}/organizations/${organizationProperty.organization_id}/object-sets`,
  //         {
  //           headers: {
  //             "X-Auth-Token": sessionStorage.getItem("token"),
  //           },
  //         }
  //       );
  //     })
  //   ).then(function (values) {
  //     const objects = values.reduce((acc, value) => {
  //       if (value.status === "fulfilled") {
  //         value.value.data.data.map((value) => acc.push(value));
  //       }
  //       return acc;
  //     }, []);
  //     setObjectsSetsListDefault(objects);
  //     setObjectsSetsListLoader(false);
  //   });
  // }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => {
        if (nodes.children.length === 0) {
          console.log("nodes.id", nodes.id);
          getobjectsSetsBySelectedClass(nodes.id);
        }
      }}
    >
      {Array.isArray(nodes.children) &&
        nodes.children.map((node) => <div>{renderTree(node)}</div>)}
    </TreeItem>
  );

  return (
    <>
      {treeClassListLoader ? (
        <Grid container justify="center">
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <>
          {classListing && (
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
              {console.log("classListing", classListing)}
              {renderTree(classListing)}
            </TreeView>
          )}
        </>
      )}
    </>
  );
};

export default TreeClass;
