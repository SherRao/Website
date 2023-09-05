import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import { Spacer, SocialMediaBar } from "@components";

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

const SEL = "custom-section";
const SECTION_SEL = `.${SEL}`;

const App = () => {
    return (
        <ReactFullpage
            debug
            sectionSelector={SECTION_SEL}
            // anchors={["firstPage", "secondPage", "thirdPage"]}
            licenseKey="gplv3-license"
            scrollingSpeed={1000}
            render={() => (
                <ReactFullpage.Wrapper>
                    <div className="custom-section">
                        <AppContainer>
                            <ContentContainer>
                                <span>
                                    <h1>{"Hey, I'm "}<strong>{"Nausher Rao"}</strong>{"! 👋"}</h1>
                                </span>
                                <p>
                                    {"I'm a 5th-year university student and have been programming since I was 9 years old (big nerd... I know). I love to keep myself busy (maybe a bit too busy) with a bunch of extra curriculars and work stuff. Some of the programming languages I've been using daily recently include: "}
                                </p>
                                <p>
                                    {programmingLanguagesJsx}
                                </p>

                                <Spacer h={50} />

                                <p>
                                    {"Feel free to hit me up on any of my socials, or check out my old site or resume below! 🙃"}
                                </p>
                                <SocialMediaBar />
                            </ContentContainer>
                        </AppContainer>
                    </div>

                    <div className="custom-section" style={{width: "100vw", height: "100vh", backgroundColor: "red"}}>
                        <h1>s2</h1>
                    </div>

                    <div className="custom-section" style={{width: "100vw", height: "100vh", backgroundColor: "blue"}}>
                        <h1>s3</h1>
                    </div>


                </ReactFullpage.Wrapper>
            )}
        />
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
