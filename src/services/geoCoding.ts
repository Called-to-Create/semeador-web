import { Address } from "../types/geolocation";

const key = process.env.REACT_APP_LOCATIONIQ_KEY;

export async function getReverseGeocoding(coords: {
  lat: number;
  lng: number;
}):Promise<Address> {
  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse.php?format=json&key=${key}&lat=${coords.lat}&lon=${coords.lng}`
  ).then((r) => r.json());

  return response.address as Address;
}
