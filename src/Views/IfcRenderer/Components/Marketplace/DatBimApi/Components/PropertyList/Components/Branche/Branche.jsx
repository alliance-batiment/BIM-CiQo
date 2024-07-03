import { useEffect, useState } from "react";
import {
  Grid,
  makeStyles
} from "@material-ui/core";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import SelectElem from "../../../../../../../../../Components/SelectElem";
import { IfcViewerAPI } from "web-ifc-viewer";
import * as WebIFC from "web-ifc";
import { IfcAPI } from 'web-ifc';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    width: "100%",
    underline: "black",
    margin: "20px 0px",
    "&:before": {
      borderBottom: "1px solid #E6464D",
    },
    "&:after": {
      borderBottom: `2px solid #E6464D`,
    },
  },
  datBimList: {
    color: "white",
    "&:nth-child(odd)": {
      backgroundColor: "#DCDCDC",
      opacity: 0.8,
    },
  },
  datBimCardTitle: {
    margin: 0,
    color: "white",
  },
  table: {
    minWidth: "100%",
  },
  button: {
    marginTop: "10px",
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
}));

const Branche = ({
  objSelected,
  selectedObject,
  project,
  setProject,
  branche,
  setBranche,
  viewer
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (sessionStorage.getItem("token")) {
        try {
          const manager = await viewer.IFC.loader.ifcManager;
          const ifcProjectExpressId = await manager.getAllItemsOfType(0, WebIFC.IFCPROJECT, false);
          const ifcProjectProperties = await manager.getItemProperties(0, ifcProjectExpressId[0]);
          const ifcGuid = ifcProjectProperties?.GlobalId?.value;
          console.log('ifcProjectProperties=>', ifcProjectProperties);

          // Fetch the list of projects from the API
          const { data: projects } = await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_DATBIM_HISTORY}/projects/`,
            headers: {
              "content-type": "application/json",
              //"X-Auth-Token": sessionStorage.getItem("token"),
            },
          });

          // Find if the project ID exists in the list of projects
          const projectExists = projects.find(p => p === ifcGuid);
          if (projectExists) {
            // Fetch the branches for the project
            const { data: branches } = await axios({
              method: "get",
              url: `${process.env.REACT_APP_API_DATBIM_HISTORY}/projects/${projectExists}/branches`,
              headers: {
                "content-type": "application/json",
              },
            });
            setBranches(branches);
          }

          
    
          
    
        } catch (err) {
          console.log('Error get projects history', err);
        }
      }
    }
    init();
  }, [selectedObject]);

  const handleChange = async (event) => {
    const { name, value } = event.target;

    // if (name === 'project') {
    //   const selectedProject = projects.find(p => p.id === value);
    //   setProject(selectedProject);
    //   try {
    //     const { data } = await axios({
    //       method: "get",
    //       url: `${process.env.REACT_APP_API_DATBIM_HISTORY}/projects/${selectedProject?.id}/branches`,
    //       headers: {
    //         "content-type": "application/json",
    //       },
    //     });

    //     setBranches(data);
    //   } catch (error) {
    //     console.error('Error fetching branches', error);
    //   }
    // } 
    if (name === 'model') {
      const selectedBranch = branches?.find(b => b?.name === value);
      setBranche(selectedBranch);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={4}>
        <SelectElem
          label="project"
          placeholder="project"
          name="project"
          onChange={handleChange}
          value={project?.id}
          list={projects?.map((project, index) => (
            { id: project?.id, name: project?.nameProject }
          ))}
          required={true}
        />
      </Grid> */}
      <Grid item xs={4}>
        {branches?.length  > 0 && 
          <SelectElem
            label="model"
            placeholder="model"
            name="model"
            onChange={handleChange}
            value={branche?.name}
            list={branches?.map((branche, index) => (
              { id: branche?.name, name: branche?.name }
            ))}
            required={true}
          />
        }
      </Grid>
    </Grid>
  );
};

export default Branche;