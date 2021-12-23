import React from "react";
import Styled from "styled-components";

export default function PageContainer({
    id = "page",
    children
}) {
    const StyledDiv = Styled.div`
        width: 100%;
        height: 100%;
        display: block;
    `;
    
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}