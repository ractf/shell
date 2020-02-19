import React, { useContext, useEffect, useState } from "react";
import CountUp from "react-countup";

import Page from "./bases/Page";

import { apiContext, apiEndpoints, Spinner, useApi, Link } from "ractf";

import "./HomePage.scss";


const Clouds = () => {
    let loc = [];
    for (let i = 0; i < 5; i++)
        loc.push([Math.random() * 1000, Math.random() * 50, Math.random()]);
    const [location, setLocation] = useState(loc);

    const requestRef = React.useRef();
    const previousTimeRef = React.useRef();
  
    const animate = time => {
        if ((typeof previousTimeRef.current) !== "undefined") {
            const deltaTime = time - previousTimeRef.current;

            for (let i in location) {
                location[i][0] = location[i][0] + location[i][2] * deltaTime / 20;
                if (location[i][0] > 1000)
                    location[i] = [-100, Math.random() * 50, Math.random()];
            }
            setLocation([...location]);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };
      
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <svg className={"cloudsOverlay"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 150">
        <defs><style>{".cls-1{fill:#444259;}.cls-2{fill:#33314b;}"}</style></defs>
        <path transform={"translate(0 54.42)"} className="cls-1" d={
            "M0,0V95.58H95.46l5.88-15.24A15.4,15.4,0,0,0,116,65.22c0-8.34-7.08-15.12-15.78-15.12a16.07,16.07,0,0,0-13" +
            ".38,7.08C82.74,54.54,76.86,53,70.74,53,63.06,53,56,55.38,52.08,59.1c-2.1-4.92-7.5-8.16-13.5-8.16a13.69,1" +
            "3.69,0,0,0-2.7.24A12.85,12.85,0,0,0,29.7,40.86C29.58,32,22.32,24.66,13,23.94a7.35,7.35,0,0,0,.12-1.14,6." +
            "75,6.75,0,0,0-2.82-5.34,13.42,13.42,0,0,0,.66-4C11,7.2,6.48,1.74,0,0Z"}/>
        <path transform={"translate(0 54.42)"} className="cls-2" d={
            "M183,55.56c-12.36,0-23.52,6.9-28.5,17.64a32.22,32.22,0,0,0-24.36-10.8c-12.18,0-23.28,6.54-28.38,16.74a16" +
            ".42,16.42,0,0,0-3.84-.48A16.13,16.13,0,0,0,87.18,82.8,28.4,28.4,0,0,0,69.9,77.16c-12.72,0-23.58,7.8-25.6" +
            "2,18.42h309.9v-.24c0-5.64-10.26-10.26-22.92-10.26a55.38,55.38,0,0,0-9.6,1c-2.82-2.22-7.26-3.6-12-3.6a22." +
            "69,22.69,0,0,0-9.24,1.92c-4.2-4.8-13.44-8-23.7-8a42.15,42.15,0,0,0-17.34,3.48,23.64,23.64,0,0,0-33.84-1." +
            "62,11.59,11.59,0,0,0-7.74-3,11.78,11.78,0,0,0-5.1,1.2c-4-12.36-16-20.88-29.7-20.88Z"}/>

        <path transform={"translate(" + location[0][0] + " " + location[0][1] + ")"} className="cls-1" d={
            "M37.5,0A10.82,10.82,0,0,0,26.58,9.3a13.22,13.22,0,0,0-2.16-.24,9.91,9.91,0,0,0-9.72,7,14.71,14.71,0,0,0-" +
            "1.62-.12C5.88,15.9,0,20.64,0,26.52S5.88,37.14,13.08,37.14h59.1c6.78,0,12.3-3.48,12.3-7.8,0-3.36-3.42-6.3" +
            "-8.4-7.38a4.85,4.85,0,0,0,.06-1c0-4.26-4.8-7.74-10.8-7.74a15.91,15.91,0,0,0-4.44.66C59.28,11,55.5,9.06,5" +
            "1.36,9.06a12,12,0,0,0-2.94.36A10.78,10.78,0,0,0,37.5,0Z"}/>

        <path transform={"translate(" + location[1][0] + " " + location[1][1] + ")"} className="cls-1" d={
            "M22.14,0C16.68,0,12.06,3.72,11.4,8.7,5,9.12,0,13.74,0,19.32c0,5.82,5.52,10.56,12.3,10.56H53.58C61,29.88," +
            "67,26.28,67,21.78s-5.7-8-12.9-8.16c0-.18.06-.36.06-.6,0-5.34-6.66-9.66-14.82-9.66a21.07,21.07,0,0,0-7.86" +
            ",1.5A11.19,11.19,0,0,0,22.14,0Z"}/>
        <path transform={"translate(" + location[2][0] + " " + location[2][1] + ")"} className="cls-1" d={
            "M62.16,0A7,7,0,0,0,56.4,2.82a11.71,11.71,0,0,0-3.24-.42A12.31,12.31,0,0,0,47.1,4a11.14,11.14,0,0,0-6.66-" +
            "2.1,10.57,10.57,0,0,0-8.94,4.5A12.83,12.83,0,0,0,26,5.16c-5.34,0-9.66,3-9.66,6.66a6.61,6.61,0,0,0,.12,1." +
            "08,23.45,23.45,0,0,0-2.94-.18C6.06,12.72,0,16,0,20s6.06,7.2,13.5,7.2H73.56a6.36,6.36,0,0,0,6.54-6.12,6.2" +
            "1,6.21,0,0,0-5-6,6.23,6.23,0,0,0,.66-2.76,6.72,6.72,0,0,0-6.66-6.42A6.8,6.8,0,0,0,62.16,0Z"}/>
        <path transform={"translate(" + location[3][0] + " " + location[3][1] + ")"} className="cls-1" d={
            "M34.5,0a7.58,7.58,0,0,0-7.32,5.1A8.87,8.87,0,0,0,22.92,4a8.71,8.71,0,0,0-8.7,8.7v.24a13.93,13.93,0,0,0-3" +
            ".12-.42C5,12.48,0,16.68,0,21.9s5,9.36,11.1,9.36H64.38c4.44,0,8-2.76,8-6.18S68.82,19,64.38,19a10,10,0,0,0" +
            "-3.72.72C59.4,16.5,55.8,14.4,51.72,14.4H51.6a4.45,4.45,0,0,0,.3-1.5c0-2.94-3.48-5.34-7.74-5.34A8.83,8.83" +
            ",0,0,0,42,7.8,3.69,3.69,0,0,0,42.06,7,7.31,7.31,0,0,0,34.5,0Z"}/>
        <path transform={"translate(" + location[4][0] + " " + location[4][1] + ")"} className="cls-1" d={
            "M33.72,0a8,8,0,0,0-7,3.72c-.66-.06-1.32-.12-2-.12-6.18,0-11.16,2.94-11.16,6.54v.12a7.08,7.08,0,0,0-5,2.7" +
            ",8.83,8.83,0,0,0-2.16-.24c-3.54,0-6.42,2-6.42,4.62S2.88,22,6.42,22h61.2c3.3,0,6.06-1.92,6.06-4.26s-2.76-" +
            "4.26-6.06-4.26a2.92,2.92,0,0,0-.72.06c-.54-2.46-3.6-4.2-7.14-4.2a8.8,8.8,0,0,0-5.1,1.44,7,7,0,0,0-4.8-1." +
            "86,1.17,1.17,0,0,0-.42.06A6.22,6.22,0,0,0,43.56,5.1a6.63,6.63,0,0,0-2.22.36C40.62,2.28,37.44,0,33.72,0Z"}/>
    </svg>;
};


export default () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const [stats] = useApi("/stats/stats");

    let chalCount = 0;
    if (api.challenges)
        api.challenges.forEach(i => {
            if (i.challenges)
                chalCount += i.challenges.length;
        });
    
    return <Page vCentre>
        Welcome to RACTF
    </Page>;

    return <Page vCentre>
        <div className={"homeLead"}>Welcome to RACTF</div>
        <div className={"cardRow"}>
            {api.user ? <>
                <Link className={"cardTypeLink"} to={"/campaign"}>
                    <div className={"cardTitle"}>Get started on challenges</div>
                    <div>
                        With <CountUp end={chalCount}/> challenges, there's something for everyone!
                    </div>
                </Link>
                <Link className={"cardTypeLink"} to={"/leaderboard"}>
                    <div className={"cardTitle"}>Check the leaderboard</div>
                    <div>
                        Compare yourself to others, or just see how everyone is getting on!
                    </div>
                </Link>
            </> : <>
                    {endpoints.configGet("login", true) &&
                        <Link className={"cardTypeLink"} to={"/login"}>
                            <div className={"cardTitle"}>Login</div>
                            <div>
                                Been here before? Login to get the most out of the site!
                    </div>
                        </Link>}
                    {endpoints.configGet("registration", true) &&
                        <Link className={"cardTypeLink"} to={"/register"}>
                            <div className={"cardTitle"}>Register</div>
                            <div>
                                If you want to solve challenges you're going to need to get yourself an account
                    </div>
                        </Link>}
                </>}
        </div>
        <div className={"cardRow"}>
            <Link className={"cardTypeLink"} to={"/users"}>
                {stats ? <>
                    <div className={"cardTitle"}><CountUp end={stats.user_count}/> Users...</div>
                    <div>
                        ...have solved challenges <CountUp end={stats.solve_count}/> times!
                    </div>
                </> : <Spinner />}
            </Link>
            <Link className={"cardTypeLink"} to={"/teams"}>
                {stats ? <>
                    <div className={"cardTitle"}><CountUp end={stats.user_count}/> Teams...</div>
                    <div>
                        ...have an average of <CountUp end={stats.avg_members} decimals={1}/> members each!
                    </div>
                </> : <Spinner />}
            </Link>
            <Link className={"cardTypeLink"} to={"/privacy"}>
                <div className={"cardTitle"}>420 people...</div>
                <div>
                    ...have viewed the privacy policy!
                </div>
            </Link>
        </div>
        {api.user && api.user.is_staff &&
            <div className={"cardRow"}>
                <Link className={"cardTypeLink"} to={"/admin"}>
                    <div className={"cardTitle"}>Admin Panel</div>
                    <div>
                        Look at you, you fancy admin. Go do your admin things, why don't you. smh.
                    </div>
                </Link>
            </div>
        }

        <Clouds />
    </Page>;
};
