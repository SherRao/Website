import React, { useRef, useState } from "react";
import { Router } from "@src/Router";

import Styled from "styled-components";
import { Alert, AppShell, Burger, Center, Container, MantineProvider, Header, MediaQuery, Navbar, Space, Text, Title, useMantineTheme } from '@mantine/core';
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function AppContainer(props) {
    return ( <Router /> );
}