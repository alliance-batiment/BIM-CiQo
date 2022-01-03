import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BcfReader } from '@parametricos/bcf-js';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function BcfDialog({
  open,
  onClose,
  onOpenViewpoint
}) {
  const [file, setFile] = useState();
  const [topics, setTopics] = useState([]);
  const [fitleredTopics, setFitleredTopics] = useState([]);

  useEffect(() => {
    const fitleredTopics = topics.filter((t) => t.viewpoints.length > 0);
    setFitleredTopics(fitleredTopics);
  }, []);

  const handleOpenViewpoint = (viewpoint) => {
    onOpenViewpoint(viewpoint);
    onClose();
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    const reader = new BcfReader();
    await reader.read(acceptedFiles[0]);
    console.log('SET TOPICS', reader.topics)
    setTopics(reader.topics);
    setFile(acceptedFiles[0])
    const fitleredTopics = reader.topics.filter((t) => t.viewpoints.length > 0);
    setFitleredTopics(fitleredTopics);
    console.log('SET TOPICS', fitleredTopics)
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ".bcf" });

  return (
    <Dialog
      maxWidth='xl'
      fullWidth
      disableBackdropClick
      open={open}
      onClose={onClose}
    >
      <DialogTitle>BCF Viewer</DialogTitle>
      <DialogContent>
        {!file && (
          <Box
            height={600}
            display='flex'
            alignItems="center"
            justifyContent="center"
            border={isDragActive ? "solid 4px" : "none"}
            borderColor={isDragActive ? "#ffa50f" : ""}
            borderRadius={20}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {
              isDragActive ?
                <Typography variant="h6">Drop the BCF here ...</Typography> :
                <Typography variant="h6">Drag 'n' drop a BCF here, or click to select</Typography>
            }
          </Box>
        )}
        {file && (
          <Grid container spacing={2}>
            {fitleredTopics.map((topic, i) => (
              <Grid key={i} item>
                <TopicCard topic={topic} onOpenViewpoint={handleOpenViewpoint} />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
              </Button>
      </DialogActions>
    </Dialog>
  );
}

function TopicCard({
  topic,
  onOpenViewpoint
}) {

  const classes = useStyles();
  const [defaultViewpoint, setDefaultViewpoint] = useState(null);
  const [defaultViewpointUrl, setDefaultViewpointUrl] = useState("");
  // const { topic, onOpenViewpoint } = props;

  // const defaultViewpoint = topic?.markup?.viewpoints?.length > 0 ? topic.markup.viewpoints[0] : null;

  const handleClick = () => {
    if (topic.viewpoints.length > 0) {
      onOpenViewpoint(topic.viewpoints[0]);
    }
  }

  // useEffect(() => {
  //   const getViewpoint = async () => {
  //     const newDefaultViewpoint = topic?.markup?.viewpoints?.length > 0 ? topic.markup.viewpoints[0] : null;
  //     if (newDefaultViewpoint) {
  //       const data = await topic.getViewpointSnapshot(defaultViewpoint);
  //       const url = window.URL.createObjectURL(data);
  //       setDefaultViewpointUrl(url);
  //     }
  //     setDefaultViewpoint(newDefaultViewpoint)
  //   }
  //   getViewpoint()
  // }, [defaultViewpoint, topic]);

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          className={classes.media}
          image={defaultViewpointUrl}
          title={topic.markup.topic.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {topic.markup.topic.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {topic.markup.topic.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/*<CardActions>
              <Button size="small" color="primary">
                  Open
              </Button>
              <Button size="small" color="primary">
                  Learn More
              </Button>
          </CardActions>*/}
    </Card>
  )
}