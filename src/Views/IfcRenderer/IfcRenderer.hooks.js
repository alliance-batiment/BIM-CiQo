import { useEffect, useState } from 'react';
import * as WebIFC from 'web-ifc';
import {
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

function UseIfcRenderer() {
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
      return
    };
    console.log('found', found)
    setModelID(found.modelID);
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

  const addElementsNewProperties = async ({
    viewer,
    modelID,
    expressIDs
  }) => {
    const modelId = modelID ? modelID : 0;
    console.log('ADD PROPERTY')
    if (expressIDs && expressIDs.length > 0) {
      const allLines = await viewer.IFC.loader.ifcManager.state.api.GetAllLines(modelId);
      console.log('allLines', allLines)
      let maxExpressId = 0;
      await Object.keys(allLines._data).forEach(index => {
        maxExpressId = Math.max(maxExpressId, allLines._data[index])
      });
      let ifcPropertySingleValue = new WebIFC.IfcPropertySingleValue(
        maxExpressId + 1,
        IFCPROPERTYSINGLEVALUE,
        str('New_Label'),
        empty(),
        str('New_Value'),
        empty(),
      );

      let rawLineIfcPropertySingleValue = {
        ID: ifcPropertySingleValue.expressID,
        type: ifcPropertySingleValue.type,
        arguments: ifcPropertySingleValue.ToTape()
      };

      await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySingleValue);

      console.log('rawLineIfcPropertySingleValue', rawLineIfcPropertySingleValue)
      let ifcPropertySet = new WebIFC.IfcPropertySet(
        maxExpressId + 2,
        IFCPROPERTYSET,
        str(Math.random().toString(16).substr(2, 8)),
        ref(33),
        str('Pset_OPENDTHX'),
        empty(),
        [ref(maxExpressId + 1)]
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
        maxExpressId + 3,
        IFCRELDEFINESBYPROPERTIES,
        str(Math.random().toString(16).substr(2, 8)),
        ref(33),
        empty(),
        empty(),
        elementsList,
        ref(maxExpressId + 2)
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


  }

  return {
    models,
    initIndexDB,
    getModels,
    addTransformControls,
    getElementProperties,
    addElementsNewProperties
  }
};

export {
  UseIfcRenderer
};