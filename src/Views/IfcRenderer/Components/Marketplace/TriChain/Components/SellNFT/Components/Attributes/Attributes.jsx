import { useEffect, useState } from 'react'
import {
  Input,
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Divider,
  Slider,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip
} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  application: {
    height: "17em",
  },
  avatar: {
    backgroundColor: "transparent",
    width: theme.spacing(7),
    height: theme.spacing(7),
    padding: "5px",
    borderRadius: "0px",
  },
  root: {
    maxWidth: 345,
    margin: "10px",
    cursor: "pointer",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  fab: {
    backgroundColor: "white",
  },
  button: {
    color: "white",
    backgroundColor: 'black',
    width: '100%'
  },
  price: {
    textAlign: 'center',
    padding: '0.5em',
    backgroundColor: 'lightgray',
    width: '100%',
    fontWeight: 'bold'
  },
  textField: {
    width: '100%',
    border: '1px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export default function Attributes({
  formInput,
  updateFormInput,
  validation,
  listNFTForSale,
  setView
}) {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h6" component="div">
              {`Domains`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-label">Domain</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formInput.domain}
                label="Domain"
                onChange={e => updateFormInput({ ...formInput, domain: e.target.value })}
              >
                {formInput.domains.map((domain, index) => (
                  <MenuItem key={index} value={domain.value}>{domain.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h6" component="div">
              {`Level of Developments`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-label"> {`Level of Developments`}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formInput.levelOfDevelopment}
                label="Level of Developments"
                onChange={e => updateFormInput({ ...formInput, levelOfDevelopment: e.target.value })}
              >
                {formInput.levelOfDevelopments.map((levelOfDevelopment, index) => (
                  <MenuItem key={index} value={levelOfDevelopment.value}>{levelOfDevelopment.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h6" component="div">
              {`Phases`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-label">Phase</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formInput.phase}
                label="Phase"
                onChange={e => updateFormInput({ ...formInput, phase: e.target.value })}
              >
                {formInput.phases.map((phase, index) => (
                  <MenuItem key={index} value={phase.value}>{phase.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12}>
          <Typography gutterBottom variant="h6" component="div">
            {`Materials`}
          </Typography>
        </Grid> */}
          <Grid item xs={12}>
            {/* <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-label">Materials</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formInput.phase}
                    label="Phase"
                    onChange={e => updateFormInput({ ...formInput, phase: e.target.value })}
                  >
                    {formInput.phases.map((phase, index) => (
                      <MenuItem key={index} value={phase.value}>{phase.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
            {/* <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">Materials</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={formInput.material}
          onChange={e => updateFormInput({ ...formInput, materials: e.target.value })}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {formInput.materials.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        {
          formInput.image && (
            <img className="rounded mt-4" width="350" src={formInput.image} />
          )
        }
      </Grid>
    </>
  )
}

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}