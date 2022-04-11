import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
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
  Button,
  ButtonGroup,
  Divider
} from "@mui/material";

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
  treeViewLabel: {
    left: "3em",
    position: "absolute",
    textOverflow: "ellipsis",
    overflow: "hidden",
    wordWrap: "break-word",
    warp: true,
    // width: '5em'
  },
  treeViewCheckbox: {
    margin: 0,
    padding: 0,
  },
  treeView: {
    // height: 240,
    flexGrow: 1,
    // maxWidth: 400,
  },
  buttonGroup: {
    backgroundColor: 'white',
    marginTop: '1em'
  }
}));

const Domains = ({
  domains,
  state,
  setState
}) => {
  const classes = useStyles();

  useEffect(() => {

  }, [domains]);

  const isChecked = (domain) => {
    const index = domains.selection?.findIndex(dom => dom === domain.namespaceUri);
    if (index < 0) {
      return false;
    } else {
      return true;
    };
  }

  const handleSelectedDomains = (domain) => {
    const newDomains = [...domains.selection];
    const index = domains.selection?.findIndex(dom => dom === domain.namespaceUri);
    console.log('index', index)
    if (index < 0) {
      newDomains.push(domain.namespaceUri);
    } else {
      newDomains.splice(index, 1);
    };
    console.log('domains', newDomains)
    setState({
      ...state,
      domains: {
        ...state.domains,
        value: domain,
        selection: [...newDomains]
      }
    });
  }

  return (
    <List sx={{ width: "100%" }}>
      {domains.list?.map((domain, index) => (
        <ListItem
          key={index}
          sx={{ padding: "0" }}
        >
          <ListItemButton
            role={undefined}
            dense
          // onClick={() => handleElementSelection(element)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                // checked={checked.indexOf(element) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                onClick={() => handleSelectedDomains(domain)}
                checked={isChecked(domain)}
              />
            </ListItemIcon>
            <ListItemText
              id={`checkbox-list-label-${index}`}
              primary={`${domain.name ? domain.name : 'NO NAME'}`}
            // secondary={secondary ? 'Secondary text' : null}
            />
          </ListItemButton>
        </ListItem>
      ))
      }
    </List >
  );
};

export default Domains;