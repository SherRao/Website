import React from "react";
import { Center, Grid, ActionIcon } from "@mantine/core";
import { AiFillInstagram, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

const SocialMediaBar = () => {
    return (
        <Center>
            <Grid justify="center" align="center" grow>
                <Grid.Col span={3}>
                    <a href="https://instagram.com/sherrao15" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <AiFillInstagram size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={3}>
                    <a href="https://linkedin.com/in/nausherrao" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <AiFillLinkedin size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={3}>
                    <a href="https://github.com/sherrao" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <AiFillGithub size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>

                <Grid.Col span={3}>
                    <a href="https://discord.com/users/190984801929396224" target="_blank" rel="next noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <FaDiscord size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
            </Grid>
        </Center>
    );
};

export { SocialMediaBar };
