import { useEffect, useState } from 'react';
import * as WebIFC from 'web-ifc';
import { IfcAPI } from "web-ifc/web-ifc-api";
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
  IFCOWNERHISTORY,
  IFCRELDEFINESBYPROPERTIES,
  IFCPROPERTYSET,
  IFCPROPERTYSINGLEVALUE
} from 'web-ifc';
import Dexie from "dexie";
import axios from "axios";
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
import { geometryTypes } from "./Utils/geometry-types";

function UseIfcRenderer({
  eids,
  setEids,
  state,
  setState
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

  function ifcBoolean(v) {
    return { type: 2, label: 'IFCBOOLEAN', valueType: 1, value: v }
  }


  function ifcText(v) {
    return { type: 2, label: 'IFCTEXT', valueType: 1, value: v }
  }

  // const editIfcModel = async ({
  //   viewer
  // }) => {
  //   const manager = await viewer.IFC.loader.ifcManager;
  //   const storeysIDs = await manager.getAllItemsOfType(0, IFCBUILDINGSTOREY, false);
  //   const storeyID = storeysIDs[0];
  //   const storey = await manager.getItemProperties(0, storeyID);
  //   console.log(storey);

  //   storey.Name.value = "Nivel 1 - Editado";
  //   manager.ifcAPI.WriteLine(0, storey);

  //   const data = await manager.ifcAPI.ExportFileAsIFC(0);
  //   const blob = new Blob([data]);
  //   const file = new File([blob], "modified.ifc");

  //   const link = document.createElement('a');
  //   link.download = 'modified.ifc';
  //   link.href = URL.createObjectURL(file);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // };

  const checkIfPsetExist = async ({
    psetName,
    manager,
    modelId
  }) => {
    let existingPset;
    if (psetName) {
      const psetsEid = await manager.getAllItemsOfType(
        modelId,
        IFCPROPERTYSET,
        false
      );
      console.log('psetsEid', psetsEid)
      await Promise.all(psetsEid.map(async (psetEid) => {
        const pset = await manager.getItemProperties(0, psetEid);
        if (psetName === pset.Name?.value) {
          console.log('pset.Name?.value')
          existingPset = { ...pset };
        }
      }));
    }
    console.log('psetsEid', existingPset)
    return {
      existingPset
    }
  }

  const handleGetJsonData = async (
    viewer,
    spatialStructure,
    progress
    // excludeGeometry
  ) => {
    // const data = {};
    const data = [];
    let count = 0
    for (const item of spatialStructure) {
      // setState({
      //   ...state,
      //   loading: true,
      //   loadingMessage: `Recherche: ${Math.round(count / spatialStructure.length * 100)} %`
      // });
      progress({
        loading: true,
        message: `Recherche: ${Math.round(count / spatialStructure.length * 100)} %`
      });
      count++;
      const props = await viewer.IFC.getProperties(0, item.expressID, true, true);
      data.push({
        ...item,
        ...props,
        type: item.type
      })
      // data = { ...data, [item.expressID] : {
      //   ...item,
      //   ...props,
      //   type: item.type
      // } }
      // data[item.expressID] = {
      //   ...item,
      //   ...props,
      //   type: item.type
      // }
    }
    return data;
    // console.log('viewer', viewer)
    // const modelID = state.models.value;
    // const manager = await viewer.IFC.loader.ifcManager;

    // const allItems = {};
    // const lines = await manager.ifcAPI.GetAllLines(modelID);

    // for (let i = 1; i <= lines.size(); i++) {
    //   try {
    //     const itemID = lines.get(i);
    //     // const props = await manager.ifcAPI.GetLine(modelID, itemID);
    //     // if(i < 10) {
    //     //   console.log('props', props)
    //     // }
    //     // const itemID = lines.get(i);
    //     const props = await viewer.IFC.getProperties(modelID, itemID, true, true);
    //     if (i < 10) {
    //       console.log('props', props)
    //     }
    //     props.type = props.__proto__.constructor.name;
    //     if (!excludeGeometry || !geometryTypes.has(props.type)) {
    //       allItems[itemID] = props;
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    // // const result = JSON.stringify(allItems, undefined, 2);

    // // const blob = new Blob([result], { type: "application/json" });
    // // var element = document.createElement("a");
    // // element.style.display = "none";
    // // element.href = URL.createObjectURL(blob);
    // // element.download = "data.json";
    // // document.body.appendChild(element);
    // // element.click();
    // // document.body.removeChild(element);

    // return allItems;
  }


  const addOrEditIfcPropertySingleValue = async ({
    expressID,
    type,
    name,
    description,
    value,
    unit,
    property
  }) => {
    const getPropertyValue = (type, value) => {

      if (value == null) {
        return ifcText(`no value`);
      } else {
        switch (type) {
          case 'IfcLabel':
          case 'IfcText':
            return ifcText(`${value}`);
          case 'IfcBoolean':
            return ifcBoolean(`${value}`);
          default:
            return ifcText(`${value}`);
        }
      }
    }


    let ifcPropertySingleValue = new WebIFC.IfcPropertySingleValue(
      expressID,
      type,
      name ? str(`${name}`) : str(`no name`),
      description ? str(`${description}`) : str(`${name}`),
      // value ? ifcText(`${value}`) : ifcText(`no value`),
      getPropertyValue(property.ifc_type, value),
      unit ? str(`${unit}`) : empty(),
      empty(),
    );

    let rawLineIfcPropertySingleValue = {
      ID: ifcPropertySingleValue.expressID,
      type: ifcPropertySingleValue.type,
      arguments: ifcPropertySingleValue.ToTape()
    };

    return rawLineIfcPropertySingleValue;
  }

  const addOrEditIfcPropertySet = async ({
    expressID,
    type,
    globalId,
    ifcOwnerHistoryExpressID,
    name,
    description,
    ifcPropertySingleValueExpressIDs
  }) => {
    let ifcPropertySet = new WebIFC.IfcPropertySet(
      expressID,
      type,
      globalId ? globalId : empty(),
      ifcOwnerHistoryExpressID ? ifcOwnerHistoryExpressID : empty(),
      name ? name : empty(),
      description ? description : empty(),
      ifcPropertySingleValueExpressIDs
    );

    let rawLineIfcPropertySet = {
      ID: ifcPropertySet.expressID,
      type: ifcPropertySet.type,
      arguments: ifcPropertySet.ToTape()
    };

    return rawLineIfcPropertySet;
  }

  const addOrEditIfcRelDefinesByProperties = async ({
    expressID,
    type,
    globalId,
    ifcOwnerHistoryExpressID,
    name,
    description,
    elementsList,
    ifcPropertySetExpressID
  }) => {
    let ifcRelDefinesByProperties = new WebIFC.IfcRelDefinesByProperties(
      expressID,
      type,
      globalId ? globalId : empty(),
      ifcOwnerHistoryExpressID ? ifcOwnerHistoryExpressID : empty(),
      name ? name : empty(),
      description ? description : empty(),
      elementsList,
      ifcPropertySetExpressID
    );

    let rawLineIfcRelDefinesByProperties = {
      ID: ifcRelDefinesByProperties.expressID,
      type: ifcRelDefinesByProperties.type,
      arguments: ifcRelDefinesByProperties.ToTape()
    };

    return rawLineIfcRelDefinesByProperties;
  }

  function DecodeIFCString(ifcString) {
    const resultString = ifcString?.replace(/'/g, "''");
    // const ifcUnicodeRegEx = /\\X2\\(.*?)\\X0\\/uig;
    // let resultString = ifcString;
    // let match = ifcUnicodeRegEx.exec(ifcString);
    // while (match) {
    //   const unicodeChar = String.fromCharCode(parseInt(match[1], 16));
    //   resultString = resultString.replace(match[0], unicodeChar);
    //   match = ifcUnicodeRegEx.exec(ifcString);
    // }
    return resultString;
  }

  const editIfcModel = async ({
    viewer,
    modelId,
    expressIDs,
    properties
  }) => {
    setState({
      ...state,
      loading: true,
      loadingMessage: "D??but de l'enrichissement...",
      alertStatus: true,
      alertMessage: "Connect??"
    });
    // try {
    const manager = await viewer.IFC.loader.ifcManager;
    const allLines = await manager.ifcAPI.GetAllLines(modelId);
    let maxExpressId = 0;
    await Object.keys(allLines._data).forEach(index => {
      maxExpressId = Math.max(maxExpressId, allLines._data[index])
    });

    const elementsList = await expressIDs.map(expressID => {
      return ref(expressID);
    });

    const ifcOwnerHistory = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelId,
      IFCOWNERHISTORY,
      false
    );
    const eidIfcOwnerHistory = (ifcOwnerHistory && ifcOwnerHistory.length > 0) ? ifcOwnerHistory[0] : 1;
    const newPsetOpendthXEids = [];
    const newPsetIFCEids = [];
    const rawLineIfcRelDefinesByPropertiesList = [];
    let propertySingleValueExpressId = maxExpressId + 1;

    let count = 0;

    // CREATION D'UNE BDD DE PROPERTIES ASSOCIE AU EXPRESSIDS
    // for (let expressID of expressIDs) {
    //   const psetList = {
    //     'psetId': {
    //       elemIds: 
    //     }
    //   };

    // }

    if (properties.length > 0) {
      // try {
      for (let property of properties) {
        setState({
          ...state,
          loading: true,
          loadingMessage: `Enrichissement: ${Math.round(count / properties.length * 100)} %`
        });
        count++;
        // Check if corresponding IfcPropertySet exists
        let existingPsetList = [];
        let existingPropertyList = [];

        for (let expressID of expressIDs) {
          const element = await viewer.IFC.getProperties(0, expressID, true, true);
          await element.psets?.map(pset => {
            pset.HasProperties?.forEach(prop => {
              if (prop.Name?.value === property.ifc_property_name || prop.Name?.value === property.property_name) {
                existingPropertyList.push(prop);
              }
            })
          })

          let existingPset = await element.psets?.find(pset => pset.Name?.value === property.ifc_class);

          if (existingPset) {
            existingPsetList.push(existingPset);
          }
        }

        if (existingPropertyList.length > 0) {
          const existingProperty = existingPropertyList[0];
          const rawLineIfcPropertySingleValue = await addOrEditIfcPropertySingleValue({
            expressID: existingProperty.expressID,
            type: IFCPROPERTYSINGLEVALUE,
            name: DecodeIFCString(existingProperty.Name.value),
            description: DecodeIFCString(property.property_definition),
            value: property.text_value,
            unit: property.unit,
            property
          });

          await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySingleValue);
        } else {
          propertySingleValueExpressId += 1;
          // Add or Edit IfcPropertySingleValue
          const ifcPropertySingleValueEid = propertySingleValueExpressId;
          const rawLineIfcPropertySingleValue = await addOrEditIfcPropertySingleValue({
            expressID: ifcPropertySingleValueEid,
            type: IFCPROPERTYSINGLEVALUE,
            name: DecodeIFCString(property.ifc_property_name),
            description: DecodeIFCString(property.property_definition),
            value: property.text_value,
            unit: property.unit,
            property
          });

          await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySingleValue);
          if (existingPsetList.length > 0) {
            const existingPset = existingPsetList[0];
            const existingPsetPropertyEids = existingPset.HasProperties?.map(p => ref(p.expressID));
            const rawLineIfcPropertySet = await addOrEditIfcPropertySet({
              expressID: existingPset.expressID,
              type: existingPset.type,
              globalId: existingPset.GlobalId,
              ifcOwnerHistoryExpressID: ref(eidIfcOwnerHistory),
              name: existingPset.Name,
              description: existingPset.Description,
              ifcPropertySingleValueExpressIDs: [...existingPsetPropertyEids, ref(ifcPropertySingleValueEid)]
            })

            await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySet);
          } else if (property.ifc_class !== 'Pset_opendthx' && property.ifc_class !== '') {
            propertySingleValueExpressId += 1;
            const ifcPropertySetEid = propertySingleValueExpressId;
            const rawLineIfcPropertySet = await addOrEditIfcPropertySet({
              expressID: ifcPropertySetEid,
              type: IFCPROPERTYSET,
              globalId: str(Math.random().toString(16).substr(2, 8)),
              ifcOwnerHistoryExpressID: ref(eidIfcOwnerHistory),
              name: str(property.ifc_class),
              ifcPropertySingleValueExpressIDs: [ref(ifcPropertySingleValueEid)]
            });

            await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySet);

            newPsetIFCEids.push(ref(ifcPropertySetEid));

            propertySingleValueExpressId += 1;
            const rawLineIfcRelDefinesByProperties = await addOrEditIfcRelDefinesByProperties({
              expressID: propertySingleValueExpressId,
              type: IFCRELDEFINESBYPROPERTIES,
              globalId: str(Math.random().toString(16).substr(2, 8)),
              ifcOwnerHistoryExpressID: ref(eidIfcOwnerHistory),
              name: empty(),
              description: empty(),
              elementsList: elementsList,
              ifcPropertySetExpressID: ref(ifcPropertySetEid)
            })
            // rawLineIfcRelDefinesByPropertiesList.push(rawLineIfcRelDefinesByProperties);
            await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcRelDefinesByProperties);

          } else {
            newPsetOpendthXEids.push(ref(ifcPropertySingleValueEid));
          }
        }

      }
      // } catch (e) {
      //   setState({
      //     ...state,
      //     loading: false,
      //     alertStatus: false,
      //     alertMessage: "Probl??me lors de l'enrichissement"
      //   });
      // }
    }


    if (newPsetOpendthXEids.length > 0) {
      propertySingleValueExpressId += 1;
      const ifcPropertySetEid = propertySingleValueExpressId;
      const rawLineIfcPropertySet = await addOrEditIfcPropertySet({
        expressID: ifcPropertySetEid,
        type: IFCPROPERTYSET,
        globalId: str(Math.random().toString(16).substr(2, 8)),
        ifcOwnerHistoryExpressID: ref(eidIfcOwnerHistory),
        name: str('Pset_opendthx'),
        ifcPropertySingleValueExpressIDs: newPsetOpendthXEids
      });

      await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySet);

      propertySingleValueExpressId += 1;
      const rawLineIfcRelDefinesByProperties = await addOrEditIfcRelDefinesByProperties({
        expressID: propertySingleValueExpressId,
        type: IFCRELDEFINESBYPROPERTIES,
        globalId: str(Math.random().toString(16).substr(2, 8)),
        ifcOwnerHistoryExpressID: ref(eidIfcOwnerHistory),
        name: empty(),
        description: empty(),
        elementsList: elementsList,
        ifcPropertySetExpressID: ref(ifcPropertySetEid)
      });

      // rawLineIfcRelDefinesByPropertiesList.push(rawLineIfcRelDefinesByProperties);
      await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcRelDefinesByProperties);
    }

    setState({
      ...state,
      loading: false,
      alertStatus: true,
      alertMessage: "Enrichissement r??ussi"
    });


    // } catch (e) {
    //   setState({
    //     ...state,
    //     loading: false,
    //     alertStatus: false,
    //     alertMessage: "Probl??me lors de l'enrichissement"
    //   });
    // }

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
        property.property_definition ? str(`${property.property_definition}`) : str(`${property.property_name}`),
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

    const ifcOwnerHistory = await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      modelId,
      IFCOWNERHISTORY,
      false
    );
    console.log('ifcOwnerHistory', ifcOwnerHistory)
    const eidIfcOwnerHistory = (ifcOwnerHistory && ifcOwnerHistory.length > 0) ? ifcOwnerHistory[0] : 1;

    console.log('propertiesEids', propertiesEids)
    const psetEid = propertiesEids[propertiesEids.length - 1].value + 1;
    let ifcPropertySet = new WebIFC.IfcPropertySet(
      psetEid,
      IFCPROPERTYSET,
      str(Math.random().toString(16).substr(2, 8)),
      ref(eidIfcOwnerHistory),
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
      ref(eidIfcOwnerHistory),
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
        editIfcModel({
          viewer,
          modelId,
          expressIDs,
          properties
        })
      } else {
        editIfcModel({
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


  const handleCheckNetworkStatus = () => {
    function changeStatus() {
      console.log('navigator.onLine', navigator.onLine)
      setState({
        ...state,
        alertStatus: navigator.onLine,
        alertMessage: navigator.onLine ? 'Connect??' : 'Non connect??'
      });
    }
    window.addEventListener("online", changeStatus);
    window.addEventListener("offline", changeStatus);
    return () => {
      window.removeEventListener("online", changeStatus);
      window.removeEventListener("offline", changeStatus);
    };
  }

  const handleModelValidation = async () => {
    try {
      const ifcData = await state.viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
      const blobIfc = new Blob([ifcData], { type: 'text/plain' });
      const ifcFile = new File([blobIfc], 'ifcFile.png');


      const formData = new FormData();
      formData.append('files', ifcFile);


      // const analysis = await axios.post(process.env.REACT_APP_API_URL, formData);
      // console.log('projectId', analysis.data)
      // const { projectId } = analysis.data;

      // const logs = await axios.get(`${process.env.REACT_APP_API_URL}/log/${projectId}.json`);
      // console.log('logs', logs.data);

      // const jsonData = await JSON.parse(logs.data);
      // console.log('jsonData', jsonData["level"]);
      axios.post(process.env.REACT_APP_API_URL, formData).then((value) => {
        console.log('value.data', value.data)
        return value.data;
      })
        .then(async ({ projectId }) => {
          const logs = await axios.get(`${process.env.REACT_APP_API_URL}/log/${projectId}.json`)
          console.log('logs', logs)
        }).catch((error) => {
          console.log('ERRORRR', error)
        })

      // res.status(200).send(response.data);
    } catch (err) {
      // return res.status(500).json({ error: err });
    }
  }

  const handleInitSubset = async (viewer, modelID) => {
    const models = viewer.context.items.ifcModels;
    const ifcModel = models[modelID];
    const allIDs = Array.from(
      new Set(ifcModel.geometry.attributes.expressID.array)
    );
    const subset = getWholeSubset(viewer, ifcModel, allIDs);
    replaceOriginalModelBySubset(viewer, ifcModel, subset);
  }

  function getWholeSubset(viewer, ifcModel, allIDs) {
    return viewer.IFC.loader.ifcManager.createSubset({
      modelID: ifcModel.modelID,
      ids: allIDs,
      applyBVH: true,
      scene: ifcModel.parent,
      removePrevious: true,
      customID: 'full-model-subset',
    });
  }

  function replaceOriginalModelBySubset(viewer, ifcModel, subset) {
    const items = viewer.context.items;

    items.pickableIfcModels = items.pickableIfcModels.filter(model => model !== ifcModel);
    items.ifcModels = items.ifcModels.filter(model => model !== ifcModel);
    ifcModel.removeFromParent();

    items.ifcModels.push(subset);
    items.pickableIfcModels.push(subset);
  }

  function showAllItems(viewer, ids) {
    viewer.IFC.loader.ifcManager.createSubset({
      modelID: 0,
      ids,
      removePrevious: false,
      applyBVH: true,
      customID: 'full-model-subset',
    });
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
    editIfcModel,
    handleCheckNetworkStatus,
    handleGetJsonData,
    handleModelValidation,
    handleInitSubset
  }
};

export {
  UseIfcRenderer
};