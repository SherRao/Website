import React from 'react';
import Styled from 'styled-components';

export default function Section({
    id = "section",
    children
}) {
    const StyledDiv = Styled.div`
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
    `;

    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}