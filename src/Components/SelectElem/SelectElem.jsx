import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Select,
  MenuItem,
  FormControl,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useEffect, useState, useRef } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  // withoutLabel: {
  //   marginTop: theme.spacing(3),
  // },
  // textField: {
  //   width: '25ch',
  // },
  input: {
    // color: 'blue',
    // backgroundColor: (theme.palette.secondary.main === "#000000" ? "#ffffff" : theme.palette.secondary.main),
    backgroundColor: "#ffffff",
  },
  inputDisabled: {
    color: "#000000",
    backgroundColor: "transparent"
  },
  inputAdornment: {
    // paddingRight: '1em',
    color: 'black'
  },
  label: {
    fontWeight: "bold",
    width: "100%"
  },
  required: {
    color: theme.palette.error.main,
  }
}))


const iconStyles = (theme) => ({
  selectIcon: {
    //color: theme.palette.primary.main
    color: "#E6464D"
  }
});

const CustomExpandMore = withStyles(iconStyles)(
  ({ className, classes, ...rest }) => {
    return (
      <ExpandMoreIcon
        {...rest}
        className={clsx(className, classes.selectIcon)}
      />
    );
  }
);

const SelectElem = ({
  label,
  value,
  name,
  placeholder,
  disabled,
  onChange,
  list,
  defaultValue,
  multiple,
  children,
  required
}) => {
  const classes = useStyles();

  return (
    <FormControl
      fullWidth
    >
      <Typography className={classes.label}>{label}
        {required && <span className={classes.required}> *</span>}
      </Typography>
      <Select
        className={disabled ? classes.inputDisable : classes.input}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        multiple={(list?.length && multiple) ? true : false}
        placeholder={placeholder}
        name={name}
        value={value || []}
        defaultValue={defaultValue}
        onChange={onChange}
        disableUnderline
        displayEmpty
        IconComponent={CustomExpandMore}
      >
        {list?.map((item, index) => (
          <MenuItem key={index} value={item.id}>{`${item.name}`}</MenuItem>
        ))}
        {children}
      </Select>
    </FormControl>
  )
};

export default SelectElem;