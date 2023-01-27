import React from "react";

const getSourceCodeNotification = () => (
    {
        title: "Want to look at the source code for my website?",
        message: <span>You can find it <a href='https://github.com/SherRao/Website' target="_blank" rel="noreferrer">here!</a></span>
    }
);

const getOSNotification = (osMessage) => {
    return {
        title: `Hey there ${osMessage}!`,
        message: "I'm glad you're here. 😊"
    };
};

const getErrorNotification = () => (
    {
        title: "An error has occured somewhere on the website!",
        message: "Please refresh the site."
    }
);



export { getSourceCodeNotification, getOSNotification, getErrorNotification };
