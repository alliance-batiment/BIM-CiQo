import {
  Grid,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Paper,
  CircularProgress,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";

import SearchBar from "../../../../../../../Components/SearchBar";

import DefineTypeComponent from "./DefineTypeComponent";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

const SelectionComponent = ({
  classes,
  selectors,
  selectorsLoader,
  getObjectsOfAdvancedSearch,
  selectorsRequest,
  setSelectorsRequest,
  getSelectorsOfObjectSet,
  setSearchBarInput,
  getObjectsOfSelectedObject,
}) => {
  const handleChangeKeyword = (value) => {
    // console.log(value);
    setSearchBarInput(value);
  };

  const resetSelectors = () => {
    setSearchBarInput("");
    setSelectorsRequest([]);
    getSelectorsOfObjectSet();
    getObjectsOfSelectedObject();
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Sélection</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {selectorsLoader ? (
              <Grid container justify="center">
                <CircularProgress color="inherit" />
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs={12}>
                  <SearchBar
                    onChange={handleChangeKeyword}
                    className={classes.searchBar}
                    placeholder="Mot clé"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableBody>
                        {selectors?.map((selector, selectorIndex) => (
                          <TableRow
                            key={selector.id}
                            className={`${classes.root} ${classes.datBimList}`}
                          >
                            <TableCell width="40%" component="th" scope="row">
                              {selector.name}
                            </TableCell>
                            <TableCell width="40%" align="right">
                              {DefineTypeComponent({
                                type: selector.type,
                                selector,
                                selectorsRequest,
                                setSelectorsRequest,
                                getObjectsOfAdvancedSearch,
                              })}
                            </TableCell>
                            <TableCell width="10%" align="center">
                              {selector.unit}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid container>
                  <Grid item xs={6} style={{ textAlign: "left" }}>
                    <Button className={classes.button} onClick={resetSelectors}>
                      Réinitialiser
                    </Button>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    <Button
                      className={classes.button}
                      onClick={() =>
                        getObjectsOfAdvancedSearch(selectorsRequest)
                      }
                    >
                      Rechercher
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default SelectionComponent;
