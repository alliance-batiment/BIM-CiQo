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
      progress({
        loading: true,
        message: `Recherche: ${Math.round(count / spatialStructure.length * 100)} %`
      });
      count++;
      const props = await viewer.IFC.getProperties(0, item.expressID, false, false);
      // console.log('props', props)

      data.push({
        ...item,
        ...props,
        type: item.type
      })
    }
    return data;
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

  // function DecodeIFCString(ifcString) {
  //   const ifcUnicodeRegEx = /\\X2\\(.*?)\\X0\\/giu;
  //   let resultString = ifcString;
  //   let match = ifcUnicodeRegEx.exec(ifcString);
  //   while (match) {
  //     const unicodeChar = String.fromCharCode(parseInt(match[1], 16));
  //     resultString = resultString.replace(match[0], unicodeChar);
  //     match = ifcUnicodeRegEx.exec(ifcString);
  //   }
  //   return resultString;
  // }


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



  const opendthxUpdateProperties = async ({
    bimData,
    setBimData,
    viewer,
    // modelId,
    expressIDs,
    properties
  }) => {
    setState({
      ...state,
      loading: true,
      loadingMessage: "Début de l'enrichissement...",
      alertStatus: true,
      alertMessage: "Connecté"
    });
    console.log('bimBata', bimData)
    const modelId = 0;
    const model = bimData.models.list[modelId];
    const database = bimData.models.data[modelId];
    const manager = await viewer.IFC.loader.ifcManager;
    const allLines = await manager.ifcAPI.GetAllLines(modelId);
    let maxExpressId = 0;
    await Object.keys(allLines._data).forEach(index => {
      maxExpressId = Math.max(maxExpressId, allLines._data[index])
    });

    const elementsList = await expressIDs.map(expressID => {
      return ref(expressID);
    });

    const ifcOwnerHistory = await manager.getAllItemsOfType(
      modelId,
      IFCOWNERHISTORY,
      false
    );
    const eidIfcOwnerHistory = (ifcOwnerHistory && ifcOwnerHistory.length > 0) ? ifcOwnerHistory[0] : 1;
    // const newPsetOpendthXEids = [];
    // const newPsetIFCEids = [];
    // const rawLineIfcRelDefinesByPropertiesList = [];
    // let propertySingleValueExpressId = maxExpressId + 1;

    let count = 0;
    const PsetSearch = 'Pset_opendthx';

    // SUPPRESSION DES ELEMENTS DE LA LISTE AYANT DEJA UN PSET OPENDTHX
    const relPsetIDs = await manager.getAllItemsOfType(0, IFCRELDEFINESBYPROPERTIES, false);
    console.log('relPsetIDs', relPsetIDs)
    console.log('relPsetIDs.length', relPsetIDs.length)
    const t0 = new Date();
    for (let relPsetID of relPsetIDs) {
      // setState({
      //   ...state,
      //   loading: true,
      //   loadingMessage: `Enrichissement: ${Math.round(count / relPsetIDs.length * 100)} %`
      // });
      count++;
      // console.log('relPsetID', relPsetID)
      const relPset = database[parseInt(relPsetID)];
      // console.log('relPset', relPset)
      // const relPset = await manager.getItemProperties(0, relPsetID);
      const relPsetRelatingPropertyDefinition = relPset?.RelatingPropertyDefinition;

      if (relPsetRelatingPropertyDefinition) {
        if (database[parseInt(relPsetRelatingPropertyDefinition)].Name === PsetSearch) {
          const relPsetRelatedObjects = [...relPset.RelatedObjects];
          let checkExpressID = false;
          for (let expressID of expressIDs) {
            const relPsetRelatedObjectIndex = relPsetRelatedObjects.findIndex(relPsetRelatedObject => relPsetRelatedObject === expressID);
            if (relPsetRelatedObjectIndex > -1) {
              checkExpressID = true;
              relPsetRelatedObjects.splice(relPsetRelatedObjectIndex, 1);
            }
          }
          if (checkExpressID) {
            const newRelPset = await manager.getItemProperties(0, relPsetID);
            newRelPset.RelatedObjects = relPsetRelatedObjects.map((relPsetRelatedObject) => {
              return ref(relPsetRelatedObject);
            });
            await manager.ifcAPI.WriteLine(0, newRelPset);
          }
        }
      }
    }
    const t1 = new Date();
    let difference = t1.getTime() - t0.getTime();
    let psetID;
    console.log(`time spent step 1: ${difference / 1000}s`)

    if (properties.length > 0) {
      console.log('maxExpressId', maxExpressId)
      let ifcPropertySingleValueEid = maxExpressId + 1;
      console.log('ifcPropertySingleValueEid', ifcPropertySingleValueEid)
      const newPsetOpendthXEids = [];
      for (let property of properties) {
        const eid = ifcPropertySingleValueEid++;
        const rawLineIfcPropertySingleValue = await addOrEditIfcPropertySingleValue({
          expressID: eid,
          type: IFCPROPERTYSINGLEVALUE,
          name: DecodeIFCString(property.ifc_property_name),
          description: DecodeIFCString(property.property_definition),
          value: property.text_value,
          unit: property.unit,
          property
        });
        await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySingleValue);
        newPsetOpendthXEids.push(ref(eid));
      }
      console.log('newPsetOpendthXEids', newPsetOpendthXEids)
      if (newPsetOpendthXEids.length > 0) {
        const ifcPropertySetEid = ifcPropertySingleValueEid + 1;
        psetID = ifcPropertySetEid;
        const rawLineIfcPropertySet = await addOrEditIfcPropertySet({
          expressID: ifcPropertySetEid,
          type: IFCPROPERTYSET,
          globalId: str(Math.random().toString(16).substr(2, 8)),
          ifcOwnerHistoryExpressID: ref(eidIfcOwnerHistory),
          name: str('Pset_opendthx'),
          ifcPropertySingleValueExpressIDs: newPsetOpendthXEids
        });
        await viewer.IFC.loader.ifcManager.state.api.WriteRawLineData(modelId, rawLineIfcPropertySet);
        const ifcRelDefinesByPropertiesEid = ifcPropertySetEid + 1;
        console.log('ifcPropertySetEid', ifcPropertySetEid)
        console.log('ifcRelDefinesByPropertiesEid', ifcRelDefinesByPropertiesEid)
        const rawLineIfcRelDefinesByProperties = await addOrEditIfcRelDefinesByProperties({
          expressID: ifcRelDefinesByPropertiesEid,
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
    }

    const newProperties = await viewer.IFC.properties.serializeAllProperties(model, undefined, (current, total) => {
      const progress = current / total;
      const formatted = Math.trunc(progress * 100);
      setState({
        ...state,
        loading: true,
        loadingMessage: `Chargement des données: ${formatted} %`
      });
    });
    const file = new File(newProperties, 'properties');
    const data = JSON.parse(await file.text());

    const t2 = new Date();
    difference = t2.getTime() - t1.getTime();
    console.log(`time spent step 2: ${difference / 1000}s`)

    setState({
      ...state,
      models: {
        ...state.models,
        data: [data]
      },
      loading: false,
      alertStatus: true,
      alertMessage: "Enrichissement réussi"
    });

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
      loadingMessage: "Début de l'enrichissement...",
      alertStatus: true,
      alertMessage: "Connecté"
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
          const element = await viewer.IFC.getProperties(0, expressID, false, false);
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
      //     alertMessage: "Problème lors de l'enrichissement"
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
      alertMessage: "Enrichissement réussi"
    });


    // } catch (e) {
    //   setState({
    //     ...state,
    //     loading: false,
    //     alertStatus: false,
    //     alertMessage: "Problème lors de l'enrichissement"
    //   });
    // }

  }

  const addElementsNewProperties = async ({
    bimData,
    setBimData,
    viewer,
    modelID,
    expressIDs,
    properties
  }) => {
    const modelId = modelID ? modelID : 0;
    console.log('ADD PROPERTY')
    if (expressIDs && expressIDs.length > 0) {
      if (properties.length > 0) {
        opendthxUpdateProperties({
          bimData,
          setBimData,
          viewer,
          modelId,
          expressIDs,
          properties
        })
      }
    }
  }

  const handleCheckNetworkStatus = () => {
    function changeStatus() {
      console.log('navigator.onLine', navigator.onLine)
      setState({
        ...state,
        alertStatus: navigator.onLine,
        alertMessage: navigator.onLine ? 'Connecté' : 'Non connecté'
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


  return {
    models,
    meshMaterials,
    initIndexDB,
    getModels,
    addTransformControls,
    getElementProperties,
    addElementsNewProperties,
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