// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   makeStyles,
//   Fab
// } from "@material-ui/core";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   Avatar,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   Badge,
//   ListItemText,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Popover
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ClearIcon from '@mui/icons-material/Clear';
// import ControlCameraIcon from '@mui/icons-material/ControlCamera';
// import { FirstPersonControl } from 'web-ifc-viewer/dist/components/context/camera/FirstPersonControl';
// // import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// const useStyles = makeStyles((theme) => ({
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     fontWeight: theme.typography.fontWeightRegular,
//   },
//   table: {
//     width: "100%",
//   },
//   cardInfo: {
//     zIndex: 100,
//     width: "100%",
//     height: "100%",
//   },
//   cardContent: {
//     height: "90%",
//     overflowY: "auto",
//     overflowX: "hidden",
//     "&::-webkit-scrollbar": {
//       width: "0.4em",
//     },
//     "&::-webkit-scrollbar-track": {
//       "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
//     },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: "rgba(0,0,0,.1)",
//       outline: "0px solid slategrey",
//     },
//   },
//   avatar: {
//     backgroundColor: 'transparent',
//     width: theme.spacing(7),
//     height: theme.spacing(7),
//     // padding: '5px',
//     borderRadius: '0px'
//   },
//   fab: {
//     backgroundColor: 'white'
//   }
// }));

// const cameraType = [{
//   value: 'OrbitControl',
//   label: 'Vue 3D',
//   icon: "view_in_ar",
//   mode: 0
// }, {
//   value: 'FirstPersonControl',
//   label: 'Vue à la première personne',
//   icon: "directions_walk",
//   mode: 1
// }, {
//   value: 'PlanControl',
//   label: 'Vue en plan',
//   icon: "highlight_alt",
//   mode: 2
// }]


// const Camera = ({
//   viewer,
//   showCamera,
//   setShowCamera
// }) => {
//   const classes = useStyles();
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleCamera = (mode) => {
//     console.log('viewer', viewer)
//     const ifcCamera = viewer.IFC.context.getIfcCamera();
//     // const camera = viewer.IFC.context.ifcCamera.activeCamera;
//     const scene = viewer.IFC.context.scene.scene;
//     const renderer = viewer.IFC.context.renderer.renderer;
//     const camera = viewer.IFC.context.ifcCamera.activeCamera;
//     console.log('mode', mode)
//     console.log('ifcCamera', ifcCamera)
//     // ifcCamera.setNavigationMode(mode);
//     if (mode === 1) {
//       // const firstPersonControl = new FirstPersonControl(viewer.IFC.context, camera, ifcCamera);
//       // firstPersonControl.toggle(true);
//       // const firstPersonControl = new FirstPersonControls(camera, renderer);
//       // scene.add(firstPersonControl)
//       console.log('HELLO');
//       // window.addEventListener("keydown", this.down.bind(this));
//       // window.addEventListener("keyup", this.up.bind(this));
//       // window.addEventListener("keyright", this.right.bind(this));
//       // window.addEventListener("keyleft", this.left.bind(this));
//     }
//   }

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;
//   return (
//     <Card className={classes.cardInfo}>
//       <CardHeader
//         avatar={
//           <Avatar aria-label="recipe" className={classes.avatar}>
//             <Fab
//               size="small"
//               className={classes.fab}
//             >
//               <ControlCameraIcon />
//             </Fab>
//           </Avatar>
//         }
//         title={`Projection`}
//         subheader={`Sélection du type de camera`}
//         action={<div>
//           <IconButton
//             aria-label="settings"
//             aria-describedby={id}
//             onClick={handleClick}
//           >
//             <MoreVertIcon />
//           </IconButton>
//           <Popover
//             id={id}
//             open={open}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "center",
//             }}
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "center",
//             }}
//           >
//             <ListItem button onClick={() => setShowCamera(false)}>
//               <ListItemIcon>
//                 <ClearIcon />
//               </ListItemIcon>
//               <ListItemText primary="Fermer" />
//             </ListItem>
//           </Popover>
//         </div>}
//       />
//       <CardContent>
//         <FormControl>
//           <RadioGroup
//             aria-labelledby="demo-radio-buttons-group-label"
//             defaultValue='OrbitControl'
//             name="radio-buttons-group"
//           >
//             {/* <List sx={{ width: "100%" }}> */}
//             {cameraType.map((camera, index) => (
//               <FormControlLabel
//                 onClick={() => handleCamera(camera.mode)}
//                 value={camera.value}
//                 control={<Radio />}
//                 labelPlacement="end"
//                 label={
//                   <ListItem>
//                     <ListItemButton
//                       role={undefined}
//                       dense
//                     // onClick={() => handleShowElement(ifcClass.eids)}
//                     >
//                       <ListItemIcon>
//                         <span className='material-icons'>{`${camera.icon}`}</span>
//                       </ListItemIcon>
//                       <ListItemText
//                         id={`checkbox-list-label-${index}`}
//                         primary={`${camera.label}`}
//                       // secondary={secondary ? 'Secondary text' : null}
//                       />
//                     </ListItemButton>
//                   </ListItem>
//                 }
//               />
//             ))}
//           </RadioGroup>
//         </FormControl>
//       </CardContent>
//     </Card>
//   )
// };

// export default Camera;