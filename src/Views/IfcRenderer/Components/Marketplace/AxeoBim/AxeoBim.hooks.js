import { useEffect, useState } from 'react';
import axios from "axios";

const {
  REACT_APP_THIRD_PARTY_API
} = process.env;

function UseAxeoBim({
  viewer
}) {
  const [locked, setLocked] = useState(false);
  const [apiInformation, setApiInformation] = useState({
    lockProject: "",
    unlockProject: "",
    updateProject: "",
  });

  const handleLockProject = async () => {
    try {
      const accessToken = sessionStorage.getItem("axeobim_access_token");
      const refreshToken = sessionStorage.getItem("axeobim_refresh_token");
      const idDocument = sessionStorage.getItem("axeobim_id_document");
      const idEnvironnement = sessionStorage.getItem("axeobim_id_environnement");
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      console.log('idDocument', idDocument);
      console.log('idEnvironnement', idEnvironnement);

      const res = await axios({
        method: "post",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/lockModel`,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          idDocument,
          idEnvironnement,
          accessToken,
          refreshToken
        }
      })
      console.log('res.data', res.data);
      setApiInformation({
        ...apiInformation,
        lockProject: ''
      })
      sessionStorage.setItem("axeobim_lock_token", res.data.lock_token);
      setLocked(true);
    } catch (err) {
      setApiInformation({
        ...apiInformation,
        lockProject: err.response.data.error
      })
    }
  }

  const handleUnlockProject = async () => {
    try {
      const accessToken = sessionStorage.getItem("axeobim_access_token");
      const refreshToken = sessionStorage.getItem("axeobim_refresh_token");
      const idDocument = sessionStorage.getItem("axeobim_id_document");
      const idEnvironnement = sessionStorage.getItem("axeobim_id_environnement");
      const lockToken = sessionStorage.getItem("axeobim_lock_token");

      const res = await axios({
        method: "post",
        url: `${REACT_APP_THIRD_PARTY_API}/axeobim/unlockModel`,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          idDocument,
          idEnvironnement,
          accessToken,
          refreshToken,
          lockToken
        }
      })
      setApiInformation({
        ...apiInformation,
        unlockProject: ''
      })
      sessionStorage.setItem("axeobim_lock_token", res.data.lock_token);
      setLocked(false);
    } catch (err) {
      setApiInformation({
        ...apiInformation,
        unlockProject: err.response.data.error
      })
    }
  }

  const handleUpdateProject = async () => {
    try {
      const ifcData =
        await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
      let ifcDataString = new TextDecoder().decode(ifcData);
      let newIfcDataString = ifcDataString.replace(
        "FILE_NAME('no name', '', (''), (''), 'web-ifc-export');",
        "FILE_NAME('0001','2011-09-07T12:40:02',(''),(''),'Autodesk Revit MEP 2011 - 1.0','20100326_1700 (Solibri IFC Optimizer)','');"
      );
      console.log('ifcDataString', ifcDataString)
      const ifcBlob = new Blob([newIfcDataString], { type: 'text/plain' });
      console.log('ifcBlob', ifcBlob)
      const ifcFile = new File([ifcBlob], 'ifcFile');
      console.log('model', ifcFile)

      const accessToken = sessionStorage.getItem("axeobim_access_token");
      const refreshToken = sessionStorage.getItem("axeobim_refresh_token");
      const idDocument = sessionStorage.getItem("axeobim_id_document");
      const idEnvironnement = sessionStorage.getItem("axeobim_id_environnement");
      const lockToken = sessionStorage.getItem("axeobim_lock_token");

      const formData = new FormData();
      formData.append('accessToken', accessToken);
      formData.append('idDocument', idDocument);
      formData.append('idEnvironnement', idEnvironnement);
      formData.append('lockToken', lockToken);
      formData.append('file', ifcFile);
      const res = await axios.put(`${REACT_APP_THIRD_PARTY_API}/axeobim/updateModel`, formData);
      sessionStorage.setItem("axeobim_lock_token", res.data.lock_token);
      setLocked(false);
      setApiInformation({
        ...apiInformation,
        updateProject: ''
      })
    } catch (err) {
      setApiInformation({
        ...apiInformation,
        updateProject: err.response.data.error
      })
    }
  }

  // async function handleOauthAuthenticate() {
  //   try {
  //     const res = await axios({
  //       method: "post",
  //       url: `${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/authenticate`,
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //     })
  //     setAccessToken(res.data.access_token)
  //     console.log('axeobim_access_token', res.data.access_token)
  //     sessionStorage.setItem("axeobim_access_token", res.data.access_token);
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  // async function handleOauthAuthorize() {
  //   try {
  //     const res = await axios({
  //       method: "get",
  //       url: `${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/authorize`,
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //     })
  //     console.log('res', res)
  //     sessionStorage.setItem("axeobim_access_token", res.data.access_token);
  //     setLoginComponent(res.data);
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  // const handleOauthGetToken = async (code) => {
  //   try {
  //     console.log('code', code)
  //     const res = await axios({
  //       method: "post",
  //       url: `${REACT_APP_THIRD_PARTY_API}/axeobim/oauth/gettoken`,
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       data: {
  //         code
  //       }
  //     })
  //     console.log('res.data', res.data);
  //     sessionStorage.setItem("axeobim_access_token", res.data.access_token);
  //     sessionStorage.setItem("axeobim_refresh_token", res.data.refresh_token);
  //     sessionStorage.setItem("axeobim_token_type", res.data.token_type);
  //     setLoginComponent(res.data)
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  // const handleOauthLoginOnSuccess = (response) => {
  //   console.log('code', sessionStorage.getItem("axeobim_access_token"))
  //   sessionStorage.setItem("axeobim_code", response.code);
  //   handleOauthGetToken(response.code);
  // };

  // const handleOauthLoginOnFailure = (response) => {
  //   console.error(response);
  // };

  // const handleAdminProjects = async () => {
  //   try {
  //     console.log('access_token_3', sessionStorage.getItem("axeobim_access_token"));
  //     const res = await axios({
  //       method: "get",
  //       url: `${REACT_APP_THIRD_PARTY_API}/axeobim/administration/projects`,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       params: {
  //         accessToken: `${sessionStorage.getItem("axeobim_access_token")}`
  //       }
  //     })
  //     console.log('res', res)
  //     // sessionStorage.setItem("axeobim_access_token", res.data.access_token);
  //     // setLoginComponent(res.data);
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }



  return {
    locked,
    setLocked,
    apiInformation,
    setApiInformation,
    handleLockProject,
    handleUnlockProject,
    handleUpdateProject
  }
};

export {
  UseAxeoBim
};