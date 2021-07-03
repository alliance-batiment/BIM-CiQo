import React, { useState } from 'react';
import update from 'immutability-helper';
import { fromJS } from 'immutable';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Tabs,
  Box,
  Typography
} from '@material-ui/core';

import ListAltIcon from '@material-ui/icons/ListAlt';
import PollIcon from '@material-ui/icons/Poll';
import Inputs from './Inputs';
import Outputs from './Outputs';

import initialData from './initialData';
import calculations from './calculations';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

function MyNewApp(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [values, setValues] = useState(initialData);
  const [tab, setTab] = useState(0);

  const handleChangeValues = (prop) => (event) => {
    const newValues = { ...values, [prop]: Number(event.target.value) };

    const calculatedValues = calculations.outputs(newValues);
    //const calculatedValues = new Geotechnic.Foundation.TowerFoundation({ initialState: newValues }).analysis();
    const updatedValues = {
      ...newValues,
      ...calculatedValues
    }
    setValues(updatedValues);
  };

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const handleChangeIndex = index => {
    setTab(index);
  };

  return (
    <div>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={tab} index={0} dir={theme.direction}>
          <Inputs
            values={values}
            handleChangeValues={handleChangeValues}
          />
        </TabPanel>
        <TabPanel value={tab} index={1} dir={theme.direction}>
          <Outputs
            values={values}
            handleChangeValues={handleChangeValues}
          />
        </TabPanel>
      </SwipeableViews>

      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <BottomNavigation
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          showLabels
        >
          <BottomNavigationAction label="Inputs"  {...a11yProps(0)} icon={<ListAltIcon />} />
          <BottomNavigationAction label="Outputs" {...a11yProps(1)} icon={<PollIcon />} />
        </BottomNavigation>
      </AppBar>
    </div>
  );
}

MyNewApp.propTypes = {
  props: PropTypes.object
};

export default MyNewApp;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}