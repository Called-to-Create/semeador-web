import { Box, SimpleGrid } from "@chakra-ui/react";
import {
  Data,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState } from "react";

function HouseForm() {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAKUP85sHjw9lDE2K-5FiK1rND9SYxEnQE",
  });

  return (
    <SimpleGrid minChildWidth="200px" spacing="10px">
      <Box bg="twitter.100 ">
          teste
      </Box>
      {isLoaded && (
        <Box bg="tomato">
          <GoogleMap
            mapContainerStyle={{ minWidth: "200px", height: "90vh" }}
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
                controls: ["Point"],
                drawingMode: "Point",
                featureFactory: (geometry: any) => {
                  console.log("geometry: ", geometry);
                  const coords = {
                    lat: geometry.i.lat(),
                    lng: geometry.i.lng(),
                  };
                  console.log("coords", coords);
                  setPin(coords);
                },
              }}
            />
          </GoogleMap>
        </Box>
      )}
    </SimpleGrid>
  );
}

export default React.memo(HouseForm);
