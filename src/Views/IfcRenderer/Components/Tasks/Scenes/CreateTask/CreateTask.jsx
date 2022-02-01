import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
  TextField
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

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

const boardList = [{
  value: 'Default Board',
  label: 'Tableau de base'
}];

const statusList = [{
  value: 'Backlog',
  label: 'Backlog'
}, {
  value: 'Open',
  label: 'Ouvert'
}, {
  value: 'Review',
  label: 'En cours'
}, {
  value: 'Close',
  label: 'Fini'
}];

const priorityList = [{
  value: 'None',
  label: 'Aucune'
}, {
  value: 'Low',
  label: 'Faible'
}, {
  value: 'Medium',
  label: 'Moyenne'
}, {
  value: 'High',
  label: 'Forte'
}];

const issueTypeList = [{
  value: 'Issue',
  label: 'Tache'
}, {
  value: 'Enquiry',
  label: 'Enquête'
}];

const Tasks = ({
  viewer,
  element,
  handleShowProperties,
  addElementsNewProperties,
}) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    board: boardList[0].value,
    status: statusList[0].value,
    priority: boardList[0].value,
    board: boardList[0].value,
  });
  return (
    <Card className={classes.cardInfo}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            T
          </Avatar>
        }
        title={`Création d'une tache`}
        subheader={`Outils de création de tache`}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>

          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography variant="h2" component="h2">
                Information de base
</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="board"
                select
                label="Tableau"
                value={board}
                onChange={handleChange}
              >
                {boardList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>

            </Grid>
            <Grid item xs={12}>

            </Grid>
            <Grid item xs={12}>
              <Typography variant="h2" component="h2">
                Coordination
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="status"
                select
                label="Status"
                value={status}
                onChange={handleChange}
              >
                {statusList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="issueType"
                select
                label="Type"
                value={issueType}
                onChange={handleChange}
              >
                {issueTypeList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="priority"
                select
                label="Type"
                value={priority}
                onChange={handleChange}
              >
                {priorityList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="DateTimePicker"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="priority"
                select
                label="Type"
                value={priority}
                onChange={handleChange}
              >
                {priorityList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button>Annuler</Button>
              <Button>Créer</Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};

export default Tasks;