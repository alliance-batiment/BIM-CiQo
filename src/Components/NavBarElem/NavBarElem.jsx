import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const NavBarElem = ({ title, classes, handleDrawerOpen, open }) => {
  // const classes = useStyles();

  const { REACT_APP_LOGO, REACT_APP_COMPANY } = process.env;

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
        <div style={{ position: "absolute", right: "10px" }}>
          <a
            href="https://boxboisbim.mydatbim.com/mydatbimCom/mentions-legales"
            style={{ color: "inherit", margin: "0 20px" }}
            target="_blank"
          >
            Mentions légales
          </a>
          <a
            href="https://www.datbim.com/template/contact/377864"
            style={{ color: "inherit", margin: "0 20px" }}
            target="_blank"
          >
            Contact
          </a>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarElem;
