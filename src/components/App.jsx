import React from "react";
import { Spacer, SocialMediaBar } from "@components";
import TextTransition, { presets } from "react-text-transition";
import TextLoop from "react-text-loop";

const programmingLanguagesExt = [".js", ".ts", ".css", ".html", ".java", ".py", ".c", ".cpp", ".rb"];
const programmingLanguagesJsx = programmingLanguagesExt.map((lang, i) =>
    <span key={lang}>
        {i == programmingLanguagesExt.length - 1 ?
            <>{"and "}<code>{lang}</code></>
            :
            <><code>{lang}</code>{", "}</>
        }
    </span>
);

const jobs = ["SOFTWARE ENGINEER", "PROJECT MANAGER", "ENTREPRENEUR"];

const App = () => {
    const [index, setIndex] = React.useState(0);
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex(index => index + 1);
        }, 1000);

        return () => clearTimeout(intervalId);

    } , []);

    return (
        <AppContainer>
            <ContentContainer>
                <div style={{marginRight: "auto"}}>
                    <span>
                        <h1>{"Hey, I'm "}<strong>{"Nausher Rao"}</strong>{"! 👋"}</h1>
                    </span>

                    <TextLoop interval={1000} springConfig={{ stiffness: 120, damping: 12 }}>
                        {jobs.map(
                            (job, i) => <h1 key={i} style={{padding: "0.5em 0"}}>{job}</h1>
                        )}
                    </TextLoop>
                </div>

                <p>
                    {"I've been programming since I was 9 years old (big nerd... I know). I love to keep myself busy (maybe a bit too busy) with a bunch of extra curriculars and work stuff. Some of the programming languages I've been using daily recently include: "}
                </p>
                <p>
                    {programmingLanguagesJsx}
                </p>

                <Spacer h={50} />

                <p style={{textAlign: "center"}}>
                    {"This website is a work in progress, so please check back later. In the meantime, feel free to hit me up on any of my socials, or check out my old site or resume below! 🙃"}
                </p>
                <SocialMediaBar />
            </ContentContainer>
        </AppContainer>
    );
};

const AppContainer = ({children}) => (
    <div className="app-container">
        {children}
    </div>
);

const ContentContainer = ({children}) => (
    <div className="content-container">
        {children}
    </div>
);

export { App };
