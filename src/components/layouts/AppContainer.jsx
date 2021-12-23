import React from "react";
import Styled from "styled-components";

export default function AppContainer({
    id = "app",
    children,
}) {
    const StyledDiv = Styled.div`
        width: 100vw;
        height: 100vh;
        display: block;
    `;

    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}