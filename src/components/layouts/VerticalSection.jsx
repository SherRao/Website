import React from "react";
import Styled from "styled-components";

const StyledDiv = Styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export default function VerticalSection({
    id = "verticalSection",
    children,
}) {
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}