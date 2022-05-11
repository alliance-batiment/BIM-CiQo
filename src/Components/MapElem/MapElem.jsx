import React, { useState, useEffect } from 'react';
//import ReactMapboxGl, { Layer, Feature, Popup, Marker, ZoomControl } from 'react-mapbox-gl';
// import { Link } from 'react-router-dom';
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
import {
  Grid,
  Typography
} from '@material-ui/core';
import Pins from './components/Pins';
// import AlertRadioElem from '../AlertRadioElem';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, @typescript-eslint/no-var-requires */
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, @typescript-eslint/no-var-requires*/
// // eslint-disable-next-line import/no-webpack-loader-syntax
// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
// import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker';
// mapboxgl.workerClass = MapboxWorker;

const TOKEN = 'pk.eyJ1IjoidHJpYXp1ciIsImEiOiJja25qN3VucjkzdmY5MnFwOTh0N2x3azU0In0.qSCTe3UaV9YwBYddKOFPWA';
const geolocateStyle = {
  top: 0,
  left: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

const MapElem = ({
  title,
  places,
  height
}) => {
  const [viewport, setViewport] = useState({
    width: 400,
    height: height || 600,
    latitude: places.length !== 1 ? 47.088528 : places[0].latitude,
    longitude: places.length !== 1 ? 2.375996 : places[0].longitude,
    zoom: places.length !== 1 ? 4 : 15
  });
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <>
      <Grid container spacing={1}>
        <Typography>
          {title}
        </Typography>
        <Grid item xs={12}>
          <MapGL
            {...viewport}
            width="100%"
            height={`${height || 600}px`}
            mapStyle="mapbox://styles/triazur/ck4oeg8gg0v4q1co4pyhsqjlr"
            onViewportChange={setViewport}
            mapboxAccessToken={TOKEN}
          >
            <Pins data={places} onClick={setPopupInfo} />

            {popupInfo && (
              <Popup
                tipSize={5}
                anchor="top"
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeOnClick={false}
                onClose={setPopupInfo}
              >
                <p>
                  {/* <Link to={`/sites/${popupInfo._id}`}>
                    {popupInfo.name}
                  </Link> */}
                </p>
                <p>{popupInfo.type}</p>
                <p>{popupInfo.description}</p>
                {/* <AlertRadioElem
                  alert={!popupInfo.alert}
                  messageOk="No Alert"
                  messageNok="Alert - Maintenance visit required"
                  link={`/sites/${popupInfo._id}`}
                /> */}
                {/* <CityInfo info={popupInfo} /> */}
              </Popup>
            )}

            <GeolocateControl style={geolocateStyle} />
            <FullscreenControl style={fullscreenControlStyle} />
            <NavigationControl style={navStyle} />
            <ScaleControl style={scaleControlStyle} />
          </MapGL>
        </Grid>
      </Grid>
      {/* <ControlPanel /> */}
    </>
  );
}

export default MapElem;