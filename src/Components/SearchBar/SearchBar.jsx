import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper, InputBase, ButtonGroup, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

const useStyles = makeStyles((theme) => ({
  search: {
    height: "3em",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    // marginBotton: "2em",
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    border: "none",
    color: "black",
    // "&:hover": {
    //   backgroundColor: "#E6464D",
    //   color: "white",
    // },
    // "&:disabled": {
    //   border: "none",
    // },
  },
}));

const SearchBar = ({
  keyword,
  onChange,
  placeholder,
  className,
  onClickOne,
  onClickTwo,
  disabled,
  input,
}) => {
  const classes = useStyles();

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.value.length === 0) {
        e.preventDefault();
      } else {
        e.preventDefault();
        onClickOne();
      }
    }
  };

  const onClickOneCheck = () => {
    // console.log("input ==>", input);
    if (input.length > 0) {
      onClickOne();
    }
  };

  return (
    // <Input
    //     value={keyword}
    //     placeholder={placeholder}
    //     onChange={(e) => onChange(e.target.value)}
    //     className={className}
    // />
    <Paper component="form" className={classes.search}>
      <InputBase
        disabled={disabled}
        value={input}
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search google maps" }}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <ButtonGroup aria-label="search button group">
        <Button
          className={classes.iconButton}
          disabled={disabled}
          onClick={onClickOneCheck}
        >
          <SearchIcon />
        </Button>
        <Button
          className={classes.iconButton}
          disabled={disabled}
          onClick={onClickTwo}
        >
          <RotateLeftIcon />
        </Button>
      </ButtonGroup>
    </Paper>
  );
};

export default SearchBar;
