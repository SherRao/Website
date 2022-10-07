import React from "react";
import { ActionIcon, Center, Stack, Text, Timeline as MantineTimeline, Title } from "@mantine/core";
import { FaBabyCarriage } from "react-icons/fa";

const Timeline = () => {
    return (
        <MantineTimeline active={1} bulletSize={40} lineWidth={5}>
            <MantineTimeline.Item
                bullet={
                    <FaBabyCarriage size={20} />
                }
                title="Created My First Batch Game"
            >
                <Text color="dimmed" size="xl">
                    {"I was a big nerd when I was younger - I played video games a lot back then, and wanted to see if I could make something simple."}
                </Text>
                <Text size="xs" mt={4}>Sometime in 2008</Text>
            </MantineTimeline.Item>

            <MantineTimeline.Item bullet={<FaBabyCarriage size={12} />} title="Commits">
                <Text color="dimmed" size="sm">You&apos;ve pushed 23 commits to<Text variant="link" component="span" inherit>fix-notifications branch</Text></Text>
                <Text size="xs" mt={4}>52 minutes ago</Text>
            </MantineTimeline.Item>

            <MantineTimeline.Item title="Pull request" bullet={<FaBabyCarriage size={12} />} lineVariant="dashed">
                <Text color="dimmed" size="sm">You&apos;ve submitted a pull request<Text variant="link" component="span" inherit>Fix incorrect notification message (#187)</Text></Text>
                <Text size="xs" mt={4}>34 minutes ago</Text>
            </MantineTimeline.Item>

            <MantineTimeline.Item title="Code review" bullet={<FaBabyCarriage size={12} />}>
                <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Robert Gluesticker</Text> left a code review on your pull request</Text>
                <Text size="xs" mt={4}>12 minutes ago</Text>
            </MantineTimeline.Item>
        </MantineTimeline>
    );
};

export { Timeline };
