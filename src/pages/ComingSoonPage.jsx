import React from "react";
import { Container, Stack, Title, Text } from "@mantine/core";
import { SocialMediaBar, ThemeSwitcher } from "@components";

export default function ComingSoonPage() {
    return (
        <Container fluid color={null}>
            <Stack color="green">
                <Container>
                    <Title align="center">
                        {"Hey, my name is Nausher"}
                    </Title>
                </Container>

                <Container>
                    <Text align="center">
                        {"My new website is currently under construction, for my old website"}<a href="/old">{" click here"}</a>{"!"}
                    </Text>
                </Container>

                <Container>
                    <Text align="center">
                        {"You can find my resume "}<a href="/resume.pdf">{"here"}</a>{"!"}
                    </Text>
                </Container>

                <SocialMediaBar/>
                <ThemeSwitcher />
            </Stack>
        </Container>
    );
}
