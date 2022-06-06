import { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
    height: "8em",
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  loader: {
    color: "inherit",
    marginTop: "80px",
  },
}));

const PortalList = ({
  openObjects,
  setBreadcrumbMap,
  handleNext,
  setActiveStep,
}) => {
  const classes = useStyles();

  const [portals, setPortals] = useState([]);
  const [portalsLoader, setPortalsLoader] = useState(false);

  useEffect(() => {
    const getPortalList = async () => {
      try {
        setPortalsLoader(true);

        const portalList = await axios.get(
          `${process.env.REACT_APP_API_DATBIM}/portals`,
          {
            headers: {
              "X-Auth-Token": sessionStorage.getItem("token"),
            },
          }
        );

        setPortals(portalList.data.data);
        setPortalsLoader(false);
      } catch (error) {
        setActiveStep(0);
      }
    };

    getPortalList();
  }, []);

  return (
    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="h3">
            Sélectionnez un portail:
          </Typography>
        </Grid>
        {portalsLoader ? (
          <Grid container justify="center">
            <CircularProgress className={classes.loader} />
          </Grid>
        ) : (
          <>
            {portals?.map((portal) => (
              <Grid item lg={4}>
                <Card
                  key={portal.portal_id}
                  className={`${classes.root} ${classes.datBimCard}`}
                >
                  <CardContent
                    onClick={() => {
                      openObjects(portal.portal_id);
                      setBreadcrumbMap([portal.portal_name]);
                      handleNext();
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      className={classes.datBimCardTitle}
                    >{`${portal.portal_name}`}</Typography>
                    {/* <Typography variant="body1" component="body1" className={classes.datBimCardTitle}>{`url: ${portal.portal_url}`}</Typography> */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default PortalList;
