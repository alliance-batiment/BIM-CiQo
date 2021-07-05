import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: '100%',
  },
  cardInfo: {
    zIndex: 100,
    width: '100%',
    height: '100%',
  },
  cardContent: {
    height: '90%',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '0px solid slategrey'
    }
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
    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${element ? element.Name.value : 'Undefined'}`}
        subheader="Properties"
      />
      <CardContent
        className={classes.cardContent}
      >
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
            {element.psets.length > 0 && element.psets.map(pset => (
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
                        {pset.HasProperties && pset.HasProperties.length > 0 && pset.HasProperties.map((property, index) => (
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
      </CardContent>
    </Card>
  );
};

export default Properties;
