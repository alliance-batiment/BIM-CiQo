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
  }
}));

const Property = ({
  state,
  setState,
  handleGetClassification,
  handleGetProperty
}) => {
  const classes = useStyles();
  const [property, setProperty] = useState(state.properties.value);

  return (
    <Grid container>
      <Grid item xs={12} style={{ textAlign: 'left' }}>
        <Button
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
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow key={0} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Name`}</TableCell>
                <TableCell className={classes.tableRow}>{`${property.name}`}</TableCell>
              </TableRow>
              <TableRow key={1} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Namespace URI`}</TableCell>
                <TableCell className={classes.tableRow}>{`${property.namespaceUri}`}</TableCell>
              </TableRow>
              <TableRow key={2} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Date`}</TableCell>
                <TableCell className={classes.tableRow}>{`${property.versionDateUtc}`}</TableCell>
              </TableRow>
              <TableRow key={3} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Data Type`}</TableCell>
                <TableCell className={classes.tableRow}>{`${property.dataType}`}</TableCell>
              </TableRow>
              <TableRow key={4} className={classes.tableRow}>
                <TableCell className={classes.tableRow}>{`Value Kind`}</TableCell>
                <TableCell className={classes.tableRow}>{`${property.propertyValueKind}`}</TableCell>
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
                    <TableCell>{`${property.description}`}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid >
  );
};

export default Property;