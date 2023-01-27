import React from "react";
import Lottie from "lottie-react";
import { motion as Motion, MotionConfig } from "framer-motion";

import { FloatingButtons, IdleOverlay, LoadingSpinner, SocialMediaBar } from "@components";
import { getSourceCodeNotification, getOSNotification } from "@notifications";
import { getResponseForOs } from "@constants";
import { SpinningThing } from "@assets";

import { BackgroundImage, Center, Container, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useOs } from "@mantine/hooks";

const ContainerElements = ({children}) => (
    <MotionConfig transition={{ duration: 1 }}>
        <BackgroundImage src="/Shapes.svg">
            <Container style={{display: "flex", flexDirection: "column", width: "100%", height: "100vh"}}>
                {children}
            </Container>
        </BackgroundImage>
    </MotionConfig>
);

const MainContent = () => (
    <section id="hero" className="main-body" style={{width: "100%", height: "100%"}}>
        <Container fluid style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <Center>
                <Title align="center">{"Nausher Rao"}</Title>
            </Center>
            <Center>
                <Text align="center" size="xl">{"I do a lot of things, sometimes too many things."}</Text>
            </Center>

            <Center>
                <Lottie style={{width: "500px"}} animationData={SpinningThing} loop={true} />
            </Center>

            <SocialMediaBar />
        </Container>
    </section>
);

const HomePage = () => {
    const os = useOs();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => showNotification(getSourceCodeNotification()), 9000);
        setTimeout(() => setLoading(false), 5000);
        os != "undetermined" && setTimeout(() => showNotification(getOSNotification(getResponseForOs(os))), 5000);
    }, []);

    return (
        <ContainerElements>
            <FloatingButtons />
            {loading ? <LoadingSpinner/> :
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}
                >
                    <IdleOverlay />
                    <MainContent />
                </Motion.div>
            }
        </ContainerElements>
    );
};

export { HomePage };
