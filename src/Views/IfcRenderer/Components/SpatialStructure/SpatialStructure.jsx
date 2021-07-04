import React, { useEffect, useState, useRef } from 'react';
import {
  makeStyles,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => ({
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
    <TreeView
      className={classes.treeView}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(spatialStructure)}
    </TreeView>
  );
};

export default SpatialStructure;
