import {
  Data,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState } from "react";

function App() {
  const [pin, setPin] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAKUP85sHjw9lDE2K-5FiK1rND9SYxEnQE",
  });

  return (
    <div>
      LOCATION PICKER
      <hr />
      <div>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "90vw", height: "50vh" }}
            zoom={15}
            center={
              pin || {
                lat: -15.614044290060665,
                lng: -56.116292077536755,
              }
            }
          >
            {pin && (
              <Marker
                cursor="pointer"
                position={pin}
                animation="BOUNCE"
                draggable
                onDragEnd={(e) => {
                  const coords = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  };
                  console.log("coords", coords);
                  setPin(coords);
                }}
                label="Lugar top"
              />
            )}
            <Data
              onAddFeature={console.log}
              options={{
                controlPosition: window.google
                  ? window.google.maps.ControlPosition.TOP_LEFT
                  : undefined,
                controls: ["Point"],
                drawingMode: "Point",
                featureFactory: (geometry) => {
                  console.log("geometry: ", geometry);
                  const coords = {
                    lat: geometry.i.lat(),
                    lng: geometry.i.lng(),
                  };
                  console.log("coords", coords);
                  setPin(coords);
                },
                // Type:  string
                // Mouse cursor to show on hover. Only applies to point geometries.
                // cursor: 'cursor',

                // Type:  boolean
                // If true, the object can be dragged across the map and the underlying feature will have its geometry updated. Default value is false.
                draggable: true,

                // Type:  boolean
                // If true, the object can be edited by dragging control points and the underlying feature will have its geometry updated. Only applies to LineString and Polygon geometries. Default value is false.
                editable: false,

                // Type:  string
                // The fill color. All CSS3 colors are supported except for extended named colors. Only applies to polygon geometries.
                fillColor: "#FF0055",

                // Type:  number
                // The fill opacity between 0.0 and 1.0. Only applies to polygon geometries.
                fillOpacity: 1,

                // Type:  string|Icon|Symbol
                // Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url. Only applies to point geometries.
                // icon: 'icon',

                // Type:  MarkerShape
                // Defines the image map used for hit detection. Only applies to point geometries.
                // shape: 'shape',

                // Type:  string
                // The stroke color. All CSS3 colors are supported except for extended named colors. Only applies to line and polygon geometries.
                strokeColor: "#00FF55",

                // Type:  number
                // The stroke opacity between 0.0 and 1.0. Only applies to line and polygon geometries.
                strokeOpacity: 1,

                // Type:  number
                // The stroke width in pixels. Only applies to line and polygon geometries.
                strokeWeight: 2,

                // Type:  string
                // Rollover text. Only applies to point geometries.
                title: "Title",

                // Type:  boolean
                // Whether the feature is visible. Defaults to true.
                visible: true,

                // Type:  number
                // All features are displayed on the map in order of their zIndex, with higher values displaying in front of features with lower values. Markers are always displayed in front of line-strings and polygons.
                zIndex: 2,
              }}
            />
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

export default App;
