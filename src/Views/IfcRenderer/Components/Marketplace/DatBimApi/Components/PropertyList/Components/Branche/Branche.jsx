import { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  Typography
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
          setLoading(true);
          const manager = await viewer.IFC.loader.ifcManager;
          const ifcProjectExpressId = await manager.getAllItemsOfType(0, WebIFC.IFCPROJECT, false);
          const ifcProjectProperties = await manager.getItemProperties(0, ifcProjectExpressId[0]);
          const ifcGuid = ifcProjectProperties?.GlobalId?.value;
          console.log('ifcProjectProperties=>', ifcProjectProperties);

          const allProjectsRes = await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}/history/projects`);
          const projects = allProjectsRes?.data;

          // Find if the project ID exists in the list of projects
          const projectExists = projects.find(p => p === ifcGuid);
          if (projectExists) {
            const userInformation = await axios.get(
              `${process.env.REACT_APP_API_DATBIM}/user/information`,
              {
                headers: {
                  "X-Auth-Token": sessionStorage.getItem("token"),
                },
              }
            );
            console.log('userInformation=>', userInformation);
            const firstUserRole = userInformation?.data?.roles?.[0]?.role_description;


            const { data } = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/history/project`,
              {
                projectId: ifcGuid,
              }, 
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
              }
            );
            const projectPortalId = data?.metadata?.portailId;
            const portalUserRole = userInformation?.data?.roles?.find(role => role?.portal_id == projectPortalId)?.role_description;

            const userRole = portalUserRole ? portalUserRole : firstUserRole;

            if(userRole === "Administrateur de tous les portails" || 
              userRole === "Administrateur de portail" || 
              userRole === "Gestionnaire"
            ){
              const { data: branches } = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/history/branches`,
                {
                  projectId: projectExists,
                }, 
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
                }
              );
  
              setBranches(branches);
            }
            else {
              // "Utilisateur simple" n'a accès qu'à sa branche
              const { data } = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/history/userDefaultBranch`,
                {
                  projectId: projectExists,
                  userId: sessionStorage.getItem('userId'),
                }, 
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
                }
              );
    
              console.log('userDefaultBranch', data)
    
    
              setBranches([data])
            }

            
            setProject(ifcGuid);
            setLoading(false);
          }
        } catch (err) {
          console.log('Error get projects history', err);
          setLoading(false);
        }
      }
    }
    init();
  }, [selectedObject]);

  const handleChange = async (event) => {
    const { name, value } = event.target;

    if (name === 'model') {
      const selectedBranch = branches?.find(b => b?.name === value);
      setBranche(selectedBranch);
    }
  };

  return (
    <Grid container spacing={3}>
      {loading ? (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <CircularProgress color="#e8585f" />
          <Typography>Chargement des modèles en cours...</Typography>
      </Grid>
      ):(
        <Grid item xs={6}>
          {branches?.length  > 0 && 
            <SelectElem
              label="Modèle"
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
      )}
    </Grid>
  );
};

export default Branche;