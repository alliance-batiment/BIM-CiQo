import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { makeStyles, Fab, Button } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  List,
  Paper,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Badge,
  ListItemText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Popover,
  Grid,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DownloadIcon from "@mui/icons-material/Download";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {
    width: "100%",
  },
  cardExpanded: {
    position: "absolute",
    top: "0px",
    zIndex: 1000,
    left: "0px",
    right: "0px",
    opacity: "0.95",
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175,
  },
  card: {
    position: "absolute",
    top: "0px",
    zIndex: 100,
    left: "0px",
    right: "0px",
    opacity: "0.95",
    width: ({ width }) => width,
    height: ({ height }) => height,
    maxWidth: window.innerWidth - 175,
    maxHeight: window.innerHeight - 175,
  },
  cardContent: {
    opacity: "0.95",
    height: "90%",
    overflowY: "auto",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "0px solid slategrey",
    },
  },
  avatar: {
    backgroundColor: "transparent",
    width: theme.spacing(7),
    height: theme.spacing(7),
    // padding: '5px',
    borderRadius: "0px",
  },
  fab: {
    backgroundColor: "white",
  },
  button: {
    color: "white",
    backgroundColor: "black",
    width: "100%",
    marginTop: "1em",
    marginBottom: "1em",
  },
  linearProgress: {
    width: "90%",
    margin: "1em",
    left: 0,
    right: 0,
    //position: 'absolute',
    // top: '25%',
    // transform: 'translateY(-25%)'
  },
}));

const baseStyle = {
  flex: 1,
  display: "flex",
  height: "150px",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  width: "100%",
  borderColor: "#ddddd",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const Validation = ({
  bimData,
  setBimData,
  showValidation,
  setShowValidation,
}) => {
  const style = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [logs, setLogs] = useState([]);
  const [bimModel, setBimModel] = useState(null);
  const [progress, setProgress] = useState(-1);
  const [expandedView, setExpandedView] = useState(false);
  const [viewWidth, setViewWidth] = useState("100%");
  const [viewHeight, setViewHeight] = useState("100%");

  useEffect(() => {
    const init = async () => {
      const models = await bimData.viewer.context.items.ifcModels;
      if (models.length > 0) {
        setBimModel(models[0]);
      }
    };
    init();
  }, [bimModel]);

  const props = {
    width: viewWidth,
    height: viewHeight,
  };

  const classes = useStyles(props);

  useEffect(() => {
    const getWidth = () => window.innerWidth - 175;
    const getHeight = () => window.innerHeight - 175;
    const resizeListener = () => {
      if (!expandedView) {
        setViewWidth(getWidth());
        setViewHeight(getHeight());
      }
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const handleExpandView = (e) => {
    const width = window.innerWidth - 175;
    const height = window.innerHeight - 175;

    if (!expandedView) {
      setExpandedView(true);
      setViewWidth(width);
      setViewHeight(height);
      setAnchorEl(null);
    } else if (expandedView) {
      setExpandedView(false);
      setViewWidth("100%");
      setViewHeight("100%");
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    // if (progress === 100) {
    //   window.parent.postMessage({ projectId: projectId }, `${process.env.REACT_APP_TRIDYME}`);
    // }
  }, [progress]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let timeoutIdentifier;

  const handleModelValidation = async () => {
    try {
      setProgress(0);
      const ifcData =
        await bimData.viewer.IFC.loader.ifcManager.state.api.ExportFileAsIFC(0);
      const blobIfc = new Blob([ifcData], { type: "text/plain" });
      const ifcFile = new File([blobIfc], "ifcFile.png");

      const formData = new FormData();
      formData.append("files", ifcFile);

      const analysis = await axios.post(
        process.env.REACT_APP_API_URL,
        formData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
      const { projectId } = analysis.data;
      console.log("projectId", projectId);
      function poll() {
        axios
          .get(`${process.env.REACT_APP_API_URL}/pp/${projectId}`, {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          })
          .then((r) => {
            const progressLoading = r.data.progress;
            if (progressLoading === 100) {
              clearTimeout(timeoutIdentifier);
              setProgress(progressLoading);
              // axios.get(`${process.env.REACT_APP_API_URL}/v/${projectId}`).then((r) => {
              //   window.MODEL_ID = projectId;
              //   window.NUM_FILES = r.data.n_files;
              //   window.SPINNER_CLASS = 'spinner';

              //   //TEMP FIX
              //   window.hasOwnProperty('launch3D') && window.launch3D();
              //   if (!window.hasOwnProperty('launch3D')) {
              //     document.location.reload();
              //   }
              // })
              axios
                .get(`${process.env.REACT_APP_API_URL}/log/${projectId}.json`)
                .then((logs) => {
                  console.log("logs", logs.data);
                  setLogs(logs.data);
                });
            } else {
              console.log("progress", progressLoading);
              timeoutIdentifier = setTimeout(poll, 1000);
              if (progressLoading > -1) {
                setProgress(progressLoading);
              }
            }
          });
      }
      await poll();
    } catch (err) {
      // return res.status(500).json({ error: err });
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("files", acceptedFiles[0]);
    if (acceptedFiles.length > 0) {
      if (acceptedFiles[0].size / 1024 / 1024 > 15) {
        alert("Version limitée à 15 Mo");
      } else {
        setProgress(0);
        const analysis = await axios.post(
          process.env.REACT_APP_API_URL,
          formData,
          {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
        const { projectId } = analysis.data;
        console.log("projectId", projectId);
        function poll() {
          axios
            .get(`${process.env.REACT_APP_API_URL}/pp/${projectId}`, {
              headers: {
                "Access-Control-Allow-Origin": "*"
              }
            })
            .then((r) => {
              const progressLoading = r.data.progress;
              if (progressLoading === 100) {
                clearTimeout(timeoutIdentifier);
                setProgress(progressLoading);

                axios
                  .get(`${process.env.REACT_APP_API_URL}/log/${projectId}.json`, {
                    headers: {
                      "Access-Control-Allow-Origin": "*"
                    }
                  })
                  .then((logs) => {
                    console.log("logs", logs.data);
                    setLogs(logs.data);
                  });
              } else {
                console.log("progress", progressLoading);
                timeoutIdentifier = setTimeout(poll, 1000);
                if (progressLoading > -1) {
                  setProgress(progressLoading);
                }
              }
            });
        }
        await poll();
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".ifc",
  });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const handleExportToCsv = (e) => {
    e.preventDefault();
    // Headers for each column
    let logsCsv = [];
    let headers = ["Severity", "Message", "Instance", "Time"].join(",");
    logsCsv.push(headers);

    logs?.forEach((log) => {
      const { level, message, instance, time } = log;
      logsCsv.push([level, message, instance, time].join(","));
    });

    downloadFile({
      data: [...logsCsv].join("\n"),
      fileName: `logs.csv`,
      fileType: "text/csv",
    });
  };

  return (
    <Card className={expandedView ? classes.cardExpanded : classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <Fab size="small" className={classes.fab}>
              <FactCheckIcon />
            </Fab>
          </Avatar>
        }
        title={`Validation`}
        subheader={`Système de validation d'un fichier IFC`}
        action={
          <div>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleExpandView}
              size="small"
            >
              {expandedView ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={() => setShowValidation(false)}
              size="small"
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              aria-label="settings"
              aria-describedby={id}
              onClick={handleClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {logs.length > 0 && (
                <ListItem button onClick={handleExportToCsv}>
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary="Télécharger CSV" />
                </ListItem>
              )}
              <ListItem button onClick={() => setShowValidation(false)}>
                <ListItemIcon>
                  <ClearIcon />
                </ListItemIcon>
                <ListItemText primary="Fermer" />
              </ListItem>
            </Popover>
          </div>
        }
      />
      <CardContent className={classes.cardContent}>
        <Grid item xs={12} align="center" justify="center" alignItems="center">
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>
                Importer votre fichier ici ou cliquez pour selectionner un
                fichier
              </p>
            ) : (
              <p>
                Importer votre fichier ici ou cliquez pour selectionner un
                fichier
              </p>
            )}
          </div>
        </Grid>

        {progress >= 0 && progress < 100 ? (
          <Grid
            item
            xs={12}
            align="center"
            justify="center"
            alignItems="center"
          >
            <LinearProgressWithLabel value={progress} />
          </Grid>
        ) : (
          <>
            {bimModel && (
              <>
                <Grid item xs={12}>
                  <br />
                  <Typography gutterBottom variant="title2" component="div">
                    Pour lancer l'audit de la maquette déja chargée:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={handleModelValidation}
                  >
                    Audit
                  </Button>
                </Grid>
              </>
            )}
          </>
        )}
        <Grid item xs={12}>
          {logs.length > 0 && (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Severity</TableCell>
                    <TableCell align="left">Message</TableCell>
                    <TableCell align="left">Instance</TableCell>
                    <TableCell align="left">time</TableCell>
                  </TableRow>
                </TableHead>
                {logs.map((log, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      style={{
                        color: `${log.level === "Error" ? "red" : "orange"}`,
                      }}
                    >
                      {log.level}
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.instance}</TableCell>
                    <TableCell>{log.time}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </TableContainer>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Validation;

function LinearProgressWithLabel(props) {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" className={classes.root} alignItems="center">
        {props.value === 0 ? (
          <div className={classes.linearProgress}>Vérification en cours...</div>
        ) : (
          <>
            <Box width="100%" mr={1}>
              <LinearProgress
                className={classes.linearProgress}
                variant="determinate"
                {...props}
              />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                props.value
              )}%`}</Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
