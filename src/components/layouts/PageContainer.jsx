import React from "react";
import Styled from "styled-components";

const StyledDiv = Styled.div`
    width: 100%;
    height: 100%;
    display: flex;

    flex-direction: row;
    align-items: center;
    justify-content: center;
    item-width: 100%;
`;

export default function PageContainer({
    id = "page",
    children
}) {
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}