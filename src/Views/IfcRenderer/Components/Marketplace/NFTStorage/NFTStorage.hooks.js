import { useEffect, useState } from 'react';
import {
  Vector2
} from "three";
import axios from "axios";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';


function UseWeb3({
  bimData
}) {
  const [state, setState] = useState({
    bimData,
    loading: true,
    views: {
      value: 'home',
      list: ['home', 'storage', 'validation']
    },
    files: {
      value: '',
      list: []
    }
  })

  const handleListUploads = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4MkVGQzgzMzZBODZCNEMyODRGQ0FGN2EwMzBBOWRlRmUzMDdlQzIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDQ3ODU5NzE5NDMsIm5hbWUiOiJ0cmliaW0ifQ.gJL4cjZwmY2234oI18E2KH0fQ60w5k7ji0jMxQkZI_0";
    const web3storage = new Web3Storage({ token })
    console.log('web3storage', web3storage)
    try {
      const uploads = [];
      for await (const upload of web3storage.list()) {
        uploads.push(upload);
        // console.log(`${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`)
        console.log(`upload`, upload)
      }
      if (uploads.length > 0) {
        setState({
          ...state,
          loading: false,
          files: {
            ...state.files,
            list: [...uploads]
          }
        })
      }
    } catch (e) {
      // only return false for auth-related errors
      if (e.message.includes('401') || e.message.includes('403')) {
        console.log('invalid token', e.message)
        return false
      }
      // propagate non-auth errors
      throw e
    }
  }

  const handleCapture = () => {
    const link = document.createElement("a");
    link.href = state.bimData.viewer.context.renderer.newScreenshot(
      false,
      undefined,
      new Vector2(4000, 4000)
    );
    return
  };


  const handleUploadFile = async (e) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4MkVGQzgzMzZBODZCNEMyODRGQ0FGN2EwMzBBOWRlRmUzMDdlQzIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDQ3ODU5NzE5NDMsIm5hbWUiOiJ0cmliaW0ifQ.gJL4cjZwmY2234oI18E2KH0fQ60w5k7ji0jMxQkZI_0";
    const web3storage = new Web3Storage({ token });

    const viewer = state.bimData.viewer;
    const ifcData = await viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);


    const imgCapture = state.bimData.viewer.context.renderer.newScreenshot(
      false,
      undefined,
      new Vector2(4000, 4000)
    );

    console.log('imgCapture', imgCapture);
    var byteString = atob(imgCapture.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blobImg = new Blob([ab], { type: 'image/png' });
    const metaData = { nom: 'test' }
    const blobMetaData = new Blob([JSON.stringify(metaData)], { type: 'application/json' });
    const blobIfc = new Blob([ifcData], { type: 'text/plain' });


    const files = [
      new File([blobImg], 'ifcImg.png'),
      new File([blobMetaData], 'ifcMetaData.json'),
      new File([blobIfc], 'ifcFile.ifc')
    ]

    console.log('files', files)
    const onRootCidReady = cid => {
      console.log('uploading files with cid:', cid)
    }

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = size => {
      uploaded += size
      const pct = totalSize / uploaded
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }
    const cid = await web3storage.put(files, { onRootCidReady, onStoredChunk });

    console.log('stored files with cid:', cid)
  };

  const handleDownloadFile = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk4MkVGQzgzMzZBODZCNEMyODRGQ0FGN2EwMzBBOWRlRmUzMDdlQzIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDQ3ODU5NzE5NDMsIm5hbWUiOiJ0cmliaW0ifQ.gJL4cjZwmY2234oI18E2KH0fQ60w5k7ji0jMxQkZI_0";
    const web3storage = new Web3Storage({ token });
    const cid = 'bafybeic5fnywrvycf5hjfk7gxyvzdpkn525om7lack4r4anhzqjy6dxjba'
    const res = await web3storage.get(cid);
    console.log(`Got a response! [${res.status}]`, res)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }

    const files = await res.files();
    console.log('files', files)
    // for (const file of files) {
    //   console.log('files', file)
    //   console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
    //   let ifcDataString = new TextDecoder().decode(file.buffer);
    //   console.log('ifcDataString', ifcDataString)
    // }



    // var element = document.createElement("a");
    // element.setAttribute(
    //   "href",
    //   "data:text/plain;charset=utf-8," + encodeURIComponent(newIfcDataString)
    // );
    // element.setAttribute("download", "export.ifc");

    // element.style.display = "none";
    // document.body.appendChild(element);

    // element.click();

    // document.body.removeChild(element);
  };

  const handleShowFile = async () => {
    const viewer = state.bimData.viewer;
    const model = await viewer.IFC.loadIfcUrl('https://bafybeic5fnywrvycf5hjfk7gxyvzdpkn525om7lack4r4anhzqjy6dxjba.ipfs.dweb.link/Duplex%20%282%29.ifc');
  };

  const handleRemoveFile = async () => {

  };

  return {
    state,
    setState,
    handleListUploads,
    handleUploadFile,
    handleDownloadFile,
    handleShowFile,
    handleRemoveFile
  }
}

export {
  UseWeb3
};