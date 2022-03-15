import React, { useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  makeStyles,
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  Avatar,
  Badge,
  Typography
} from '@material-ui/core';
import DropBoxLogo from './img/DropBoxLogo.jpg';
import DropboxChooser from 'react-dropbox-chooser';

const {
  REACT_APP_DROPBOX_APP_KEY
} = process.env;

const useStyles = makeStyles((theme) => ({

}));

const DropBox = ({
  viewer,
  onDrop
}) => {
  const [selectedApp, setSelectedApp] = useState({
    name: 'DropBox',
    img: DropBoxLogo,
    type: 'storage',
  })

  async function handleSuccess(files) {
    const rawResponse = await fetch(files[0].link);
    const result = await rawResponse.text();
    const ifcBlob = new Blob([result], { type: 'text/plain' });
    const file = new File([ifcBlob], 'ifcFile');
    onDrop({ files: [file], viewer });
  }

  return (
    <>
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <DropboxChooser
            appKey={REACT_APP_DROPBOX_APP_KEY}
            success={handleSuccess}
            cancel={() => console.log('closed')}
            multiselect={false}
            extensions={['.ifc']}
          >
            <Card
            >
              <CardActionArea
              >
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="recipe"
                      src={selectedApp.img}
                      alt={selectedApp.name}
                      title={selectedApp.name}
                    />
                  }
                  title={selectedApp.name}
                  subheader={<Badge color="success" pill>{selectedApp.type}</Badge>}
                />
                {/* <CardContent>
                  <Typography
                    variant="h4"
                    color="textSecondary"
                    component="h4"
                  >
                    {'Connexion'}
                  </Typography>
                </CardContent> */}
              </CardActionArea>
            </Card>
          </DropboxChooser>
          <Grid item xs={3} />
        </Grid>
      </Grid>
    </>
  )
}

export default DropBox;

