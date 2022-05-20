import React from 'react';
import Styled from 'styled-components';

const StyledDiv = Styled.div`
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

export default function Section({
    id = "section",
    children
}) {
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}