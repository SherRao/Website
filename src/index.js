import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { AppContainer } from "@layouts";
import { Router } from "./Router";
import { Theme } from "./Theme";
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from "@react-three/drei";

ReactDOM.render(
    <AppContainer />,
    document.getElementById("root"),
);