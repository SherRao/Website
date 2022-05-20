import React from 'react';
import Styled from 'styled-components';

export default function Title({ text, id = "title" }) {
    return (
        <h1 id={id}>
            {text}
        </h1>
    );
}