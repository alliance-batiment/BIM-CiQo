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
  Button
} from "@material-ui/core";

import DefineTypeComponent from "./DefineTypeComponent";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";



const SelectionComponent = ({
  selectors,
  selectorsLoader,
  getObjectsOfAdvancedSearch,
  selectorsRequest,
  setSelectorsRequest,
  resetSelectors
}) => {
  // const classes = useStyles();


  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Sélection</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {selectorsLoader ? (
          <Grid container justify="center">
            <CircularProgress color="inherit" />
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectors && selectors.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableBody>
                      {selectors?.map((selector, selectorIndex) => (
                        <TableRow key={selector.id}>
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
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                onClick={resetSelectors}
                color="primary"
                style={{ backgroundColor: "#E6464D", color: "white" }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default SelectionComponent;
