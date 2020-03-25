import React, { useContext } from "react";

import Page from "./bases/Page";

import { apiContext, Link } from "ractf";

import "./HomePage.scss";


export default () => {
    const api = useContext(apiContext);

    return <Page noPad selfContained>
        <div className="fancySite">
            <div className="primary">
                <div className="inner">
                    <div className="top">
                        <div className="sub">We're back for 2020...</div>
                        <div className="cta">Really Awesome CTF</div>
                        <div className="sub sub2">...and it's going to be massive!</div>
                        {api.user ? <>
                            <Link to="/campaign" className="cts">Let's Go!</Link>
                        </> : <>
                                <Link to="/login" className="cts">Login</Link>
                                <Link to="/register" className="cts">Sign Up</Link>
                            </>}
                    </div>
                </div>
            </div>

            <div className="secondary">
                <div className="inner">
                    <h1>What <i>is</i> RACTF?</h1>
                    <p>
                        RACTF is a student-run, extensible, open-source, capture-the-flag event.
            </p>
                    <p>
                        In more human terms, we run a set of cyber-security challenges, of many
                        different varieties, with many difficulty levels, for the sole purposes of
                        having fun and learning new skills.
            </p>
                    <h1>Hold on. What's a capture-the-flag?</h1>
                    <p>
                        In a capture-the-flag event, unlike what might come to mind, you don't all
                        meet up and run around in a field (as fun as that would be). Instead, a
                        number of challenges are published, each with a hidden piece of text within
                        it, the "flag". Your aim is to solve the challenges, by whatever means you
                        want, and find this "flag". By presenting this flag to the site, you are
                        awarded a number of points based off how hard the challenge is considered.
            </p>
                    <h1>What can I expect?</h1>
                    <p style={{ marginBottom: 8 }}>
                        As a team, we have rebuilt the entire platform this year! Not only can you
                        expect the shinest, brand-spanking new platform, written from the ground up
                        to perform amazingly, you can be guaranteed that you can take part.
            </p>
                    <p>
                        Instead of plunging into the deep end, we have challenges starting with basic
                        concepts, allowing participants to build core skills, which transition into more
                        complex and advanced challenges, ensuring that everyone has something that
                        they can enjoy.
            </p>
                    <p>
                        We have challenges in many different aspects of cyber-security:
            </p>
                    <ul>
                        <li>Open-Source Intelligence</li>
                        <li>Cryptography</li>
                        <li>Website Vulnerabilities</li>
                        <li>Binary Exploitation</li>
                        <li>Linux Security</li>
                        <li>...and so much more!</li>
                    </ul>
                    <h1>Who's behind this?</h1>
                    <p>
                        We are a small team of students, with a shared interest in cyber-security. We
                        have all worked on the platform in our free time, and are confident in its
                        ability to give you an amazing experience.
            </p>
                </div>
            </div>
        </div>
    </Page>;
};
