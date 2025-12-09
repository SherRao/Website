"use client";

import React from "react";
import Image from "next/image";

interface CardProps {
    images?: typeof Image[];
    title?: string;
    description?: string;
};

const Card = ({ images, title, description }: CardProps) => {


    return (
        <>
        </>
    );
};

export default Card;