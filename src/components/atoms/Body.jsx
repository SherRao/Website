import React from "react";
import Styled from "styled-components";

export default function Body({ text, id = "body" }) {
    return (
        <p id={id}>
            {text}
        </p>
    );
}