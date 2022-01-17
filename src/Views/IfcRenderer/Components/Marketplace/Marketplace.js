import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
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
  CardActionArea,
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
import DatBimApi from './DatBimApi/DatBimApi';

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


const applications = [
  {
    name: 'datBIM',
    type: 'data',
    description: 'description'
  },
  {
    name: 'dropbox',
    type: 'storage',
    description: 'description'
  },
  {
    name: 'TriStructure',
    type: 'structural analysis',
    description: 'description'
  }, {
    name: 'Google Drive',
    type: 'storage',
    description: 'description'
  }, {
    name: 'AxeoBIM',
    type: 'storage',
    description: 'description'
  }
]

const Marketplace = ({
  viewer,
  handleShowMarketplace
}) => {
  const classes = useStyles();
  const [selectedApp, setSelectedApp] = useState('home');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {

  }, []);

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
            M
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
                onClick={handleShowMarketplace}
              >
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Quit" />
              </ListItem>
            </Popover>
          </div>
        }
        title={`Marketplace`}
        subheader={`List of integrated BIM Applications`}
      />
      <CardContent
        className={classes.cardContent}
      >
        {selectedApp === 'home' &&
          <Grid container spacing={3}>
            {applications.map(application => (
              <Grid item xs={4}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      if (application.name === 'dropbox') {
                        viewer.openDropboxWindow();
                      } else {
                        setSelectedApp(application.name);
                      }
                    }}
                  >
                    <CardHeader
                      title={application.name}
                      subheader={application.type}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {application.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

            ))}
          </Grid>
        }
        {selectedApp === 'datBIM' &&
          <DatBimApi />
        }
      </CardContent>
    </Card>
  );
};

export default Marketplace;
