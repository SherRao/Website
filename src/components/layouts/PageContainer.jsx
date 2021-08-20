import React from "react";
import Styled from "styled-components";

const StyledDiv = Styled.div`
    width: 100%;
    height: 100%;
    display: block;

    @media (min-width: 768px) {
        
    }

    @media (min-width: 1024px) {
        
    }
`;

export default function PageContainer({children, id="page"}) {
    return (
        <StyledDiv id={id}>
            {children}
        </StyledDiv>
    );
}