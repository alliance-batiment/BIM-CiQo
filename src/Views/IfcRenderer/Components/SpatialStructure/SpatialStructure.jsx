import React, { useEffect, useState, useRef } from 'react';
import {
  makeStyles,
  Checkbox,
  FormControlLabel,
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
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
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
  treeView: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  }
}));


const SpatialStructure = ({
  viewer,
  spatialStructure
}) => {
  const classes = useStyles();

  const handleTreeViewItemById = (node) => {
    console.log('ITEM', node);
    // if (node) {
    viewer.pickIfcItemByID(node.modelID, node.expressID);
    // }

  };


  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.expressID}
      nodeId={nodes.expressID}
      label={<FormControlLabel
        control={<Checkbox
          // checked={state.checkedA}
          onChange={(e) => {
            handleTreeViewItemById(nodes);
          }}
        // name="checkedA"
        />}
        label={`${nodes.type}`}
      />}
      onClick={() => {
        handleTreeViewItemById(nodes);
      }}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <>
      {spatialStructure.length > 0 &&
        <Card className={classes.cardInfo}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                S
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            // title={`${element.Name.value}`}
            subheader="Spatial Structure"
          />
          <CardContent
            className={classes.cardContent}
          >
            <TreeView
              className={classes.treeView}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpanded={['root']}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              {renderTree(spatialStructure)}
            </TreeView>
          </CardContent>
        </Card>
      }
    </>
  );
};

export default SpatialStructure;
