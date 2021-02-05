import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Data,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState } from "react";
import baseIcon from "../assets/lighthouse.png";
import { getReverseGeocoding } from "../services/geoCoding";
import { Address } from "../types/geolocation";

const baseLocation = {
  lat: -15.603703248931666,
  lng: -56.1341732590274,
};

function HouseForm() {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [lastReference, setLastReference] = useState(baseLocation);

  const [address, setAddress] = useState<Address | null>();
  const [number, setNumber] = useState<number | null>(null);
  const [obs, setObs] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || "",
  });
  const toast = useToast();

  const handleChangeNumber = (e: any) => setNumber(e.target.value);
  const handleChangeObs = (e: any) => setObs(e.target.value);
  const handlePinMap = async (geometry: any) => {
    const coords = {
      lat: geometry.i.lat(),
      lng: geometry.i.lng(),
    };
    console.info("coords", coords);
    setPin(coords);
    const address = await getReverseGeocoding(coords);
    console.info("address", address);
    setAddress(address);
  };

  const clearState = () => {
    setLastReference(pin || baseLocation);
    setPin(null);
    setNumber(null);
    setAddress(null);
  };

  const submit = () => {
    const house = { ...address, number, obs, location: pin };

    console.log("Submit: \n", JSON.stringify(house, null, 4));

    clearState();
    toast({
      title: "A semente foi lançada",
      description: "continue semeando",
      status: "success",
      duration: 3000,
    });
  };

  return (
    <>
      {isLoaded && (
        <Box minHeight="200px" maxHeight="500px" h="100%">
          <FormControl isRequired={pin === null}>
            <FormLabel fontWeight="bold">Geolocalização</FormLabel>
            <Text as="small" textColor="gray">
              selecione no mapa a localização da residência
            </Text>
            <GoogleMap
              mapContainerStyle={{
                minWidth: "200px",
                width: "100%",
                minHeight: "200px",
                height: pin ? "100%" : "70vh",
              }}
              zoom={16}
              center={pin || lastReference}
            >
              {pin && (
                <Marker
                  label="📩"
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
                  featureFactory: handlePinMap,
                }}
              />
            </GoogleMap>
          </FormControl>
        </Box>
      )}
      {address && (
        <VStack marginTop="2rem" padding={4} shadow="md" align="stretch">
          <Box>
            <strong>Cidade:</strong>{" "}
            <Badge>
              {address.city}, {address.state} {address.country}
            </Badge>
          </Box>
          <Box>
            <strong>Bairro:</strong> <Badge>{address.suburb}</Badge>
          </Box>
          <Box>
            <strong>Rua:</strong> <Badge>{address.road}</Badge>
          </Box>
          <Box>
            <strong>CEP:</strong> <Badge>{address.postcode}</Badge>
          </Box>
          <Box>
            <FormControl>
              <FormLabel fontWeight="bold">Número</FormLabel>
              <NumberInput variant="filled">
                <NumberInputField
                  value={number || 0}
                  placeholder="Nº da casa"
                  onChange={handleChangeNumber}
                />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Observação</FormLabel>
              <Input
                value={obs}
                onChange={handleChangeObs}
                variant="filled"
                placeholder="Exemplo: cor da casa"
              />
            </FormControl>
          </Box>
          <Button marginTop={4} colorScheme="red" onClick={clearState}>
            CANCELAR
          </Button>
          <Button
            disabled={!pin || !address}
            leftIcon={<>📨</>}
            marginTop={4}
            w="100%"
            onClick={submit}
          >
            REGISTRAR CORRESPONDÊNCIA
          </Button>
        </VStack>
      )}
    </>
  );
}

export default React.memo(HouseForm);
