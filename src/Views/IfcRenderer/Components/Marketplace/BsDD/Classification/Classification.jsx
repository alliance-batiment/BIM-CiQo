import React, { useEffect, useState } from "react";
import {
  Typography,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Grid,
  Tooltip,
  Input,
  Button
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from "@material-ui/icons/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import SearchBar from "../../../../../../Components/SearchBar";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  tableRow: {
    borderWidth: 0,
    borderColor: 'transparent'
  },
  button: {
    backgroundColor: '#007fff',
    color: 'white',
    textTransform: 'capitalize'
  }
}));

const Classification = ({
  state,
  setState,
  handleGetClassification,
  handleGetProperty
}) => {
  const classes = useStyles();
  const [classification, setClassification] = useState(state.classifications.value);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(classification?.classificationProperties);
  }, []);


  const handleSearchData = (input) => {
    const dataList = [...classification?.classificationProperties];
    if (dataList && dataList.length > 0) {
      const newFilteredData = dataList.filter((data) => {
        const searchResult = `${data.name} ${data.propertySet} ${data.description} ${data.propertyValueKind} ${data.dataType} ${data.propertyStatus}`
          .toLowerCase()
          .includes(input.toLowerCase());
        return searchResult;
      });
      setSearchInput(input);
      setFilteredData(newFilteredData);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} style={{ textAlign: 'left' }}>
        <Button
          className={classes.button}
          onClick={() => setState({
            ...state,
            views: {
              ...state.views,
              value: 'home'
            }
          })}
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={12}>
        {/* <Typography className={classes.heading}>
          {`${classification.name}`}
        </Typography> */}
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow key={0} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Name`}</TableCell>
                <TableCell className={classes.tableRow}>{`${classification.name}`}</TableCell>
              </TableRow>
              <TableRow key={1} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Namespace URI`}</TableCell>
                <TableCell className={classes.tableRow}>{`${classification.namespaceUri}`}</TableCell>
              </TableRow>
              <TableRow key={2} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Parent classification`}</TableCell>
                <TableCell className={classes.tableRow}>{`${classification.parentClassificationReference?.name}`}</TableCell>
                <TableCell className={classes.tableRow}><Button className={classes.button} onClick={() => handleGetClassification("classification", classification.parentClassificationReference)}>Show</Button></TableCell>
              </TableRow>
              <TableRow key={3} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Date`}</TableCell>
                <TableCell className={classes.tableRow}>{`${classification.versionDateUtc}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            expanded={true}
          >
            <Typography className={classes.heading}>
              Description
                  </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key={0}>
                    <TableCell>{`${classification.definition}`}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Properties
                  </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <SearchBar
                  input={searchInput}
                  onChange={handleSearchData}
                  placeholder="Search properties"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>{`Number of results: ${filteredData?.length}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">Pset</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Value</TableCell>
                        <TableCell align="center">Value kind</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Add</TableCell>
                        <TableCell align="center">Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData?.map((property, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${property.name}`}</TableCell>
                          <TableCell>{`${property.propertySet}`}</TableCell>
                          <TableCell>{property.description && (
                            <Tooltip
                              title={`${property.description}`}
                              placement="top-start"
                            >
                              <IconButton>
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          )}</TableCell>
                          <TableCell>
                            <Input type="text" name="text_value" fullWidth />
                          </TableCell>
                          <TableCell>{`${property.propertyValueKind}`}</TableCell>
                          <TableCell>{`${property.dataType}`}</TableCell>
                          <TableCell>{`${property.propertyStatus}`}</TableCell>
                          <TableCell><Button className={classes.button}>Add</Button></TableCell>
                          <TableCell>
                            <Button
                              className={classes.button}
                              onClick={() => {
                                const newProperty = {
                                  ...property,
                                  namespaceUri: property.propertyNamespaceUri
                                }
                                handleGetProperty("property", newProperty)
                              }}
                            >Details</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Children
                  </Typography>

          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                      {classification.childClassificationReferences?.map((children, index) => (
                        <TableRow key={index}>
                          <TableCell>{`${children.name}`}</TableCell>
                          <TableCell>{`${children.code}`}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleGetClassification("classification", children)}
                            >Show</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid >
  );
};

export default Classification;