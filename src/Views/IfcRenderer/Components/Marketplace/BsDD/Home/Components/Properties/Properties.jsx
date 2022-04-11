import React, { useEffect, useState } from "react";
import { Badge, makeStyles } from "@material-ui/core";
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Tabs,
  Tab,
  Chip,
  ListItemButton,
  Grid,
  Button,
  ButtonGroup,
  Divider
} from "@mui/material";
import SearchBar from "../../../../../../../../Components/SearchBar";

const useStyles = makeStyles((theme) => ({
  listContainer: {
  },
  listItem: {
    // left: "3em",
    // position: "absolute",
    textOverflow: "ellipsis",
    overflow: "hidden",
    wordWrap: "break-word",
    warp: true,
    height: '3em'
  },
}));

const Properties = ({
  properties,
  handleGetProperty
}) => {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(properties);
  }, []);

  const handleSearchData = (input) => {
    const dataList = [...properties];
    if (dataList && dataList.length > 0) {
      const newFilteredData = dataList.filter((data) => {
        const searchResult = `${data.name} ${data.domainName} ${data.description}`
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
      {(filteredData && filteredData.length > 0) &&
        <>
          <Grid item xs={12}>
            <SearchBar
              input={searchInput}
              onChange={handleSearchData}
              placeholder="Key words"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>{`Number of results: ${filteredData?.length}`}</Typography>
          </Grid>
        </>
      }
      <Grid item xs={12}>
        <List sx={{ width: "100%" }}>
          {filteredData?.map((property, index) => (
            <ListItem
              key={index}
              sx={{ padding: "0" }}
            >
              <ListItemButton
                role={undefined}
                dense
                onClick={() => handleGetProperty("property", property)}
              >
                <ListItemText
                  id={`checkbox-list-label-${index}`}
                  primary={<Typography>{`${property.name ? property.name : 'No name'}`}</Typography>}
                  secondary={
                    <>
                      <Grid container>
                        <Grid item xs={12} className={classes.listItem}>
                          <Chip label={`${property.domainName ? property.domainName : 'No domain'}`} />
                        </Grid>
                        <Grid item xs={12} className={classes.listItem}>
                          <Typography>{`Description: ${property.description ? property.description : 'No description'}`}</Typography>
                        </Grid>
                      </Grid>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Properties;