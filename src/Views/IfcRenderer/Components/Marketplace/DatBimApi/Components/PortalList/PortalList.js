import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent } from "@material-ui/core";

const PortalList = ({
  classes,
  openObjects,
  setSelectedPortal,
  handleNext,
  setActiveStep,
}) => {
  const [portals, setPortals] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DATBIM}/portals`, {
        headers: {
          "X-Auth-Token": sessionStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        setPortals(data.data);
      })
      .catch(() => {
        setActiveStep(0);
      });
  }, []);

  return (
    <Grid item xs={12}>
      {portals?.map((portal) => (
        <Card
          key={portal.portal_id}
          className={`${classes.root} ${classes.datBimCard}`}
        >
          <CardContent
            onClick={() => {
              openObjects(portal.portal_id);
              handleNext();
            }}
          >
            <p className={classes.datBimCardTitle}> {portal.portal_name}</p>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
};

export default PortalList;
