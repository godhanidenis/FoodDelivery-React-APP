import React, { Component } from "react";
import { compose, withHandlers, withState, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

const MapComponennt = compose(
  withState("zoomLevel", "setZoomLevel", 5),
  withProps(() => ({
    mapRef: React.createRef(),
  })),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }

  function handleZoomChanged() {
    let { zoomLevel, setZoomLevel } = props;
    const currZoom = this.getZoom();
    
    if (currZoom !== zoomLevel) {
      setZoomLevel(() => currZoom);
    }
    
  }

  const sampleData = [
    {
      id: 1,
      title: "Husky Rescue",
      latitude: -26.002155,
      longitude: 27.960054,
    },
    {
      id: 2,
      title: "Woodrock Animal Rescue",
      latitude: -25.834538,
      longitude: 27.975973,
    },
    {
      id: 3,
      title: "TEARS Animal Rescue",
      latitude: -34.135666,
      longitude: 18.371537,
    },
  ];

  const defaultCoordinates = { lat: -28.55, lng: 22.93 };

  const center = props.selectedMarker
    ? {
        lat: props.selectedMarker.latitude,
        lng: props.selectedMarker.longitude,
      }
    : defaultCoordinates;

  const markers = props.useSampleData ? sampleData : props.markers;
 
  return (
    <GoogleMap
      defaultCenter={defaultCoordinates}
      zoom={props.zoomLevel}
      center={center}
      onZoomChanged={handleZoomChanged}
      ref={props.mapRef}
    >
      <MarkerClusterer
        onClick={props.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
      >
        {markers.map((marker) => {
          const onMarkerClick = (event) => {
            
            props.setZoomLevel(() => 17);
            onClick(event);
          };
          const onClick = props.onClick.bind(this, marker);

          return (
            <Marker
              key={marker.id}
              onClick={onMarkerClick}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              title={marker.title}
            >
              {props.selectedMarker &&
                shallowEqual(props.selectedMarker, marker) && (
                  <InfoWindow>
                    <div>{marker.title}</div>
                  </InfoWindow>
                )}
            </Marker>
          );
        })}
      </MarkerClusterer>
    </GoogleMap>
  );
});

export default class MarkerMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      selectedMarker: null,
      zoom: 5,
    };
  }

  handleClick = (marker, event) => {
    
    this.setState({ selectedMarker: marker });
  };

  render() {
    return (
      <MapComponennt
        useSampleData={true}
        selectedMarker={this.state.selectedMarker}
        markers={this.state.places}
        onClick={this.handleClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
