import React from "react";
import Lottie from "lottie-react";
import { motion as Motion, MotionConfig } from "framer-motion";

import { FloatingButtons, IdleOverlay, LoadingDiv, SocialMediaBar } from "@components";
import { getSourceCodeNotification, getOSNotification } from "@notifications";

import { BackgroundImage, Center, Container, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useOs } from "@mantine/hooks";
import groovyWalkAnimation from "@assets/spinning_thing.json";

const HomePage = () => {
    const os = useOs();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => showNotification(getSourceCodeNotification()), 9000);
        setTimeout(() => setLoading(false), 5000);
        os != "undetermined" && setTimeout(() => showNotification(getOSNotification(getResponseForOs(os))), 5000);
    }, []);

    return (
        <MotionConfig transition={{ duration: 1 }}>
            <BackgroundImage src="/Shapes.svg">
                <Container style={{display: "flex", flexDirection: "column", width: "100%", height: "100vh"}}>
                    <FloatingButtons />

                    {loading ? <LoadingDiv/> :
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}
                        >
                            <IdleOverlay />
                            <section id="hero" className="main-body" style={{width: "100%", height: "100%"}}>
                                <Container fluid style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                    <Center>
                                        <Title align="center">{"Nausher Rao"}</Title>
                                    </Center>
                                    <Center>
                                        <Text align="center" size="xl">{"I do a lot of things, sometimes too many things."}</Text>
                                    </Center>

                                    <Center>
                                        <Lottie style={{width: "500px"}} animationData={groovyWalkAnimation} loop={true} />
                                    </Center>
                                    <SocialMediaBar />
                                </Container>
                            </section>


                            {/* <section id="about">
                            <Text align="left">{"this is about'm"}</Text>
                        </section>

                        <section id="projects" className="main-body" style={{width: "100%", height: "100%"}}>
                        <Text align="left">{"this is projects"}</Text>
                    </section> */}
                        </Motion.div>
                    }
                </Container>
            </BackgroundImage>
        </MotionConfig>
    );
};

// TODO: Make these snarky
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
