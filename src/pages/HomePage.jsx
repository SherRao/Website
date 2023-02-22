import React from "react";
import Lottie from "lottie-react";

import { FloatingButtons, IdleOverlay, LoadingSpinner, Spotlight, SocialMediaBar } from "@components";
import { getSourceCodeNotification, getOSNotification } from "@notifications";
import { getResponseForOs, LOADING_TIME_DURATION, SOURCE_CODE_NOTIF_DELAY, OS_NOTIF_DELAY } from "@constants";
import { SpinningThing } from "@assets";

import { BackgroundImage, Center, Container, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useOs } from "@mantine/hooks";

const ContainerElements = ({children}) => (
    // <MotionConfig transition={{ duration: 1 }}>
    <Center style={{display: "flex", flexDirection: "column"}}>
        <BackgroundImage src="/Shapes.svg">
            <Container style={{display: "flex", flexDirection: "column", width: "100lvw", height: "100lvh"}}>
                {children}
            </Container>
        </BackgroundImage>
    </Center>
    // </MotionConfig>
);

const MainContent = () => (
    // <Container style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
    <>
        <Spotlight />
        <FloatingButtons />

        <section id="hero">
            <Container style={{width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <Center>
                    <Title align="center">{"Nausher Rao"}</Title>
                </Center>

                <Center>
                    <Text align="center" size="xl">
                        {"My new website is a work in progress, you can find the original one "}
                        <a href="./v1">{"here!"}</a>
                    </Text>
                </Center>

                <Center>
                    <Lottie style={{width: "500px"}} animationData={SpinningThing} loop={true} />
                </Center>

                <SocialMediaBar />
            </Container>
        </section>
    </>
    // </Container>
);

const HomePage = () => {
    const os = useOs();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Stops the loading animation after 4.5 seconds
        setTimeout(() => setLoading(false), LOADING_TIME_DURATION);

        // Shows the source code notification after 5 seconds
        setTimeout(() => showNotification(getSourceCodeNotification()), SOURCE_CODE_NOTIF_DELAY);

        // Shows the OS notification after 7.5 seconds
        // os != "undetermined" && setTimeout(() => showNotification(getOSNotification(getResponseForOs(os))), OS_NOTIF_DELAY);
    }, []);

    // return (
    //     <ContainerElements>
    //         <FloatingButtons />
    //         {loading ? <LoadingSpinner/> :
    //             <Motion.div
    //                 initial={{ opacity: 0 }}
    //                 animate={{ opacity: 1 }}
    //                 style={{display: "flex", flexDirection: "column", width: "100vw", height: "100%"}}
    //             >
    //                 <IdleOverlay />
    //                 <MainContent />
    //             </Motion.div>
    //         }
    //     </ContainerElements>
    // );

    return (
        <ContainerElements>
            <IdleOverlay />
            {loading ? <LoadingSpinner/> : <MainContent />}
        </ContainerElements>
    );
};

export { HomePage };
