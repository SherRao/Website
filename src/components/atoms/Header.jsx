import React from "react";
import Styled from "styled-components";

const StyledHeader = Styled.h2`
    font-size: ${props => props.theme.fontSizes.header};
    font-family: ${props => props.theme.fonts.header};
    font-weight: 400;

    @media (min-width: 768px) {
        
    }

    @media (min-width: 1024px) {
        
    }
`;

export default function Header({text, id="header"}) {
    return (
        <StyledHeader id={id}>
            {text}
        </StyledHeader>
    );
}