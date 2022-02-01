import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton
} from '@mui/material';
import CreateTask from './Scenes/CreateTask';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardInfo: {
    zIndex: 100,
    width: "100%",
    height: "100%",
  },
  cardContent: {
    height: "90%",
    overflowY: "auto",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "0px solid slategrey",
    },
  },
}));

const Tasks = ({
  viewer,
  element,
  handleShowProperties,
  addElementsNewProperties,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            T
          </Avatar>
        }
        title={`Tache`}
        subheader={`Outils de création de tache`}
      />
      <CardContent>
        <CreateTask />
      </CardContent>
    </Card>
  )
};

export default Tasks;