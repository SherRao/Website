import React from "react";
import Styled from "styled-components";

export default function VerticalSection({
    id = "verticalSection",
    children,
    backgroundColor = "white",
    backgroundUrl = null,
}) {
    const StyledDiv = Styled.div`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        
        background-color: ${backgroundColor};
        background-image: url(${backgroundUrl});
    `;

    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}