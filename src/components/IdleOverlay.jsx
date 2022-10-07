import React from "react";
import { Center, Modal, Stack } from "@mantine/core";
import { useIdle } from "@mantine/hooks";

// 5 Minutes
const TIMEOUT = 1000 * 60 * 5;

const IdleOverlay = () => {
    const idle = useIdle(TIMEOUT, {initialState: false});
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
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </Center>
            </Stack>
        </Modal>
    );
};

export { IdleOverlay };
