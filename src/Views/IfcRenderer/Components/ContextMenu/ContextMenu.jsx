import { useEffect, useCallback, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DescriptionIcon from '@material-ui/icons/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import Cloud from '@mui/icons-material/Cloud';
import useContextMenu from "./ContextMenu.hooks";
import OpenDthxLogo from './img/OpenDthxLogo.png';
import {
  MeshLambertMaterial,
  MeshBasicMaterial,
  DoubleSide,
  MeshPhysicalMaterial,
  Mesh
} from 'three';
import { VisibilityManager } from 'web-ifc-viewer/dist/components/ifc/visibility-manager';

const ContextMenu = ({
  viewer,
  showContextMenu,
  meshMaterials,
  setShowContextMenu,
  setShowProperties,
  setShowSpatialStructure,
  handleShowMarketplace,
  eids,
  setEids,
  subsets,
  setSubsets
}) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showAllModel, setShowAllModel] = useState(true);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  const handleContextMenu = (event) => {
    console.log('eids', eids);
    if (eids.length > 0) {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShowContextMenu(true);
    }
  };

  const handleShowProperties = async () => {
    if (eids.length > 0) {
      setShowProperties(true);
      setShowContextMenu(false);
    }
  }

  const handleGetAllItemsOfType = async () => {
    if (eids.length > 0) {
      const element = await viewer.IFC.getProperties(0, eids[0], false, false);
      const elementsByType = await viewer.getAllItemsOfType(0, element.type, false, false);
      const newEids = [...eids, ...elementsByType];
      setEids(newEids);
      await viewer.IFC.pickIfcItemsByID(0, newEids);
      setShowContextMenu(false);
    }
  }

  const handleAddProperties = async () => {
    handleShowMarketplace('Open dthX');
    setShowContextMenu(false);
  }

  const handleShowModel = async () => {
    const models = viewer.context.items.ifcModels;
    const pickableModels = viewer.context.items.pickableIfcModels;

    const ifcModel = models[0];
    const scene = ifcModel.parent;
    const ids = Array.from(
      new Set(ifcModel.geometry.attributes.expressID.array)
    )

    let subset = viewer.IFC.loader.ifcManager.createSubset({
      modelID: ifcModel.modelID,
      ids: ids,
      scene,//viewer.IFC.context.getScene(),
      applyBH: true,
      removePrevious: false,
      customID: 'SHOW'
    });



    let index = pickableModels.indexOf(ifcModel);
    if (index >= 0) pickableModels.splice(index);
    index = models.indexOf(ifcModel);
    if (index >= 0) models.splice(index);

    // scene.remove(ifcModel);
    models.push(subset);
    pickableModels.push(subset);

    // let hideItems = viewer.IFC.loader.ifcManager.removeFromSubset(
    //   ifcModel.modelID,
    //   idsHidden,
    //   'HIDE'
    // );

    // showFill(ifcModel.modelID, ids)

    setSubsets([...subsets, subset]);
    setShowAllModel(true);
  }






  const showFill = (modelID, ids, rootItemType) => {
    const fill = viewer.filler.fills[`${modelID}`];
    if (fill === null || fill === undefined) {
      return;
    }
    if (rootItemType === 'IFCPROJECT' || rootItemType === 'IFCBUILDING' || rootItemType === 'IFCSITE') {
      fill.visible = true;
    }
    viewer.IFC.loader.ifcManager.createSubset({
      modelID,
      ids,
      customID: `${modelID}`,
      material: fill.material,
      applyBVH: true,
      removePrevious: false,
    });

  }

  const hideFill = async (modelID, ids) => {
    const fill = viewer.filler.fills[`${modelID}`];
    if (fill === null || fill === undefined) {
      return;
    }

    const name = `${modelID}`;
    const ifcManager = viewer.IFC.loader.ifcManager;
    await ifcManager.removeFromSubset(modelID, ids, name, fill.material);
  }

  const handleHideElement = async () => {
    const models = viewer.context.items.ifcModels;
    const pickableModels = viewer.context.items.pickableIfcModels;

    const ifcModel = models[0];
    const scene = ifcModel.parent;
    const ids = Array.from(
      new Set(ifcModel.geometry.attributes.expressID.array)
    )

    const idsHidden = [...eids];

    const type = 'invisibleMaterial';

    let subset = viewer.IFC.loader.ifcManager.createSubset({
      modelID: ifcModel.modelID,
      ids: ids,
      // material: meshMaterials[type],
      scene,//viewer.IFC.context.getScene(),
      applyBH: true,
      removePrevious: true,
      customID: 'HIDE'
    });

    let index = pickableModels.indexOf(ifcModel);
    if (index >= 0) pickableModels.splice(index);
    index = models.indexOf(ifcModel);
    if (index >= 0) models.splice(index);

    scene.remove(ifcModel);
    models.push(subset);
    pickableModels.push(subset);

    let hideItems = viewer.IFC.loader.ifcManager.removeFromSubset(
      ifcModel.modelID,
      idsHidden,
      'HIDE'
    );

    // hideFill(ifcModel.modelID, idsHidden)

    // setSubsets([...subsets, { type, material: meshMaterials[type] }]);
    setSubsets([...subsets, subset]);
    setShowAllModel(false);
  }

  const handleIsolateElement = async () => {

    const models = viewer.context.items.ifcModels;
    const pickableModels = viewer.context.items.pickableIfcModels;

    const ifcModel = models[0];
    const scene = ifcModel.parent;
    const ids = Array.from(
      new Set(ifcModel.geometry.attributes.expressID.array)
    )

    const idsHidden = ids.reduce(function (acc, id) {
      if (eids.indexOf(id) === -1) {
        acc.push(id);
      }
      return acc;
    }, []);

    const type = 'invisibleMaterial';


    let subset = viewer.IFC.loader.ifcManager.createSubset({
      modelID: ifcModel.modelID,
      ids,
      // material: meshMaterials[type],
      scene,//viewer.IFC.context.getScene(),
      applyBH: true,
      removePrevious: true,
      customID: 'HIDE'
    });

    let index = pickableModels.indexOf(ifcModel);
    if (index >= 0) pickableModels.splice(index);
    index = models.indexOf(ifcModel);
    if (index >= 0) models.splice(index);

    scene.remove(ifcModel);
    models.push(subset);
    pickableModels.push(subset);

    let hideItems = viewer.IFC.loader.ifcManager.removeFromSubset(
      ifcModel.modelID,
      idsHidden,
      'HIDE'
    );

    // hideFill(ifcModel.modelID, idsHidden)

    setSubsets([...subsets, subset]);
    setShowAllModel(false);
  }

  // const handleIsolateElement = async () => {
  //   const visibilityManager = new VisibilityManager(viewer.IFC.loader, viewer.context);
  //   const invisibleMaterial = visibilityManager.invisibleMaterial;
  //   const modelID = 0;
  //   visibilityManager.createIsolationSubset(modelID, eids, true);
  //   const models = viewer.context.items.ifcModels;
  //   visibilityManager.makeIsolatedSubsetPickable(models[modelID]);
  //   visibilityManager.changeModelMaterial(modelID, invisibleMaterial);
  //   visibilityManager.makeModelNotPickable(modelID);

  //   // viewer.IFC.loader.ifcManager.createSubset({
  //   //   modelID: 0,
  //   //   ids: ids,
  //   //   material: preselectMat,
  //   //   scene: viewer.IFC.context.scene.scene,
  //   //   removePrevious: true
  //   // })
  // }

  return (
    showContextMenu &&
    <Paper sx={{ width: 250, maxWidth: '100%', top: anchorPoint.y, left: anchorPoint.x, position: 'absolute' }}>
      <MenuList>
        <MenuItem
          onClick={handleGetAllItemsOfType}
        >
          <ListItemIcon>
            <LibraryAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sélection par Classe</ListItemText>
        </MenuItem>
        {showAllModel ?
          <>
            <MenuItem
              onClick={handleIsolateElement}
            >
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Isoler</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleHideElement}
            >
              <ListItemIcon>
                <VisibilityOffIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cache</ListItemText>
            </MenuItem>
          </>
          :
          <MenuItem
            onClick={handleShowModel}
          >
            <ListItemIcon>
              <ViewInArIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rétablir Modèle</ListItemText>
          </MenuItem>
        }
        {/* <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Créer une tâche</ListItemText>
        </MenuItem> */}
        <Divider />
        <MenuItem
          onClick={handleShowProperties}
        >
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Propriétés</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleAddProperties}
        >
          <ListItemIcon>
            <Avatar
              aria-label="recipe"
              src={OpenDthxLogo}
              style={{ width: '1em', height: 'auto' }}
            // alt={application.name}
            // title={application.name}
            />
          </ListItemIcon>
          <ListItemText>Ajout Propriétés</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );

};

export default ContextMenu;