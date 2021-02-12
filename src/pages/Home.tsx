import { Badge, Box, Button, Heading, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import MailForm from "./MailForm";

function Home() {
  const [user, setUser] = useState(null);

  return (
    <Box padding={4} width="100%">
      <Heading as="h1">🌱 SEMEADOR APP</Heading>
      <Text bg="orange.100" align="center" fontWeight="bold">
        Projeto bom vizinho
      </Text>
      <Text bg="orange.100" align="center" fontWeight="bold">
        {user && <Badge>{user}</Badge>}
      </Text>
      <hr />
      {user ? (
        <MailForm
          user={user || "SEMEADOR"}
          projectId="bom-vizinho-santa-isabel"
        />
      ) : (
        <Box
          as="form"
          height="300px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          onSubmit={(event: any) => {
            event.preventDefault();
            setUser(event.target["user"].value.toUpperCase());
          }}
        >
          <Heading>Qual é o seu nome?</Heading>
          <Input name="user" required variant="filled" />
          <Button marginTop={4} colorScheme="messenger" w="100%" type="submit">
            COMEÇAR
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default React.memo(Home);
