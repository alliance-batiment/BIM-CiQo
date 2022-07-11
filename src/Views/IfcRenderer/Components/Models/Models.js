// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useMemo,
//   useCallback,
// } from "react";
// import { makeStyles, Fab, Button } from "@material-ui/core";
// import { useDropzone } from "react-dropzone";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   Avatar,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableContainer,
//   TableRow,
//   List,
//   Paper,
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
//   Popover,
//   Grid,
//   LinearProgress,
//   Box,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import ClearIcon from "@mui/icons-material/Clear";
// import FactCheckIcon from "@mui/icons-material/FactCheck";
// import DownloadIcon from "@mui/icons-material/Download";
// import FullscreenIcon from "@mui/icons-material/Fullscreen";
// import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
// // import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
// import axios from "axios";
// import Dexie from "dexie";

// const useStyles = makeStyles((theme) => ({
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     fontWeight: theme.typography.fontWeightRegular,
//   },
//   table: {
//     width: "100%",
//   },
//   cardExpanded: {
//     position: "absolute",
//     top: "0px",
//     zIndex: 1000,
//     left: "0px",
//     right: "0px",
//     opacity: "0.95",
//     width: ({ width }) => width,
//     height: ({ height }) => height,
//     maxWidth: window.innerWidth - 175,
//     maxHeight: window.innerHeight - 175,
//   },
//   card: {
//     position: "absolute",
//     top: "0px",
//     zIndex: 100,
//     left: "0px",
//     right: "0px",
//     opacity: "0.95",
//     width: ({ width }) => width,
//     height: ({ height }) => height,
//     maxWidth: window.innerWidth - 175,
//     maxHeight: window.innerHeight - 175,
//   },
//   cardContent: {
//     opacity: "0.95",
//     height: "85%",
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
//     backgroundColor: "transparent",
//     width: theme.spacing(7),
//     height: theme.spacing(7),
//     // padding: '5px',
//     borderRadius: "0px",
//   },
//   fab: {
//     backgroundColor: "white",
//   },
//   button: {
//     color: "white",
//     backgroundColor: "black",
//     width: "100%",
//     marginTop: "1em",
//     marginBottom: "1em",
//   },
//   linearProgress: {
//     width: "90%",
//     margin: "1em",
//     left: 0,
//     right: 0,
//     //position: 'absolute',
//     // top: '25%',
//     // transform: 'translateY(-25%)'
//   },
// }));

// const baseStyle = {
//   flex: 1,
//   display: "flex",
//   height: "150px",
//   flexDirection: "column",
//   alignItems: "center",
//   padding: "20px",
//   borderWidth: 2,
//   borderRadius: 2,
//   width: "100%",
//   borderColor: "#ddddd",
//   borderStyle: "dashed",
//   backgroundColor: "#fafafa",
//   color: "#bdbdbd",
//   outline: "none",
//   transition: "border .24s ease-in-out",
//   cursor: "pointer",
// };

// const Models = () => {
//   //set the database 
//   const db = new Dexie("tribimDB");
//   //create the database store
//   db.version(1).stores({
//     models: "title, content, file"
//   })
//   db.open().catch((err) => {
//     console.log(err.stack || err)
//   });

//   const style = useMemo(
//     () => ({
//       ...baseStyle,
//     }),
//     []
//   );


//   //set the state and property
//   const [modelTitle, setModelTitle] = useState("");
//   const [modelContent, setModelContent] = useState("");
//   const [modelFile, setModelFile] = useState("");
//   const [models, setModels] = useState("");

//   //read the file and decode it
//   const getFile = (e) => {
//     console.log(e)

//     let reader = new FileReader();
//     reader.readAsDataURL(e[0]);
//     reader.onload = (e) => {
//       setModelFile(reader.result);
//     }
//   }

//   const deleteModel = async (id) => {
//     console.log(id);
//     db.models.delete(id);
//     let allModels = await db.models.toArray();
//     //set the models
//     setModels(allModels);
//   }

//   //submit 
//   const getModelInfo = (e) => {
//     e.preventDefault();
//     if (modelTitle !== "" && modelContent !== "" && modelFile !== "") {
//       let model = {
//         title: modelTitle,
//         content: modelContent,
//         file: modelFile
//       }
//       db.models.add(model).then(async () => {
//         //retrieve all models inside the database
//         let allModels = await db.models.toArray();
//         //set the models
//         setModels(allModels);
//       });
//     }
//   }

//   const showModel = (model) => {
//     console.log(model)
//   }

//   useEffect(() => {
//     //get all models from the database
//     const getModels = async () => {
//       let allModels = await db.models.toArray();
//       setModels(allModels);
//     }
//     getModels();
//   }, []);

//   let modelData;

//   if (models.length > 0) {
//     modelData = <div className="modelsContainer">
//       {
//         models.map(model => {
//           return <div className="model" key={model.title}>
//             {/* <div style={{ backgroundImage: "url(" + model.file + ")" }} /> */}
//             <h2>{model.title}</h2>
//             <p>{model.content}</p>
//             <button className="delete" onClick={() => deleteModel(model.title)}>Delete</button>
//             <button className="show" onClick={() => showModel(model)}>show</button>
//           </div>
//         })
//       }
//     </div>
//   } else {
//     modelData = <div className="message">
//       <p>There are no models to show</p>
//     </div>
//   }

//   return (
//     <React.Fragment>
//       <form onSubmit={getModelInfo}>
//         <div className="control">
//           <label>Title</label>
//           <input type="text" name="title" onChange={e => setModelTitle(e.target.value)} />
//         </div>
//         <div className="control">
//           <label>Content</label>
//           <textarea name="content" onChange={e => setModelContent(e.target.value)} />
//         </div>
//         <div className="control">
//           <label htmlFor="cover" className="cover">Choose a file</label>
//           <input type="file" id="cover" name="file" onChange={e => getFile(e.target.files)} />
//         </div>

//         <input type="submit" value="Submit" />
//       </form>

//       {modelData}

//     </React.Fragment>
//     Card className = { expandedView? classes.cardExpanded : classes.card } >
//     <CardHeader
//       avatar={
//         <Avatar aria-label="recipe" className={classes.avatar}>
//           <Fab size="small" className={classes.fab}>
//             <FactCheckIcon />
//           </Fab>
//         </Avatar>
//       }
//       title={`Validation`}
//       subheader={`Système de validation d'un fichier IFC`}
//       action={
//         <div>
//           <IconButton
//             aria-label="settings"
//             aria-describedby={id}
//             onClick={handleExpandView}
//             size="small"
//           >
//             {expandedView ? <FullscreenExitIcon /> : <FullscreenIcon />}
//           </IconButton>
//           <IconButton
//             aria-label="settings"
//             aria-describedby={id}
//             onClick={() => setShowValidation(false)}
//             size="small"
//           >
//             <ClearIcon />
//           </IconButton>
//           <IconButton
//             aria-label="settings"
//             aria-describedby={id}
//             onClick={handleClick}
//             size="small"
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
//             {logs.length > 0 && (
//               <ListItem button onClick={handleExportToCsv}>
//                 <ListItemIcon>
//                   <DownloadIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Télécharger CSV" />
//               </ListItem>
//             )}
//             <ListItem button onClick={() => setShowValidation(false)}>
//               <ListItemIcon>
//                 <ClearIcon />
//               </ListItemIcon>
//               <ListItemText primary="Fermer" />
//             </ListItem>
//           </Popover>
//         </div>
//       }
//     />
//     <CardContent className={classes.cardContent}>
//       <Grid item xs={12} align="center" justify="center" alignItems="center">
//         <div {...getRootProps({ style })}>
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p>
//               Importer votre fichier ici ou cliquez pour selectionner un
//               fichier
//             </p>
//           ) : (
//             <p>
//               Importer votre fichier ici ou cliquez pour selectionner un
//               fichier
//             </p>
//           )}
//         </div>
//       </Grid>

//       {progress >= 0 && progress < 100 ? (
//         <Grid
//           item
//           xs={12}
//           align="center"
//           justify="center"
//           alignItems="center"
//         >
//           <LinearProgressWithLabel value={progress} />
//         </Grid>
//       ) : (
//         <>

//       <Grid item xs={12}>
//         {logs.length > 0 && (
//           <TableContainer component={Paper}>
//             <Table className={classes.table} aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Severity</TableCell>
//                   <TableCell align="left">Message</TableCell>
//                   <TableCell align="left">Instance</TableCell>
//                   <TableCell align="left">time</TableCell>
//                 </TableRow>
//               </TableHead>
//               {logs.map((log, i) => (
//                 <TableRow
//                   key={i}
//                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                 >
//                   <TableCell
//                     style={{
//                       color: `${log.level === "Error" ? "red" : "orange"}`,
//                     }}
//                   >
//                     {log.level}
//                   </TableCell>
//                   <TableCell>{log.message}</TableCell>
//                   <TableCell>{log.instance}</TableCell>
//                   <TableCell>{log.time}</TableCell>
//                 </TableRow>
//               ))}
//             </Table>
//           </TableContainer>
//         )}
//       </Grid>
//     </CardContent>
//   </Card>
//   );

// }

// export default Models;