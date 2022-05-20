import React from "react";
import { PageContainer, HorizontalSection } from "@layouts";
import { Grid } from "@mantine/core";
import { Center, Container, Stack, Title, Text } from "@mantine/core";

export default function LandingPage() {
    return (
        <Container fluid height="100vh" style={{backgroundColor: "red"}}>
            <Center>
                <Stack>
                    <Container>
                        <Title>Hey, my name is Nausher</Title>
                    </Container>

                    <Container>
                        <Text>
                    My new website is currently under construction, for my old website<a href="/old"> click here</a>!
                        </Text>
                    </Container>

                    <Container>
                        <Text>
                    You can find my resume<a href="/resume.pdf"> here</a>!
                        </Text>
                    </Container>

                    <Container>
                        <Grid>
                            <Grid.Col span={4}>1</Grid.Col>
                            <Grid.Col span={4}>2</Grid.Col>
                            <Grid.Col span={4}>3</Grid.Col>
                        </Grid>
                    </Container>
                </Stack>
            </Center>
        </Container>
    );
}