import React from 'react';
import Styled from 'styled-components';

const StyledSection = Styled.section`
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;

`;

export default function Section({children, id="section"}) {
    return (
        <StyledSection id={id}>
            {children}
        </StyledSection>
    );
}