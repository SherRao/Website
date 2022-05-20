import React from 'react';
import Styled from 'styled-components';

const StyledDiv = Styled.div`
    display: flex;

    flex-direction: column;
    
    align-items: center;
    justify-content: center;
    item-width: 100%;
    gap: 0px;
`;

export default function HorizontalSection({
    id = "horizontalSection",
    children,
}) {
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}