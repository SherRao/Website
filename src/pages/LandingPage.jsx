import React from 'react';
import Styled from 'styled-components';

import { PageContainer, HorizontalSection, VerticalSection } from "@layouts";
import { Title, Header, Body } from "@atoms";

export default function LandingPage({theme}) {
    return (
        <PageContainer>
            <svg src="./bg.svg"/>

            <HorizontalSection id="hero1">
                <Title text="Hey, my name is Nausher"/>
                <Header text="this is a header" />
                <Body text="this is a body" />
            </HorizontalSection>

            <VerticalSection id="hero2" background="red">
                <Title text="Hey, my name is Nausher"/>
                <Header text="this is a header" />
                <Body text="this is a body" />
            </VerticalSection>
        </PageContainer>
    );
}