import React from "react";
import Lottie from "lottie-react";
import { Notification } from "@assets";

const getSourceCodeNotification = () => (
    {
        title: "Want to look at the source code for my website?",
        message: <span>You can find it <a href='https://github.com/SherRao/Website' target="_blank" rel="noreferrer">here!</a></span>,
        color: "black"
        // icon: <Lottie animationData={Notification} loop={false} />
    }
);

const getOSNotification = (osMessage) => {
    return {
        title: `Hey there ${osMessage}!`,
        message: "I'm glad you're here. 😊",
        color: "black"
        // icon: <Lottie animationData={Notification} loop={false} />
    };
};

const getErrorNotification = () => (
    {
        title: "An error has occured somewhere on the website!",
        message: "Please refresh the site.",
        color: "black"
        // icon: <Lottie animationData={Notification} loop={false} />

    }
);

const getYoureALoserForUsingLightThemeNotification = () => (
    {
        title: "You're a loser for using light mode!",
        message: "You should be ashamed of yourself.",
        color: "black"
        // icon: <Lottie animationData={Notification} loop={false} />
    }
);

export { getSourceCodeNotification, getOSNotification, getErrorNotification, getYoureALoserForUsingLightThemeNotification };
