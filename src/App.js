import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
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
import IfcRenderer from './Views/IfcRenderer/IfcRenderer';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography
} from '@material-ui/core';

const Menu = {
  MenuNavBar: [
    { text: "", link: "", href: "", icon: "" }
  ],
  MenuSideBarSup: [
    { text: "BIM Viewer", link: "/", href: "", icon: "dashboard" },
  ],
  MenuSideBarInf: [
    // { text: "Documentation", link: "", href: "https://www.tridyme.com/fr/documentation/fr/developpers/tridyme-webapp-kit-serverless", icon: "chrome_reader_mode" },
    { text: "GitHub", link: "", href: "https://github.com/tridyme/sdk-structure-app", icon: "code" }
  ]
};

const {
  REACT_APP_FAVICON,
  REACT_APP_LOGO,
  REACT_APP_COMPANY
} = process.env;


const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#ffffff',
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
      <Helmet>
        <title>{`${REACT_APP_COMPANY} | Applications`}</title>
        <link rel="icon" type="image/png" href={`${REACT_APP_FAVICON}`} sizes="16x16" />
      </Helmet>
      <Router history={history}>
        <AppContainerElem
          title={
            <>
              {/* {REACT_APP_COMPANY === 'VBMC' ? */}
              <>
                <img
                  alt={`${REACT_APP_COMPANY}`}
                  src={`${REACT_APP_LOGO}`}
                  style={{ height: '2em', width: 'auto' }}
                />
              </>
              {/* :
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={`${REACT_APP_COMPANY}`}
                      src={`${REACT_APP_LOGO}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                  // style={{ fontSize: '2em' }}
                  // primary={`TriBIM`}
                  >
                    <Typography
                      style={{
                        fontSize: '1.2em'
                      }}
                    >
                      {`TriBIM`}
                    </Typography>
                  </ListItemText>
                </ListItem>
              } */}
            </>
          }
          menu={Menu}
        >
          <Switch>
            <Route exact path="/" component={IfcRenderer} />
            <Route exact path="/ifcrenderer" component={IfcRenderer} />
          </Switch>
        </AppContainerElem>
      </Router>
    </ThemeProvider>
  );
};

export default App;
