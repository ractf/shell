import React from "react";

import { registerPlugin } from "ractf";


import Section from "./components/Section";
import Challenge from "./components/Challenge";


const JeopardyChallenges = ({ challenges }) => {
    let sections = [];

    //challenges.cats.forEach((cat, n) => {
    let cat = challenges, n=1;

        let catChals = [];
        cat.chals.forEach((chal, n) => {
            catChals.push(
                <Challenge key={n} name={chal.name} done={chal.done} points={chal.base_score} />
            );
        });
        sections.push(
            <Section key={n} title={cat.name}>
                {catChals}
            </Section>
        );
    //});

    return sections;
};


export default () => {
    registerPlugin("categoryType", "jeopardy", { component: JeopardyChallenges });
};
