import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: '100%',
  },
}));


const Properties = ({
  viewer,
  element
}) => {
  const classes = useStyles();
  const [ifcElement, setIfcElement] = useState(null);

  useEffect(() => {
    if (element) {
      setIfcElement(element);
    }
  }, []);

  return (
    <div className={classes.root}>
      {ifcElement &&
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Attributes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key={0}>
                      <TableCell>{`GlobalId`}</TableCell>
                      <TableCell>{`${element.GlobalId.value}`}</TableCell>
                    </TableRow>
                    <TableRow key={1}>
                      <TableCell>{`Name`}</TableCell>
                      <TableCell>{`${element.Name.value}`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          {element.psets.map(pset => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{`${pset.Name.value}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                      {pset.HasProperties.map((property, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${property.type}`}</TableCell>
                          <TableCell>{`${property.value}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      }
    </div>
  );
};

export default Properties;
