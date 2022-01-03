import React, { useState, useEffect } from 'react';
import Dexie from "dexie";

const Models = () => {
  //set the database 
  const db = new Dexie("tribimDB");
  //create the database store
  db.version(1).stores({
    models: "title, content, file"
  })
  db.open().catch((err) => {
    console.log(err.stack || err)
  });

  //set the state and property
  const [modelTitle, setModelTitle] = useState("");
  const [modelContent, setModelContent] = useState("");
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
        //set the models
        setModels(allModels);
      });
    }
  }

  useEffect(() => {
    //get all models from the database
    const getModels = async () => {
      let allModels = await db.models.toArray();
      setModels(allModels);
    }
    getModels();
  }, []);

  let modelData;

  if (models.length > 0) {
    modelData = <div className="modelsContainer">
      {
        models.map(model => {
          return <div className="model" key={model.title}>
            {/* <div style={{ backgroundImage: "url(" + model.file + ")" }} /> */}
            <h2>{model.title}</h2>
            <p>{model.content}</p>
            <button className="delete" onClick={() => deleteModel(model.title)}>Delete</button>
          </div>
        })
      }
    </div>
  } else {
    modelData = <div className="message">
      <p>There are no models to show</p>
    </div>
  }

  return (
    <React.Fragment>
      <form onSubmit={getModelInfo}>
        <div className="control">
          <label>Title</label>
          <input type="text" name="title" onChange={e => setModelTitle(e.target.value)} />
        </div>
        <div className="control">
          <label>Content</label>
          <textarea name="content" onChange={e => setModelContent(e.target.value)} />
        </div>
        <div className="control">
          <label htmlFor="cover" className="cover">Choose a file</label>
          <input type="file" id="cover" name="file" onChange={e => getFile(e.target.files)} />
        </div>

        <input type="submit" value="Submit" />
      </form>

      {modelData}

    </React.Fragment>
  );

}

export default Models;