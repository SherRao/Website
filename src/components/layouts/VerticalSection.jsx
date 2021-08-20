import React from "react";
import Styled from "styled-components";

export default function VerticalSection({children, background, id="verticalSection"}) {
    const StyledSection = Styled.section`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: ${background};
    `;

    return (
        <StyledSection id={id}>
            {children}
        </StyledSection>
    );
}