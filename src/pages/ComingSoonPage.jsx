import React from "react";
import { Container, Divider, Timeline as MantineTimeline, Stack, Title, Text } from "@mantine/core";
import { SocialMediaBar } from "@components";

import { AiFillFilePdf } from "react-icons/ai";
import { BiCodeCurly } from "react-icons/bi";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";

const ComingSoonPage = () => {
    return (
        <Container fluid>
            <Stack>
                <Container>
                    <Title align="center">
                        {"hey, i'm nausher"}
                    </Title>
                </Container>

                <MantineTimeline active={3} bulletSize={40} lineWidth={5} color="purple">
                    <MantineTimeline.Item
                        title="New Website"
                        bullet={<BiCodeCurly size={20} />}
                    >
                        <Text color="dimmed" size="m">
                            {"My current website is currently under construction! Hopefully it comes out in the next few months!"}
                        </Text>

                        <Text size="xs" mt={4}>
                            {"You can follow the progress "}<a href="/test"target="_blank">{"here!"}</a>{", although it might be kinda brokey at times."}
                        </Text>
                    </MantineTimeline.Item>

                    <MantineTimeline.Item
                        title="Old Website"
                        bullet={<BsArrowCounterclockwise size={20} />}
                    >
                        <Text color="dimmed" size="m">
                            {"My old website is quite outdated, and slightly broken."}
                        </Text>

                        <Text size="xs" mt={4}>
                            {"if you are interested, you can find it "}<a href="/old/index.html" target="_blank">{"here!"}</a>
                        </Text>
                    </MantineTimeline.Item>

                    <MantineTimeline.Item
                        title="Resume"
                        bullet={<AiFillFilePdf size={20} />}
                    >
                        <Text color="dimmed" size="m">
                            {"My resume is here cause yano - boring career-grind stuff."}
                        </Text>

                        <Text size="xs" mt={4}>
                            {"boring PDF file can be found "}<a href="/resume.pdf" target="_blank">{"here."}</a>
                        </Text>
                    </MantineTimeline.Item>

                    <MantineTimeline.Item
                        title="Socials"
                        bullet={<IoShareSocialOutline size={20}/>}
                    >
                        <Text color="dimmed" size="m">
                            {"Feel free to add me on any of my socials linked below - i love to chat!"}
                        </Text>

                        <Text size="xs" mt={4}>
                            {"i need friends plz add"}
                        </Text>
                    </MantineTimeline.Item>
                </MantineTimeline>

                <Divider />
                <SocialMediaBar/>
            </Stack>
        </Container>
    );
};

export { ComingSoonPage };
