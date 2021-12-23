import React from 'react';
import Styled from 'styled-components';

const StyledDiv = Styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    
    background-color: ${props => props.backgroundColor};
    background-image: url(${props => props.backgroundUrl});
`;

export default function HorizontalSection({
    id = "horizontalSection",
    children,
    backgroundColor = "white",  
    backgroundUrl = null,
}) {

    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}