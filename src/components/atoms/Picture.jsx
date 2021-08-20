import React from 'react';
import Styled from 'styled-components';

const StyledImage = Styled.img`
    transition: all 0.2s ease;
    filter: blur(0px) brightness(1);

    :hover {
        transition: all 0.2s ease;
        filter: blur(5px) brightness(0.75);
    }
`;

export default function Title({src, link="#", alt="A random image", target="_blank", id="picture", ...props}) {
    return (
        <a href={link} target={target} id={id}>
            <StyledImage src={src} alt={alt}/>
        </a>
    );
}