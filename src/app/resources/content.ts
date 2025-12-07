import React from "react";

export type PersonalData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export type Education = {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

export type Experience = {
    company: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export type Skills = {
    name: string;
    level: string;
}

export type Projects = {
    name: string;
    description: string;
    image: string;
    url: string;
}