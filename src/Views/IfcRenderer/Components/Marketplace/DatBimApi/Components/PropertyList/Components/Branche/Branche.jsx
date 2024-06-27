import { useEffect, useState } from "react";
import {
  Grid,
  makeStyles
} from "@material-ui/core";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import SelectElem from "../../../../../../../../../Components/SelectElem";

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
  setBranche
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (sessionStorage.getItem("token")) {
        try {
          const { data } = await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_DATBIM_HISTORY}/projects/`,
            headers: {
              "content-type": "application/json",
              //"X-Auth-Token": sessionStorage.getItem("token"),
            },
          });
    
          console.log('handleGetProjects data', data);
          const data1 = [
            {
              id: '3f5ed202-39ee-454c-9041-51a113e76d23',
              nameProject: 'Project 1',
              description: 'Project 1'
            },
            {
              id: 'c2cf4cf4-12ce-4c51-bf08-20060b3b83f8',
              nameProject: 'Project 2',
              description: 'Project 2'
            },
            {
              id: '44e87a23-c30b-40f6-a3bc-75d05ddd44ba',
              nameProject: 'Project 3',
              description: 'Project 3'
            },
            {
              id: '7c3c4c7b-51aa-4288-b64b-8342fe1ab000',
              nameProject: 'project 1',
              description: ''
            },
          ];
    
          setProjects(data1);
        } catch (err) {
          console.log('Error get projects history', err);
        }
      }
    }
    init();
  }, [selectedObject]);

  const handleChange = async (event) => {
    const { name, value } = event.target;

    if (name === 'project') {
      const selectedProject = projects.find(p => p.id === value);
      setProject(selectedProject);
      try {
        const { data } = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_DATBIM_HISTORY}/projects/${selectedProject?.id}/branches`,
          headers: {
            "content-type": "application/json",
          },
        });

        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches', error);
      }
    } else if (name === 'model') {
      const selectedBranch = branches?.find(b => b?.name === value);
      setBranche(selectedBranch);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
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
      </Grid>
      <Grid item xs={4}>
        {project?.id && branches?.length  > 0 && 
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