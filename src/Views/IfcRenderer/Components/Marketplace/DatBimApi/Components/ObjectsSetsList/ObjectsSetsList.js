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

const ObjectsSetsList = ({
  classes,
  selectedPortal,
  setSelectedObjectSet,
  setSelectedObjectSetName,
  handleNext,
}) => {
  const [objectsSets, setObjectsSets] = useState([]);
  const [objectsSetsListDefault, setObjectsSetsListDefault] = useState([]);
  const [objectsSetsListLoader, setObjectsSetsListLoader] = useState(false);

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

  return (
    <Grid item xs={12}>
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
                <p className={classes.datBimCardTitle}>{object.parent_name}</p>
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
  );
};

export default ObjectsSetsList;
