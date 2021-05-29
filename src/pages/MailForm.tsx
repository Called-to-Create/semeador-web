import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Skeleton,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Data,
  GoogleMap,
  Marker,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useRef, useState } from "react";
import baseIcon from "../assets/lighthouse.png";
import mailBox from "../assets/mailbox.png";
import { getReverseGeocoding } from "../services/geoCoding";
import { Address, AppGeolocation } from "../types/geolocation";

const baseLocation = {
  lat: -15.603703248931666,
  lng: -56.1341732590274,
};

const areaOptions = {
  fillColor: "darkgreen",
  fillOpacity: 0.3,
  strokeColor: "darkgreen",
  strokeOpacity: 0.4,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const paths = [
  { lat: -15.599080213363983, lng: -56.13742594034749 },
  { lat: -15.598608790512658, lng: -56.13634163092526 },
  { lat: -15.604146278351617, lng: -56.13393166612538 },
  { lat: -15.604278603250824, lng: -56.13519539649837 },
];

// const oldPaths = [
//   { lat: -15.60425200003934, lng: -56.13528081661273 },
//   { lat: -15.604003061652685, lng: -56.13267643736558 },
//   { lat: -15.598118099310096, lng: -56.13521380709367 },
//   { lat: -15.599067685900074, lng: -56.137403815786605 },
// ];

type Props = {
  user: string;
  projectId: string;
};

// TODO: componentizar
function HouseForm(props: Props) {
  const [pin, setPin] = useState<AppGeolocation | null>(null);
  const [lastReference, setLastReference] =
    useState<AppGeolocation | null>(null);

  const [address, setAddress] = useState<Address | null>();
  const [number, setNumber] = useState<number | null>(null);
  const [obs, setObs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputNumberRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || "",
  });
  const toast = useToast();

  const handleChangeNumber = (e: any) => setNumber(e.target.value);
  const handleChangeObs = (e: any) => setObs(e.target.value);
  const handlePinMap = async (geometry: any) => {
    console.log(`geometry`, geometry);
    const coords = {
      lat: geometry?.g.lat() as number,
      lng: geometry?.g.lng() as number,
    };
    console.info("coords", JSON.stringify(coords));
    setPin(coords);
    const address = await getReverseGeocoding(coords);
    console.info("address", address);
    setAddress(address);
    inputNumberRef?.current?.focus();
  };
  const clearState = () => {
    setPin(null);
    setNumber(null);
    setAddress(null);
    setObs("");
  };

  const submit = async () => {
    const house = { ...address, number, obs, location: pin };
    console.log("Submit: \n", JSON.stringify(house, null, 4));
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/places/mailing`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            user: props.user,
            project_id: props.projectId,
          }),
          body: JSON.stringify(house),
        }
      );

      if (response.status !== 201) {
        throw new Error(`${response.status}:${response.statusText}`);
      }

      clearState();
      setLastReference(pin || baseLocation);
      toast({
        title: "A semente foi lançada",
        description: "continue semeando",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Ops",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoaded && (
        <Box minHeight="250px" maxHeight="500px" h="100%">
          <FormControl isRequired={pin === null}>
            <FormLabel fontWeight="bold">Geolocalização</FormLabel>
            <Text as="small" textColor="gray">
              selecione no mapa a localização da residência
            </Text>
            <GoogleMap
              mapContainerStyle={{
                minWidth: "200px",
                width: "100%",
                minHeight: "250px",
                height: pin ? "100%" : "70vh",
              }}
              zoom={16}
              center={pin || lastReference || baseLocation}
            >
              {/* <Polygon
                options={{
                  ...areaOptions,
                  fillColor: "darkblue",
                  strokeColor: "darkblue",
                }}
                paths={oldPaths}
              /> */}
              <Polygon options={areaOptions} paths={paths} />
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
              {lastReference && (
                <Marker
                  label="Último envio"
                  position={lastReference}
                  icon={mailBox}
                />
              )}
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
          {isLoading ? (
            <>
              <Skeleton height="35px" />
              <Skeleton height="35px" />
              <Skeleton height="35px" />
              <Skeleton height="35px" />
              <Skeleton height="35px" />
            </>
          ) : (
            <>
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
                      ref={inputNumberRef}
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
                colorScheme="messenger"
                disabled={!pin || !address}
                leftIcon={<>📨</>}
                marginTop={4}
                w="100%"
                onClick={submit}
              >
                REGISTRAR CORRESPONDÊNCIA
              </Button>
            </>
          )}
        </VStack>
      )}
    </>
  );
}

export default React.memo(HouseForm);
