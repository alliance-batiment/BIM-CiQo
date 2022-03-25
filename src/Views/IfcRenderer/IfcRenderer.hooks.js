import { useEffect, useState } from 'react';
import * as WebIFC from 'web-ifc';
import {
  IFCBUILDINGSTOREY,
  IFCPROJECT,
  IFCSPACE,
  IFCOPENINGELEMENT,
  IFCWALLSTANDARDCASE,
  IFCWALL,
  IFCSTAIR,
  IFCCOLUMN,
  IFCSLAB,
  IFCROOF,
  IFCFOOTING,
  IFCFURNISHINGELEMENT,
  IFCRELDEFINESBYPROPERTIES,
  IFCPROPERTYSET,
  IFCPROPERTYSINGLEVALUE
} from 'web-ifc';
import Dexie from "dexie";
import {
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  Color,
  DoubleSide,
  MathUtils,
  EdgesGeometry,
  LineBasicMaterial,
  MeshBasicMaterial
} from 'three';
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { BuildModel } from './Utils/addColumns';


function UseIfcRenderer({
  eids,
  setEids
}) {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initIndexDB = async () => {
    //set the database 
    const db = new Dexie("tribimDB");
    //create the database store
    db.version(1).stores({
      models: "title, content, file"
    })
    db.open().catch((err) => {
      console.log(err.stack || err)
    });

    return db;
  }


  const meshMaterials = {
    invisibleMaterial: new MeshLambertMaterial({
      transparent: true,
      opacity: 0,
      color: 0x77aaff,
      depthTest: false,
      side: DoubleSide,
    })
  };

  const getModels = async (db) => {
    let allModels = await db.models.toArray();
    console.log('allModels', allModels)
    setModels(allModels);
    return allModels;
  }

  const addTransformControls = (viewer) => {
    const scene = viewer.IFC.context.scene.scene;
    const renderer = viewer.IFC.context.renderer.renderer;
    const camera = viewer.IFC.context.ifcCamera.activeCamera;
    const orbitControls = viewer.IFC.context.ifcCamera.controls;
    const item = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshLambertMaterial({
        color: 'red',
        side: DoubleSide
      })
    );
    scene.add(item);

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('change', function () {
      renderer.render(scene, camera);
    });
    transformControls.addEventListener('dragging-changed', function (event) {
      orbitControls.enabled = !event.value;
    });

    scene.add(transformControls);
    transformControls.attach(item);

    // if (event.code === "KeyL") {
    //   transformControls.attach(item);
    // }
    // if (event.code === "KeyP") {
    //   transformControls.detach(item);
    // }
    // if (event.code === 'KeyQ') {
    //   transformControls.setSpace(transformControls.space === 'local' ? 'world' : 'local');
    // }
    // if (event.code === 'KeyShift') {
    //   transformControls.setTranslationSnap(100);
    //   transformControls.setRotationSnap(MathUtils.degToRad(15));
    //   transformControls.setScaleSnap(0.25);
    // }
    // if (event.code === 'KeyT') {
    //   transformControls.setMode('translate');
    // }
    // // if (event.code === 'KeyR') {
    // //   transformControls.setMode('rotate');
    // // }
    // if (event.code === 'KeyS') {
    //   transformControls.setMode('scale');
    // }
    // if (event.code === 'KeySpacebar') {
    //   transformControls.enabled = !transformControls.enabled;
    // }
  }

  const handleSelectedElementsIsolation = ({
    eids
  }) => {

  }

  const select = (viewer, setModelID, modelID, expressID, pick = true) => {
    if (pick) viewer.IFC.pickIfcItemsByID(modelID, expressID);
    setModelID(modelID);
  }

  const getElementProperties = async ({
    viewer,
    setModelID,
    setElement
  }) => {
    const found = await viewer.IFC.pickIfcItem(true, 1);

    if (found == null || found == undefined) {
      await viewer.IFC.unpickIfcItems();
      setEids([]);
      return
    };

    setModelID(found.modelID);
    setEids([found.id]);
    console.log('eid', eids)
    select(viewer, setModelID, found.modelID, found.id, false);
    const elementProperties = await viewer.IFC.getProperties(found.modelID, found.id, true, true);
    console.log(elementProperties);

    const type = await viewer.IFC.loader.ifcManager.getIfcType(found.modelID, found.id);
    console.log(type);

    if (elementProperties.psets.length > 0) {
      const psets = await Promise.all(elementProperties.psets.map(async (pset) => {
        if (pset.HasProperties && pset.HasProperties.length > 0) {
          const newPset = await Promise.all(pset.HasProperties.map(async (property) => {
            const label = property.Name.value;
            const value = property.NominalValue ? (property.NominalValue.value ? property.NominalValue.value : '') : '';
            return {
              label,
              value
            }
          }));

          return {
            ...pset,
            HasProperties: [...newPset]
          }
        }
        if (pset.Quantities && pset.Quantities.length > 0) {
          const newPset = await Promise.all(pset.Quantities.map(async (property) => {
            const label = property.Name.value;
            const value = property.NominalValue ? property.NominalValue.value : null;
            return {
              label,
              value
            }
          }));

          return {
            ...pset,
            HasProperties: [...newPset]
          }
        }
        return {
          ...pset,
          HasProperties: []
        }
      }));
      const elem = {
        ...elementProperties,
        type: type ? type : 'NO TYPE',
        modelID: found.modelID,
        psets
      };

      if (elem) {
        setElement(elem);
      }
    }
  }

  function empty() {
    return { type: 6 };
  }
  function str(v) {
    return { type: 1, value: v };
  }
  function ref(v) {
    return { type: 5, value: v }
  }

  function ifcLabel(v) {
    return { type: 2, label: 'IFCLABEL', valueType: 1, value: v }
  }

  function ifcText(v) {
    return { type: 2, label: 'IFCTEXT', valueType: 1, value: v }
  }

  const editIfcModel = async ({
    viewer
  }) => {
    const manager = await viewer.IFC.loader.ifcManager;
    const storeysIDs = await manager.getAllItemsOfType(0, IFCBUILDINGSTOREY, false);
    const storeyID = storeysIDs[0];
    const storey = await manager.getItemProperties(0, storeyID);
    console.log(storey);

    storey.Name.value = "Nivel 1 - Editado";
    manager.ifcAPI.WriteLine(0, storey);

    const data = await manager.ifcAPI.ExportFileAsIFC(0);
    const blob = new Blob([data]);
    const file = new File([blob], "modified.ifc");

    const link = document.createElement('a');
    link.download = 'modified.ifc';
    link.href = URL.createObjectURL(file);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const addOrModifyDataToIfc = async ({
    viewer,
    modelId,
    expressIDs,
    properties
  }) => {
    const manager = await viewer.IFC.loader.ifcManager;
    const allLines = await manager.state.api.GetAllLines(modelId);
    let maxExpressId = 0;
    await Object.keys(allLines._data).forEach(index => {
      maxExpressId = Math.max(maxExpressId, allLines._data[index])
    });


    await Promise.all(expressIDs.map(async (expressID) => {
      const elementProperties = await viewer.IFC.getProperties(0, expressID, true, true);
      console.log('itemProperties', elementProperties)

    }));


    let propertiesEids = [];
    console.log("properties", properties)
    properties.forEach((property, index) => {


    });


  }


  const addDataToIfc = async ({
    viewer,
    modelId,
    expressIDs,
    properties
  }) => {
    const allLines = await viewer.IFC.loader.ifcManager.state.api.GetAllLines(modelId);
    console.log('allLines', allLines)
    //const line = await viewer.IFC.loader.ifcManager.state.api.GetLine(modelId, 39116);
    const line = await viewer.IFC.loader.ifcManager.state.api.GetRawLineData(modelId, 39116);
    console.log('lines', line)
    let maxExpressId = 0;
    await Object.keys(allLines._data).forEach(index => {
      maxExpressId = Math.max(maxExpressId, allLines._data[index])
    });

    let propertiesEids = [];
    properties.map(async (property, index) => {
      const propertyEid = maxExpressId + index + 1;
      propertiesEids.push(ref(propertyEid))
      let ifcPropertySingleValue = new WebIFC.IfcPropertySingleValue(
        propertyEid,
        IFCPROPERTYSINGLEVALUE,
        property.property_name ? str(`${property.property_name}`) : empty(),
        property.property_definition ? str(`${property.property_definition}`) : empty(),
        property.text_value ? ifcText(`${property.text_value}`) : empty(),
        property.unit ? str(`${property.unit}`) : empty(),
      );

      let rawLineIfcPropertySingleValue = {
        ID: ifcPropertySingleValue.expressID,
        type: ifcPropertySingleValue.type,
        arguments: ifcPropertySingleValue.ToTape()
      };

      await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySingleValue);
    })

    console.log('propertiesEids', propertiesEids)
    const psetEid = propertiesEids[propertiesEids.length - 1].value + 1;
    let ifcPropertySet = new WebIFC.IfcPropertySet(
      psetEid,
      IFCPROPERTYSET,
      str(Math.random().toString(16).substr(2, 8)),
      ref(33),
      str('Pset_OpendthX'),
      empty(),
      propertiesEids
    );
    console.log('ifcPropertySet', ifcPropertySet)
    let rawLineIfcPropertySet = {
      ID: ifcPropertySet.expressID,
      type: ifcPropertySet.type,
      arguments: ifcPropertySet.ToTape()
    };

    await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySet);
    console.log('rawLineIfcPropertySet', rawLineIfcPropertySet)
    const elementsList = expressIDs.map(expressID => {
      return ref(expressID);
    })

    let ifcRelDefinesByProperties = new WebIFC.IfcRelDefinesByProperties(
      psetEid + 1,
      IFCRELDEFINESBYPROPERTIES,
      str(Math.random().toString(16).substr(2, 8)),
      ref(33),
      empty(),
      empty(),
      elementsList,
      ref(psetEid)
    );
    // setEid(ID++);
    console.log('ifcRelDefinesByProperties', ifcRelDefinesByProperties)
    let rawLineIfcRelDefinesByProperties = {
      ID: ifcRelDefinesByProperties.expressID,
      type: ifcRelDefinesByProperties.type,
      arguments: ifcRelDefinesByProperties.ToTape()
    };
    await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcRelDefinesByProperties);

    console.log('rawLineIfcRelDefinesByProperties', rawLineIfcRelDefinesByProperties)
  }


  const addElementsNewProperties = async ({
    viewer,
    modelID,
    expressIDs,
    properties
  }) => {
    const modelId = modelID ? modelID : 0;
    console.log('ADD PROPERTY')
    if (expressIDs && expressIDs.length > 0) {
      if (properties.length > 0) {
        addOrModifyDataToIfc({
          viewer,
          modelId,
          expressIDs,
          properties
        })
      } else {
        addDataToIfc({
          viewer,
          modelId,
          expressIDs,
          properties: [{ property_name: "Epaisseur ou profondeur", text_value: "240.00" }]
        })
      }
    }
  }

  const addGeometryToIfc = async ({
    viewer,
    modelId
  }) => {
    const allLines = await viewer.IFC.loader.ifcManager.state.api.GetAllLines(modelId);
    let maxExpressId = 0;
    await Object.keys(allLines._data).forEach(index => {
      maxExpressId = Math.max(maxExpressId, allLines._data[index])
    });
    const ifcApi = viewer.IFC.loader.ifcManager.state.api;
    await BuildModel(modelId, ifcApi);
  }
  return {
    models,
    meshMaterials,
    initIndexDB,
    getModels,
    addTransformControls,
    getElementProperties,
    addElementsNewProperties,
    addGeometryToIfc,
    editIfcModel
  }
};

export {
  UseIfcRenderer
};