import { useEffect, useState } from "react";
import axios from "axios";
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Breadcrumbs,
  Typography,
  Divider,
  CardActions,
  CardActionArea,
  Chip,
  Tabs,
  Tab,
  Box
} from "@material-ui/core";
import SearchBar from "../../../../../../Components/SearchBar";
import Domains from "./Components/Domains";
import Classifications from "./Components/Classifications";
import Properties from "./Components/Properties";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      backgroundColor: "white",
    },
  },
  datBimCard: {
    backgroundColor: "#E6464D",
    color: "white",
    margin: theme.spacing(1),
    cursor: "pointer",
    // height: "8em",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  datBimCardTitle: {
    fontSize: 12,
    margin: 0,
    color: "white",
    fontWeight: "bold",
  },
  datBimCardDesc: {
    fontSize: 8,
    margin: 0,
    // fontStyle: "italic",
  },
  button: {
    backgroundColor: "#E6464D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E6464D",
      color: "white",
    },
    "&:disabled": {
      opacity: 0.8,
      color: "white",
    },
  },
  link: {
    color: "inherit",
    "&:hover": {
      color: "textPrimary",
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
}));


const Home = ({
  state,
  setState,
  handleGetTextSearchListOpen,
  handleGetClassification,
  handleGetProperty
}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchText = (input) => {
    console.log('input', input);
    setSearchText(input);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SearchBar
          input={searchText}
          onChange={handleSearchText}
          placeholder="Key words"
          onClickOne={() => {
            console.log('selection', state.domains.selection)
            handleGetTextSearchListOpen({
              searchText,
              typeFilter: "All",
              domainNamespaceUris: state.domains.selection
            })
          }}
        />
      </Grid>
      {/* <Grid item xs={3}>
        <Box sx={{ width: '100%' }}>
          <Grid item xs={12}>
            <Domains
              state={state}
              setState={setState}
              domains={state.domains}
            />
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Classifications" {...a11yProps(0)} />
              <Tab label="Properties" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Classifications
              classifications={state.classifications.list}
              handleGetClassification={handleGetClassification}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Properties
              properties={state.properties.list}
              handleGetProperty={handleGetProperty}
            />
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}