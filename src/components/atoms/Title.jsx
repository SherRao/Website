import React from 'react';
import Styled from 'styled-components';

const StyledHeader = Styled.h1`
    font-size: ${props => props.theme.fontSizes.title};
    font-family: ${props => props.theme.fonts.title};
    font-weight: 600;

    @media (min-width: 768px) {
    
    }

    @media (min-width: 1024px) {
    
    }
`;

export default function Title({text, id="title"}) {
    return (
        <StyledHeader id={id}>
            {text}
        </StyledHeader>
    );
}