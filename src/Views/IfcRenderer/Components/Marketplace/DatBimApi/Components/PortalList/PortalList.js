import { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
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
}));

const PortalList = ({
  openObjects,
  setBreadcrumbMap,
  handleNext,
  setActiveStep,
}) => {
  const classes = useStyles();

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
          <Typography variant="subtitle1" component="h3">
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
      </Grid>
    </Grid>
  );
};

export default PortalList;
