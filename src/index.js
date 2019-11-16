import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TacoEmoji, PenguinEmoji, PizzaEmoji } from "./emojis";

import "./styles.css";

const MAPBOX_API_TOKEN =
  "pk.eyJ1IjoidGhlbWlnaHR5cGVuZ3VpbiIsImEiOiJjazMxeGZsN3QwNmFtM21wb2I2dTU3dDY3In0.50pOe01IfIXjkmiHA0YCow";
const SEARCH_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/tacos.json?access_token=${MAPBOX_API_TOKEN}&cachebuster=1573276695152&autocomplete=true&country=mx&limit=7`;

function App() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12
  });
  const [userLocation, setUserLocation] = useState(null);
  const [tacoPlaces, setTacoPlaces] = useState([]);

  useEffect(() => {
    async function getTacoPlaces() {
      const url = `${SEARCH_URL}&proximity=${userLocation.longitude},${
        userLocation.latitude
      }`;
      const response = await fetch(url);
      const data = await response.json();
      setTacoPlaces(data.features);
    }

    getTacoPlaces();
  }, [userLocation]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setViewport({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: viewport.zoom
      });
    });
  }, []);

  if (userLocation === null) {
    return <div>Loading...</div>;
  }

  return (
    <ReactMapGL
      width="100%"
      height="100%"
      latitude={viewport.latitude}
      longitude={viewport.longitude}
      zoom={viewport.zoom}
      mapboxApiAccessToken={MAPBOX_API_TOKEN}
      onViewportChange={newViewport => {
        setViewport(newViewport);
      }}
    >
      <Marker
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
        offsetTop={-10}
        offsetLeft={-10}
      >
        <PenguinEmoji />
      </Marker>
      {tacoPlaces.map(tacoPlace => {
        const [longitude, latitude] = tacoPlace.center;
        return (
          <Marker longitude={longitude} latitude={latitude}>
            <TacoEmoji />
          </Marker>
        );
      })}
    </ReactMapGL>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
