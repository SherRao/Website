import React from "react";
import { Center, Container, Space, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useOs } from "@mantine/hooks";
import { Timeline, IdleOverlay } from "@components";

const HomePage = () => {
    const os = useOs();
    React.useEffect(() => {
        setTimeout(() => {
            showNotification({
                title: "Want to look at the source code for my website?",
                message: "Hey there, your code is awesome! 🥳",
            });
        }, 1000);

        if(os != "undetermined")
            setTimeout(() => {
                showNotification({
                    title: "Hey there, " + getResponseForOs(os) + "!",
                    message: "I'm glad you're here. 😊",
                });
            }, 5000);
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
const getResponseForOs = (os) =>{
    switch(os) {
    case "windows":
        return "I'm a Windows user";

    case "macos":
        return "I'm a Mac user";

    case "linux":
        return "I'm a Linux user";

    case "android":
        return "I'm an Android user";

    case "ios":
        return "I'm an iOS user";

    default:
        return "I'm an undetermined user";
    }
};

export { HomePage };
