import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Page from "./bases/Page";

import { apiContext } from "ractf";

import "./HomePage.scss";


export default () => {
    const api = useContext(apiContext);

    return <Page vCentre>
        <div className={"homeLead"}>Welcome to RACTF!</div>
        <div className={"cardRow"}>
            {api.user ? <>
                <Link className={"cardTypeLink"} to={"/campaign"}>
                    <div className={"cardTitle"}>Get started on challenges</div>
                    <div>
                        With over 50 challenges, there's something for everyone!
                    </div>
                </Link>
                <Link className={"cardTypeLink"} to={"/leaderboard"}>
                    <div className={"cardTitle"}>Check the leaderboard</div>
                    <div>
                        Compare yourself to others, or just see how everyone is getting on!
                    </div>
                </Link>
            </> : <>
                    {api.configGet("login", true) &&
                        <Link className={"cardTypeLink"} to={"/login"}>
                            <div className={"cardTitle"}>Login</div>
                            <div>
                                Been here before? Login to get the most out of the site!
                    </div>
                        </Link>}
                    {api.configGet("registration", true) &&
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
                <div className={"cardTitle"}>69 Users...</div>
                <div>
                    ...have solved 5 challenges, 72 times!
                </div>
            </Link>
            <Link className={"cardTypeLink"} to={"/teams"}>
                <div className={"cardTitle"}>32 Teams...</div>
                <div>
                    ...have an average of 2.3 members each!
                </div>
            </Link>
            <Link className={"cardTypeLink"} to={"/privacy"}>
                <div className={"cardTitle"}>420 people...</div>
                <div>
                    ...have viewed the privacy policy!
                </div>
            </Link>
        </div>
        {api.user && api.user.is_admin &&
            <div className={"cardRow"}>
                <Link className={"cardTypeLink"} to={"/admin"}>
                    <div className={"cardTitle"}>Admin Panel</div>
                    <div>
                        Look at you, you fancy admin. Go do your admin things, why don't you. smh.
                    </div>
                </Link>
            </div>
        }
    </Page>;
}
