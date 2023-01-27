import React from "react";
import { motion as Motion, Reorder } from "framer-motion";

import { Center, Grid, ActionIcon } from "@mantine/core";
import { AiFillInstagram, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

const SocialMediaBar = () => {
    const [items, setItems] = React.useState([0, 1, 2, 3]);

    return (
        <Center>
            {/* <Reorder.Group axis="x" values={items} onReorder={setItems} as="a"> */}
            <Grid justify="center" align="center" grow>
                {/* {/*<Reorder.Item key={0} value={0}>*/}
                <Grid.Col span={3}>
                    <a href="https://instagram.com/sherrao15" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <AiFillInstagram size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
                {/* {/*</Reorder.Item>*/}

                {/*<Reorder.Item key={1} value={1}>*/}
                <Grid.Col span={3}>
                    <a href="https://linkedin.com/in/nausherrao" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <AiFillLinkedin size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
                {/*</Reorder.Item>*/}

                {/*<Reorder.Item key={2} value={2}>*/}
                <Grid.Col span={3}>
                    <a href="https://github.com/sherrao" target="_blank" rel="external noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <AiFillGithub size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
                {/*</Reorder.Item>*/}

                {/*<Reorder.Item key={2} value={2}>*/}
                <Grid.Col span={3}>
                    <a href="https://discord.com/users/190984801929396224" target="_blank" rel="next noreferrer">
                        <ActionIcon size="xl" color="grey">
                            <FaDiscord size={100} />
                        </ActionIcon>
                    </a>
                </Grid.Col>
                {/*</Reorder.Item>*/}

            </Grid>
            {/* </Reorder.Group> */}
        </Center>
    );
};

export { SocialMediaBar };
