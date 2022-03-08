import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, CircularProgress } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import TreeClass from "./TreeClass";

const ObjectsSetsList = ({
  classes,
  selectedPortal,
  setSelectedObjectSet,
  setSelectedObjectSetName,
  eids,
  handleNext,
}) => {
  const [objectsSetsListDefault, setObjectsSetsListDefault] = useState([]);
  const [objectsSetsListWithEIDS, setObjectsSetsListWithEIDS] = useState([]);
  const [objectsSetsListLoader, setObjectsSetsListLoader] = useState(false);

  useEffect(() => {
    getObjectsSetsList();
  }, [eids]);

  const getObjectsSetsList = () => {
    if (eids.length > 0) {
      // console.log("eids.length > 0");
      getobjectsSetsBySelectedEids();
    } else {
      // console.log("eids.length === 0");
      getobjectsSets();
    }
  };

  const getobjectsSets = async () => {
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

    setObjectsSetsListDefault(objectsSetsBySelectedClass.data.data);
    setObjectsSetsListLoader(false);
  };

  const getobjectsSetsBySelectedEids = async () => {
    setObjectsSetsListLoader(true);
    const treeClassList = await axios.get(
      `${process.env.REACT_APP_API_DATBIM}/classes/mapping/IfcWall`,
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
      // console.log("ObjectsSetsListWithEIDS", objectsSets);
      setObjectsSetsListLoader(false);
    });
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <TreeClass
          selectedPortal={selectedPortal}
          getobjectsSetsBySelectedClass={getobjectsSetsBySelectedClass}
        />
      </Grid>
      <Grid item xs={6}>
        {objectsSetsListLoader ? (
          <Grid container justify="center">
            <CircularProgress color="inherit" />
          </Grid>
        ) : (
          <>
            {(eids.length > 0
              ? objectsSetsListWithEIDS
              : objectsSetsListDefault
            )?.map((object, index) => (
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
                  <p className={classes.datBimCardTitle}>
                    {object.parent_name}
                  </p>
                  <p className={classes.datBimCardTitle}>
                    {object.organization_name} - {object.object_name}
                  </p>
                </CardContent>
              </Card>
            ))}
            {objectsSetsListDefault?.meta && (
              <Pagination
                count={objectsSetsListDefault.meta.current_items}
                onChange={(e, value) => getObjectsSetsList()}
                variant="outlined"
              />
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default ObjectsSetsList;
