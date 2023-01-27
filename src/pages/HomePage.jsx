import React from "react";
import { IdleOverlay, LoadingDiv } from "@components";
import { getSourceCodeNotification, getOSNotification } from "@notifications";

import { BackgroundImage, Center, Container, Stack, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useOs } from "@mantine/hooks";

const HomePage = () => {
    const os = useOs();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => showNotification(getSourceCodeNotification()), 9000);
        setTimeout(() => setLoading(false), 1000);
        os != "undetermined" && setTimeout(() => showNotification(getOSNotification(getResponseForOs(os))), 5000);
    }, []);

    return (
        <BackgroundImage src="/Shapes.svg">
            <Container style={{display: "flex", flexDirection: "column", width: "100vw", height: "100vh"}}>
                {loading ? <LoadingDiv/> :
                    <>
                        <IdleOverlay />
                        <section id="hero" className="main-body" style={{width: "100%", height: "100%"}}>
                            <Container fluid style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                <Center>
                                    <Title align="center">{"Nausher Rao"}</Title>
                                </Center>
                                <Center>
                                    <Text align="center" size="xl">{"I do a lot of things, sometimes too many things."}</Text>
                                </Center>
                            </Container>
                        </section>

                        <section id="about">
                            <Text align="left">{"this is about'm"}</Text>
                        </section>

                        <section id="projects" className="main-body" style={{width: "100%", height: "100%"}}>
                            <Text align="left">{"this is projects"}</Text>
                        </section>
                    </>
                }
            </Container>
        </BackgroundImage>
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
