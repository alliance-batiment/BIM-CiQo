import React, { useEffect, useState } from 'react';
import {
  Typography,
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
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
  element,
  handleShowProperties
}) => {
  const classes = useStyles();
  const [ifcElement, setIfcElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (element) {
      setIfcElement(element);
    }
  }, []);

  const handleShowElement = async () => {
    const modelID = element.modelID;
    const ids = [element.expressID]
    await viewer.IFC.loader.ifcManager.hideItems(modelID, ids);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            P
          </Avatar>
        }
        action={
          <div>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              {/* <ListItem
                button
                onClick={handleShowElement}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="Visibility" />
              </ListItem> */}
              <ListItem
                button
                onClick={handleShowProperties}
              >
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Quit" />
              </ListItem>
            </Popover>
          </div>
        }
        title={`${element ? element.Name.value : 'Undefined'}`}
        subheader={`${element.type}`}
      />
      <CardContent
        className={classes.cardContent}
      >
        {element &&
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
                      <TableRow key={2}>
                        <TableCell>{`Type`}</TableCell>
                        <TableCell>{`${element.type}`}</TableCell>
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
                            <TableCell>{`${property.label}`}</TableCell>
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
