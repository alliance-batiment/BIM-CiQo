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
import Cloud from '@mui/icons-material/Cloud';
import useContextMenu from "./ContextMenu.hooks";
import OpenDthxLogo from './img/OpenDthxLogo.png';

const ContextMenu = ({
  viewer,
  showContextMenu,
  setShowContextMenu,
  setShowProperties,
  setShowSpatialStructure,
  handleShowMarketplace,
  eids,
  setEids,
}) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

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
        {/* <MenuItem>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Isoler</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cache</ListItemText>
        </MenuItem>
        <MenuItem>
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