import React from "react";

export type PersonalData = {
    name: string;
    email: string;
    phone: string;
    location: string;
    country: string;
}

export type Education = {
    school: string;
    degree: string;
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

export const personalData: PersonalData = {
    name: "Nausher Rao",
    email: "nausher@konfer.ca",
    phone: "+1 (437) 996 8786",
    location: "Waterloo, ON",
    country: "Canada",
};

export const education: Education[] = [
    { school: "Wilfrid Laurier University", degree: "BSc Computer Science", startDate: "", endDate: "" },
    { school: "Wilfrid Laurier University", degree: "Applied Mathematics Option", startDate: "", endDate: "" }
];