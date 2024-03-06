import { useEffect, useState } from 'react';
import axios from "axios";

const {
  REACT_APP_THIRD_PARTY_API,
  REACT_APP_API_GATEWAY_URL
} = process.env;

function UseTracim({
  viewer
}) {
  const [locked, setLocked] = useState(false);
  const [apiInformation, setApiInformation] = useState({
    lockProject: "",
    unlockProject: "",
    updateProject: "",
  });

  const handleUpdateProject = async () => {
    try {
      // EXPORT FICHIER IFC
      const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
      console.log('ifcData', ifcData);
      let ifcDataString = new TextDecoder().decode(ifcData);
      console.log('IFC STRING', ifcDataString);
      let newIfcDataString = ifcDataString.replace(
        "FILE_NAME('no name', '', (''), (''), 'web-ifc-export');",
        "FILE_NAME('0001','2011-09-07T12:40:02',(''),(''),'Autodesk Revit MEP 2011 - 1.0','20100326_1700 (Solibri IFC Optimizer)','');"
      );
      console.log('newIfcDataString', newIfcDataString);




      const ifcBlob = new Blob([newIfcDataString], { type: 'text/plain' });
      console.log('ifcBlob', ifcBlob)
      const ifcFile = new File([ifcBlob], 'ifcFile');
      console.log('model', ifcFile)

      // Accès à Tracim
      const query = new URLSearchParams(window.location.search);

      const content_id = query.get('content_id');
      const space_id = query.get('space_id');
      const user_id = query.get('user_id');

      console.log('handleInitTracim Content ID:', content_id);
      console.log('handleInitTracim Space ID:', space_id);
      console.log('handleInitTracim User ID:', user_id);

      const formData = new FormData();
      formData.append('content_id', content_id);
      formData.append('space_id', space_id);
      formData.append('user_id', user_id);
      formData.append('file', ifcFile);
      const res = await axios.put(`${REACT_APP_API_GATEWAY_URL}/tracim/updateModel`, formData);

      console.log('res', res);

      //sessionStorage.setItem("axeobim_lock_token", res.data.lock_token);
      //setLocked(false);
      setApiInformation({
        ...apiInformation,
        updateProject: 'Maquette mise à jour'
      })
    } catch (err) {
      console.log('err', err);
      setApiInformation({
        ...apiInformation,
        updateProject: 'Non connecté à Tracim'
      })
    }
  }

  return {
    setLocked,
    setApiInformation,
    handleUpdateProject
  }
};

export {
  UseTracim
};