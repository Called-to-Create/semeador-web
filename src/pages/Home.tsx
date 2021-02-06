import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import MailForm from "./MailForm";

function Home() {
  return (
    <Box padding={4} width="100%">
      <Heading as="h1">🌱 SEMEADOR APP</Heading>
      <Text bg="orange.100" align="center">Projeto bom vizinho</Text>
      <MailForm user="juninho" projectId="601d2c30459beb694efe67dd" />
    </Box>
  );
}

export default React.memo(Home);
