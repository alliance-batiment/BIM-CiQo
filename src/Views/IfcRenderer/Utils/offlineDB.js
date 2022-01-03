import React, { useState, useEffect } from 'react';
import Dexie from "dexie";

const offlineDB = () => {
  //set the database 
  const db = new Dexie("ReactDexie");
  //create the database store
  db.version(1).stores({
    models: "title, content, file"
  })
  db.open().catch((err) => {
    console.log(err.stack || err)
  });

  //set the state and property
  const [modelTitle, setModelTitle] = useState("");
  const [modelContent, setModleContent] = useState("");
  const [modelFile, setModelFile] = useState("");
  const [models, setModels] = useState("");

  //read the file and decode it
  const getFile = (e) => {
    console.log(e)

    let reader = new FileReader();
    reader.readAsDataURL(e[0]);
    reader.onload = (e) => {
      setModelFile(reader.result);
    }
  }

  const deleteModel = async (id) => {
    console.log(id);
    db.models.delete(id);
    let allModels = await db.models.toArray();
    //set the models
    setModels(allModels);
  }

  //submit 
  const getModelInfo = (e) => {
    e.preventDefault();
    if (modelTitle !== "" && modelContent !== "" && modelFile !== "") {
      let model = {
        title: modelTitle,
        content: modelContent,
        file: modelFile
      }
      db.models.add(model).then(async () => {
        //retrieve all models inside the database
        let allModels = await db.models.toArray();
        //set the posts
        setModels(allModels);
      });
    }
  }


}

export default offlineDB;