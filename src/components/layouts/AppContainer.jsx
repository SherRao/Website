import React from "react";
import Styled from "styled-components";

const StyledDiv = Styled.div`
    width: 100vw;
    height: 100vh;
`;

export default function AppContainer({children, id="app"}) {
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}