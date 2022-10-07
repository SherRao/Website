import React from "react";
import { Center, Container, Space, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Timeline, IdleOverlay } from "@components";

const HomePage = () => {
    React.useEffect(() => {
        setTimeout(() => {
            showNotification({
                title: "Want to look at the source code for my website?",
                message: "Hey there, your code is awesome! 🥳",
            });
        }, 1000);
    }, []);

    return (
        <>
            <IdleOverlay />
            <Container size="md" id="home" >
                <Center>
                    <Title>
                        {"I'm Nausher"}
                    </Title>
                </Center>

                <Center>
                    <Text align="center">
                        {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pellentesque lectus malesuada eros convallis, nec mattis tellus sagittis. Donec faucibus pretium nibh, ac posuere diam dictum in. In sem arcu, varius non velit quis, ullamcorper bibendum diam. Nullam pretium condimentum purus in interdum."}
                    </Text>
                </Center>

                <Space h="xl" />
                <Timeline />
            </Container>
        </>
    );
};

export { HomePage };
