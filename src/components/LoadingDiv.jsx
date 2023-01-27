import React from "react";
import Lottie from "lottie-react";
import { Stack } from "@mantine/core";

import loadingAnimationData from "@assets/loading.json";
import BackgroundAnimation from "@assets/Shapes.svg";

const LoadingDiv = () => (
    <Stack>
        <Lottie animationData={loadingAnimationData} loop={true} />
    </Stack>
);

export { LoadingDiv };
