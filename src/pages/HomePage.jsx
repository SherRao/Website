import React from "react";
import { Alert, Center, Container, Stack, Space, Text, Title } from "@mantine/core";
import { Timeline } from "@components";

export default function HomePage() {
    React.useEffect(() => {
        

    }, []);

    return (
        <Container size="md" id="home" >
            <Title>My name is Nausher Rao</Title>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pellentesque lectus malesuada eros convallis, nec mattis tellus sagittis. Donec faucibus pretium nibh, ac posuere diam dictum in. In sem arcu, varius non velit quis, ullamcorper bibendum diam. Nullam pretium condimentum purus in interdum.</Text>
            <Space h="xl" />
            <Timeline />
        </Container>
    );
}