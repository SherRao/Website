import React from "react";
import Lottie from "lottie-react";
import { motion as Motion } from "framer-motion";

import { Center } from "@mantine/core";
import loadingAnimationData from "@assets/loading.json";

const LoadingSpinner = () => (
    <Center style={{width: "100%", height: "100%"}}>
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Lottie animationData={loadingAnimationData} loop={false} />
        </Motion.div>
    </Center>
);

export { LoadingSpinner };
