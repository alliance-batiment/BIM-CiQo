import {
  Grid,
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
  setSelectedObject,
}) => {
  return (
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
              {selectors && selectors.length > 0 ? (
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
              ) : (
                <Typography>Aucun sélecteur disponible</Typography>
              )}
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default SelectionComponent;
