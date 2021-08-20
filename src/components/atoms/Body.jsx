import React from 'react';
import Styled from 'styled-components';

const StyledText = Styled.p`
    font-size: ${props => props.theme.fontSizes.body};
    font-family: ${props => props.theme.fonts.body};
    font-weight: 200;

    @media (min-width: 768px) {
        
    }

    @media (min-width: 1024px) {
        
    }
`;

export default function Body({text, id="body"}) {
    return (
        <StyledText id={id}>
            {text}
        </StyledText>
    );
}