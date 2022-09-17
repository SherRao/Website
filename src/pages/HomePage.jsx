import React from "react";
import { Alert, Button, Center, Container, Modal, Stack, Space, Text, Title } from "@mantine/core";
import { showNotification } from '@mantine/notifications';
import { useIdle } from '@mantine/hooks';
import { Timeline } from "@components";

export default function HomePage() {
    React.useEffect(() => {
        setTimeout(() => {
            showNotification({
                title: 'Want to look at the source code for my website?',
                message: 'Hey there, your code is awesome! 🥳',
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
}

const IdleOverlay = () => {
    const idle = useIdle(1000, {initialState: false});
    const [modalOpened, setModalOpened] = React.useState(false);
    React.useEffect(() => {
        if(idle)
            setModalOpened(true);

    }, [idle]);

    return (
        <Modal
            title="You've been idle a while..."
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            overflow="inside"
        >
            <Stack>
                <Center>
                    <iframe
                        src="https://www.youtube.com/embed/o-YBDTqX_ZU?autoplay=1"
                        // title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    />
                </Center>
            </Stack>
        </Modal>
    );
};
