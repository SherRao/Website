import React from 'react';
import Styled from 'styled-components';

export default function HorizontalSection({children, background, id="horizontalSection"}) {
    const StyledSection = Styled.section`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        
        background: ${background};
    `;

    return (
        <StyledSection id={id}>
            {children}
        </StyledSection>
    );
}