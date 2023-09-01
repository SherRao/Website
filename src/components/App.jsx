import React from "react";
// import ReactFullpage from "@fullpage/react-fullpage";
import { Spacer, SocialMediaBar } from "@components";

const langs = [".js", ".ts", ".css", ".html", ".java", ".py", ".c", ".cpp", ".rb"];

// const App = ({ state, fullpageApi }) => {
const App = () => {
    const progLangs = langs.map((lang, i) =>
        <span key={lang}>
            {i == langs.length - 1 ?
                <>{"and "}<code>{lang}</code></>
                :
                <><code>{lang}</code>{", "}</>
            }
        </span>
    );

    return (
        <AppContainer>
            <ContentContainer>
                {/* <div className="section page"> */}
                <span>
                    <h1>{"Hey, I'm "}<strong>{"Nausher Rao"}</strong>{"! 👋"}</h1>
                </span>
                <p>
                    {"I'm a 5th-year university student and have been programming since I was 9 years old (big nerd... I know). I love to keep myself busy (maybe a bit too busy) with a bunch of extra curriculars and work stuff. Some of the programming languages I've been using daily recently include: "}
                </p>
                <p>
                    {progLangs}
                </p>

                <Spacer h={50} />

                <p>
                    {"Feel free to hit me up on any of my socials, or check out my old site or resume below! 🙃"}
                </p>
                <SocialMediaBar />
                {/* </div> */}

                {/* <div className="section page" onScroll={() => fullpageApi.moveSectionDown()}>
                <h1>Section 1</h1>
                </div>

                <div className="section page" onScroll={() => fullpageApi.moveSectionDown()}>
                <h1>Section 2</h1>
                </div>

                <div className="section page" onScroll={() => fullpageApi.moveSectionDown()}>
                <h1>Section 3dasdsad</h1>
                </div>

                <div className="section page" onScroll={() => fullpageApi.moveSectionDown()}>
                <h1>Section 4</h1>
                </div>

                <div className="section page" onScroll={() => fullpageApi.moveSectionDown()}>
                <h1>Section 5</h1>
            </div> */}
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
