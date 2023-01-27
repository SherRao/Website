import React from "react";
import Lottie from "lottie-react";
import { motion as Motion } from "framer-motion";
import { Stack } from "@mantine/core";

import loadingAnimationData from "@assets/loading.json";
import BackgroundAnimation from "@assets/Shapes.svg";

const LoadingDiv = () => (
    <Motion.Div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <Stack>
            <Lottie animationData={loadingAnimationData} loop={false} />
        </Stack>
    </Motion.Div>
);

export { LoadingDiv };
