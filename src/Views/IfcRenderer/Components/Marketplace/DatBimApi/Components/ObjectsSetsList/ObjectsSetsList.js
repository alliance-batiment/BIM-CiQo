import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import TreeClass from "./TreeClass";

const ObjectsSetsList = ({
  classes,
  selectedPortal,
  setSelectedObjectSet,
  setSelectedObjectSetName,
  handleNext,
}) => {
  const [objectsSetsListDefault, setObjectsSetsListDefault] = useState([]);
  const [objectsSetsListLoader, setObjectsSetsListLoader] = useState(false);
  // const [selectedClassID, setSelectedClassID] = useState(null);

  useEffect(() => {
    getObjectsSets();
  }, []);

  async function getObjectsSets() {
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
      const objects = values.reduce((acc, value) => {
        if (value.status === "fulfilled") {
          value.value.data.data.map((value) => acc.push(value));
        }
        return acc;
      }, []);
      setObjectsSetsListDefault(objects);
      setObjectsSetsListLoader(false);
    });
  }

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

    //console.log("objectsSetsBySelectedClass ==>", objectsSetsBySelectedClass);

    setObjectsSetsListDefault(objectsSetsBySelectedClass.data.data);
    setObjectsSetsListLoader(false);
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <TreeClass
          selectedPortal={selectedPortal}
          // setSelectedClassID={setSelectedClassID}
          getobjectsSetsBySelectedClass={getobjectsSetsBySelectedClass}
          handleNext={handleNext}
        />
      </Grid>
      <Grid item xs={6}>
        {objectsSetsListLoader ? (
          <Grid container justify="center">
            <CircularProgress color="inherit" />
          </Grid>
        ) : (
          <>
            {objectsSetsListDefault?.map((object, index) => (
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
                onChange={(e, value) => getObjectsSets()}
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
