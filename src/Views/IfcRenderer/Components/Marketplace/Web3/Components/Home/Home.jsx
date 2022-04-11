import React, { useEffect, useState } from "react";
import {
  Alert
} from "@mui/material";
import {
  Typography,
  Grid,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardMedia,
  Badge,
  Fab,
} from "@material-ui/core";
import SearchBar from "../../../../../../../Components/SearchBar";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardInfo: {
    zIndex: 100,
    width: "100%",
    height: "100%",
  },
  cardContent: {
    height: "90%",
    overflowY: "auto",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "0px solid slategrey",
    },
  },
  application: {
    height: "17em",
  },
  avatar: {
    backgroundColor: "transparent",
    width: theme.spacing(7),
    height: theme.spacing(7),
    padding: "5px",
    borderRadius: "0px",
  },
  root: {
    maxWidth: 345,
    margin: "10px",
    cursor: "pointer",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  fab: {
    backgroundColor: "white",
  },
  button: {
    color: "black",
    // "&:hover": {
    //   color: "white",
    //   backgroundColor: "black",
    //   cursor: "pointer",
    // },
  },
}));



const Home = ({
  state,
  setState
}) => {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(state.files.list);
  }, []);

  const handleSearchData = (input) => {
    const dataList = [...state.files.list];
    if (dataList && dataList.length > 0) {
      const newFilteredData = dataList.filter((data) => {
        const searchResult = `${data.name} ${data.type} ${data.description}`
          .toLowerCase()
          .includes(input.toLowerCase());
        return searchResult;
      });
      setSearchInput(input);
      setFilteredData(newFilteredData);
    }
  };
  return (
    <Grid container spacing={3}>
      {(filteredData?.length > 0) &&
        <>
          <Grid item xs={12}>
            <SearchBar
              input={searchInput}
              onChange={handleSearchData}
              placeholder="Key words"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>{`Number of results: ${filteredData.length}`}</Typography>
          </Grid>
        </>
      }
      {filteredData?.map((file) => (
        <Grid item xs={4}>
          <Card className={classes.file}>
            <CardActionArea
            >
              <CardHeader
                title={file.name}
                subheader={
                  <Badge color="success" pill>
                    {file.cid}
                  </Badge>
                }
              />
              <CardMedia
                component="img"
                height="140"
                image={`https://${file.cid}.ipfs.dweb.link/ifcImg.png`}
                alt={file.name}
              />
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
