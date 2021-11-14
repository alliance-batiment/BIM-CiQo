import React, { useEffect, useState } from 'react';
import {
  makeStyles
} from '@material-ui/core';
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
  Button
} from '@mui/material';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClearIcon from '@material-ui/icons/Clear';
import {
  IFCSLAB,
  IFCMEMBER,
  IFCSTRUCTURALCURVEMEMBER
} from 'web-ifc';

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const SpatialStructure = ({
  viewer,
  spatialStructure,
  handleShowSpatialStructure
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [ifcElementByType, setIfcElementByType] = useState([]);
  const [expressIDList, setExpressIDList] = useState([]);

  useEffect(() => {
    async function init() {
      const modelID = await viewer.IFC.getModelID();
      const ifcSlab = await viewer.getAllItemsOfType(0, IFCSLAB, true);
      const ifcMember = await viewer.getAllItemsOfType(0, IFCMEMBER, true);
      const ifcStructuralCurveMember = await viewer.getAllItemsOfType(0, IFCSTRUCTURALCURVEMEMBER, true);

      const newIfcElementByType = [
        { class: 'IfcSlab', elements: [...ifcSlab] },
        { class: 'IfcMember', elements: [...ifcMember] },
        { class: 'IfcStructuralCurveMember', elements: [...ifcStructuralCurveMember] },
      ];
      setIfcElementByType(newIfcElementByType);
    }
    init();
  }, []);

  const handleShowElement = async () => {
    await viewer.IFC.pickIfcItemsByID(0, expressIDList, false, 0);
  }


  const handleAddId = async (node) => {
    const newExpressIDList = [...expressIDList];
    newExpressIDList.push(node.expressID);
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        handleAddId(child);
      });
    }
    setExpressIDList(newExpressIDList);
  }

  const isChecked = (expressIDList, node) => {
    const index = expressIDList.findIndex(index => index === node.expressID);
    console.log('INDEX', index)
    return index >= 0 ? true : false;
  }

  const handleTreeViewItemById = async (event, node) => {
    if (node && node.children.length === 0) {
      await viewer.IFC.unpickIfcItems();
      if (event.target.checked) {
        console.log('CHECKED')
        const ids = [...expressIDList, node.expressID];
        await viewer.IFC.pickIfcItemsByID(0, ids, false, 0);
        setExpressIDList(ids);
      } else {
        console.log('UNCHECKED')
        const index = expressIDList.findIndex(index => index === node.expressID);
        const ids = expressIDList.splice(index, 1);
        await viewer.IFC.pickIfcItemsByID(0, ids, false, 0);
        setExpressIDList(ids);
      }
    }
  };

  const handleElementsVisibility = async (index) => {
    const ids = ifcElementByType[index].elements.map(element => element.expressID);
    await viewer.IFC.hideAllItems(0);
    await viewer.IFC.showItems(0, ids);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const renderTree = (nodes, index) => (
    <TreeItem
      key={nodes.expressID}
      nodeId={nodes.expressID}
      // label={
      //   <FormControlLabel
      //     control={<Checkbox
      //       checked={isChecked(expressIDList, nodes)}
      //       onChange={(e) => {
      //         // handleTreeViewItemById(e, nodes);
      //         handleAddId(nodes);
      //       }}
      //     />}
      //     name={nodes.expressID}
      //     label={`${nodes.type}`}
      //   />}
      label={`${nodes.type}`}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem >
  );

  return (

    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            S
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
              <ListItem
                button
                onClick={handleShowSpatialStructure}
              >
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Quit" />
              </ListItem>
            </Popover>
          </div>
        }
        // title={`${element.Name.value}`}
        subheader="Spatial Structure"
      />
      <CardContent
        className={classes.cardContent}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Spatial Structure" {...a11yProps(0)} />
            {/* <Tab label="Elements by class" {...a11yProps(1)} /> */}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>

          {(spatialStructure.children && spatialStructure.children.length > 0) &&
            <>
              <Grid container>
                {/* <Grid xs={12}>
                  <Button
                    onClick={handleShowElement}
                  >Show Elements</Button>
                </Grid> */}
                <Grid xs={12}>
                  <TreeView
                    className={classes.treeView}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={['root']}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    {renderTree(spatialStructure)}
                  </TreeView>
                </Grid>
              </Grid>

            </>
          }
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {ifcElementByType.map((ifcElement, index) => {
              const labelId = `checkbox-list-label-${ifcElement.class}`;
              return (
                <ListItem
                  key={ifcElement.class}
                  secondaryAction={
                    <Chip label={`${ifcElement.elements.length}`} />
                  }
                  disablePadding
                >
                  <ListItemButton role={undefined} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        // checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        onChange={() => handleElementsVisibility(index)}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${ifcElement.class}`} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default SpatialStructure;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
