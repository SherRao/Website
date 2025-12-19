import { image } from "motion/react-client";
import React from "react";

export type PersonalData = {
    name: string;
    email: string;
    phone: string;
    location: string;
    country: string;
};

export type Education = {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
};

export type Experience = {
    company: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
};

export type Skills = {
    name: string;
    level: string;
};

export type Project = {
    name: string;
    description: string;
    image: string;
    url: string;
};

export const personalData: PersonalData = {
    name: "Nausher Rao",
    email: "nausher@konfer.ca",
    phone: "+1 (437) 996 8786",
    location: "Waterloo, ON",
    country: "Canada",
};

export const educationData: Education[] = [
    { school: "Wilfrid Laurier University", degree: "BSc Computer Science", startDate: "Sept. 2019", endDate: "Apr. 2024" },
    { school: "Wilfrid Laurier University", degree: "Applied Mathematics Option", startDate: "Sept. 2019", endDate: "Apr. 2024" }
];

export const skillsData: Skills[] = [
    { name: "", level: "" }
];

export const projectsData: Project[] = [
    { name: "", description: "", image: "", url: "" }
];