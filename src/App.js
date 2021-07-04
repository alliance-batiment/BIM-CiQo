import React, { Component, useState } from 'react';
import {
  Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';
import history from './history';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppContainerElem from './Components/AppContainerElem';

import MyApp from './Views/MyApp/';
import ThreeDRender from './Views/ThreeDRender/';
import IfcRenderer from './Views/IfcRenderer/';
import Camera from './Views/Camera/';
import Hand from './Views/Hand/';
import ObjectDetection from './Views/ObjectDetection/';

const Menu = {
  MenuNavBar: [
    { text: "", link: "", href: "", icon: "" }
  ],
  MenuSideBarSup: [
    { text: "Home", link: "/home", href: "", icon: "dashboard" },
    { text: "3D Render", link: "/threedrender", href: "", icon: "spam" },
    { text: "IFC Render", link: "/ifcrenderer", href: "", icon: "spam" },
    /*  { text: "Camera", link: "/camera", href: "", icon: "camera" },
     { text: "Hand", link: "/hand", href: "", icon: "camera" },
     { text: "Object Detection", link: "/objectdetection", href: "", icon: "camera" } */
  ],
  MenuSideBarInf: [
    { text: "Documentation", link: "", href: "https://www.tridyme.com/fr/documentation/fr/developpers/tridyme-webapp-kit-serverless", icon: "chrome_reader_mode" }
  ]
};

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#000000',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
          secondary: {
            //light: '#0066ff',
            main: '#ff0000',
            // dark: will be calculated from palette.secondary.main,
            //contrastText: '#ffcc00',
          },
        },
      }),
    [prefersDarkMode],
  );


  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <AppContainerElem
          title="My App"
          menu={Menu}
        >
          <Switch>
            <Route exact path="/" component={MyApp} />
            <Route exact path="/home" component={MyApp} />
            <Route exact path="/threedrender" component={ThreeDRender} />
            <Route exact path="/ifcrenderer" component={IfcRenderer} />
            <Route exact path="/camera" component={Camera} />
            <Route exact path="/hand" component={Hand} />
            <Route exact path="/objectdetection" component={ObjectDetection} />
          </Switch>
        </AppContainerElem>
      </Router>
    </ThemeProvider>
  );
};

export default App;
