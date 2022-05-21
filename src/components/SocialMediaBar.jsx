import React from "react";
import { Center, Grid, ActionIcon } from "@mantine/core";
import { AiFillInstagram, AiFillFilePdf, AiFillGithub, AiFillLinkedin } from "react-icons/ai";

export default function SocialMediaBar() {
    return (
        <Center>
            <Grid justify="center" align="center" grow>
                <Grid.Col span={3}>
                    <a href="https://instagram.com/sherrao15" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="purple">
                            <AiFillInstagram size={100}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={3}>
                    <a href="https://linkedin.com/in/nausherrao" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="purple">
                            <AiFillLinkedin size={100}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={3}>
                    <a href="https://github.com/sherrao" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="purple">
                            <AiFillGithub size={100}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>
                
                <Grid.Col span={3}>
                    <a href="/resume.pdf" target="_blank" rel="next">
                        <ActionIcon size="xl" color="purple">
                            <AiFillFilePdf size={100}/>
                        </ActionIcon>
                    </a>
                </Grid.Col>
            </Grid>
        </Center>
    );
}
