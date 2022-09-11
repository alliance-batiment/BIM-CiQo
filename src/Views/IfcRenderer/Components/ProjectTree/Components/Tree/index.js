import React, { useRef, useEffect, useState } from 'react';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowRight from '@mui/icons-material/ArrowRight';
import {
  Typography,
  Button,
  TreeItem,
  Grid,
  Checkbox,
  IconButton,
  Chip
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree as Tree } from 'react-vtree';

const TreeComponent = ({
  spatialStructures,
  spatialStructure,
  handleShowProperties,
  toggleRow,
  vtree
}) => {
  const [refVisible, setRefVisible] = useState(false)
  let treeInstance = useRef();

  useEffect(() => {
    // if (refVisible) {
    setTimeout(() => {
      treeInstance.current?.recomputeTree(vtree);
    }, 1)
    // }
  }, [refVisible, vtree]);

  const Node = ({ data: { isLeaf, type, id, nestingLevel, name }, isOpen, style, setOpen, exportNodeToCsv }) => (
    <div
      style={{
        ...style,
        alignItems: 'center',
        display: 'flex',
        marginLeft: nestingLevel * 20 + (isLeaf ? 48 : 0),
      }}
    >
      {!isLeaf && (
        <span onClick={() => setOpen(!isOpen)}>
          {isOpen ? <ArrowDropDown /> : <ArrowRight />}
        </span>
      )}
      {/* <input type="checkbox" name="scales" defaultChecked={vtree[id]} onClick={() => toggleRow(id)} /> */}
      <Checkbox
        type="checkbox" name="scales" defaultChecked={vtree[id]} onClick={() => toggleRow(id)}
      />
      <Chip label={`${type}`} />
      <Typography
        component="div"
      >
        {`/${name.toLowerCase()}/${id}`}
      </Typography>
      <Grid item xs={2} sx={{ textAlign: 'right' }}>
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={(e) => {
            handleShowProperties(parseInt(id));
            // e.stopPropagation();
          }}
        >
          <DescriptionIcon />
        </IconButton>
      </Grid>
      {/* <Button
        edge="end"
        aria-label="comments"
        // style={{ textAlign: 'right', position: 'absolute', right: - nestingLevel * 30 - (isLeaf ? 48 : 0) }}
        // className={classes.button}
        onClick={(e) => exportNodeToCsv(e)}
      >
        <DownloadIcon />
      </Button> */}
    </div>
  );

  const getNodeData = (node, nestingLevel, structure) => ({
    data: {
      id: node.expressID.toString(), // mandatory
      isLeaf: node.children.length === 0,
      isOpenByDefault: false, // mandatory
      type: node.type,
      name: node.Name ? node.Name.value : "",
      nestingLevel,
    },
    nestingLevel,
    node,
  });

  function* treeWalker() {
    // Here we send root nodes to the component.
    for (let i = 0; i < spatialStructures.length; i++) {
      yield getNodeData(spatialStructures[i], 0);
    }

    while (true) {
      // Here we receive an object we created via getNodeData function
      // and yielded before. All we need here is to describe its children
      // in the same way we described the root nodes.
      const parentMeta = yield;

      for (let i = 0; i < parentMeta.node.children.length; i++) {
        yield getNodeData(
          parentMeta.node.children[i],
          parentMeta.nestingLevel + 1,
        );
      }
    }
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Tree
          // key={spatialStructure.expressID}
          ref={el => { treeInstance.current = el; setRefVisible(!!el); }}
          itemCount={1000}
          itemSize={30}
          treeWalker={treeWalker}
          height={height}
          width={width}
        >
          {Node}
        </Tree>
      )}
    </AutoSizer>
  )
}

export default TreeComponent;