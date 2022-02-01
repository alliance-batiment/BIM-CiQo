import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Input from '@material-ui/core/Input';
import {
  Paper,
  InputBase,
  IconButton
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  search: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBotton: '2em'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const SearchBar = ({ keyword, onChange, placeholder, className }) => {
  const classes = useStyles();
  return (
    // <Input
    //     value={keyword}
    //     placeholder={placeholder}
    //     onChange={(e) => onChange(e.target.value)}
    //     className={className}
    // />
    <Paper component="form" className={classes.search}>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={(e) => onChange(e.target.value)}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar