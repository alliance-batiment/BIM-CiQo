import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            component="h3"
          >
            Sélectionnez un portail:
          </Typography>
        </Grid>
        {portals?.map((portal) => (
          <Grid item sm={4}>
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
                <Typography variant="h6" component="h3" className={classes.datBimCardTitle}>{`${portal.portal_name}`}</Typography>
                {/* <Typography variant="body1" component="body1" className={classes.datBimCardTitle}>{`url: ${portal.portal_url}`}</Typography> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default PortalList;
