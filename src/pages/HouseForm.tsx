import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import {
  Data,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState } from "react";
import baseIcon from "../assets/lighthouse.png";

const baseLocation = {
  lat: -15.603703248931666,
  lng: -56.1341732590274,
};

function HouseForm() {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAKUP85sHjw9lDE2K-5FiK1rND9SYxEnQE",
  });

  return (
    <>
      <Box padding={2}>
        <FormControl>
          <FormLabel fontWeight="bold">Santa Isabel, Cuiaba MT</FormLabel>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight="bold">Rua</FormLabel>
          <Input variant="filled" name="rua" placeholder="Nome da rua" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight="bold">Número</FormLabel>
          <NumberInput variant="filled">
            <NumberInputField w="8rem" placeholder="Nº da casa" />
          </NumberInput>
        </FormControl>
      </Box>
      {isLoaded && (
        <Box minHeight="200px" h="100%">
          <FormLabel fontWeight="bold">Geolocalização</FormLabel>
          <GoogleMap
            mapContainerStyle={{
              minWidth: "200px",
              width: "100%",
              minHeight: "200px",
              height: "100%",
            }}
            zoom={16}
            center={pin || baseLocation}
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
              />
            )}
            <Marker
              icon={baseIcon}
              cursor="pointer"
              position={baseLocation}
              title="Base: Ibpaz Santa Isabel"
            />
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
      <hr />
      <Button leftIcon={<>📨</>} marginTop={4} w="100%">
        Registrar correspondência
      </Button>
    </>
  );
}

export default React.memo(HouseForm);
