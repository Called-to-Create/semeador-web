import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import HouseForm from "./HouseForm";

function Home() {
  return (
    <Box padding={4} width="100%">
      <Heading>🌱 SEMEADOR APP</Heading>
      <HouseForm />
    </Box>
  );
}

export default React.memo(Home);
