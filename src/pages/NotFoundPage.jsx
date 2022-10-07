import React from "react";
import { Center, Container, Text, Title } from "@mantine/core";

const NotFoundPage = () => {
    return (
        <Center fluid style={{ height: "100vh" }}>
            <Container fluid>
                <Container>
                    <Title align="center">
                        {"404 - Page Not Found"}
                    </Title>

                    <Text align="center">
                        {"There's nothing here to see! 😞"}
                    </Text>
                </Container>
            </Container>
        </Center>
    );
};

export { NotFoundPage };
