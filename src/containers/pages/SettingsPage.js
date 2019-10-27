import React, { useContext, useState } from "react";
import { GiCaptainHatProfile, GiThorHammer } from "react-icons/gi";
import styled, { css } from "styled-components";

import { Page, HR, ButtonRow, TabbedView, Button, Form, FormError, Input, apiContext, appContext } from "ractf";

import theme from "theme";

const OptionTitle = styled.p`
    font-size: 1.3em;
    text-align: left;
    margin: .3em 8px;
    margin-top: 16px;
    &:first-child {
        margin-top: 8px;
    }
`;


const Row = styled.div`
    display: flex;
    margin-bottom: 16px;
    
    &>* {
        flex-grow: 1;
        min-width: auto;
        width: auto;
        margin: 0;
        margin-right: 8px;
    }
    &>*:last-child {
        flex-grow: 0;
        margin-right: 0;
    }
`;



const MemberTheme = styled.div`
    display: flex;
    text-align: left;
    font-size: 1.2em;
    padding: 2px 16px;

    >*:last-child {
        flex-grow: 1;
        width: 100%;
        word-break: break-all;
    }
    >* {
        flex-shrink: 0;
    }
`;


const MemberIcon = styled.div`
    font-size: 1.5em;
    margin-right: 12px;
    opacity: .2;

    ${props => props.clickable && css`
        cursor: pointer;
        transition: 200ms ease opacity;

        &:hover {
            opacity: 1;
        }
    `}
        
    ${props => props.bad && css`color: ${theme.red}`}
    ${props => props.active && css`opacity: 1; cursor: default; color: ${theme.bgreen}`}
`;


const kickMember = (api, app, member) => {
    return () => {
        app.promptConfirm({ message: "Are you sure you want to remove " + member.name + " from your team?", small: true }).then(() => {
            // Kick 'em
        }).catch(() => {
        });
    }
}


const makeOwner = (api, app, member) => {
    return () => {
        app.promptConfirm({ message: "Are you sure you want to make " + member.name + " the new team owner?\n\nYou will cease to own the team!", small: true }).then(() => {
            // Kick 'em
        }).catch(() => {
        });
    }
}


const TeamMember = ({ api, app, member, isOwner, isCaptain }) => {
    return <MemberTheme>
        <MemberIcon clickable={isOwner} onClick={isOwner ? makeOwner(api, app, member) : null} active={isCaptain}><GiCaptainHatProfile /></MemberIcon>
        {(isOwner && !isCaptain) && <MemberIcon onClick={kickMember(api, app, member)} clickable bad><GiThorHammer /></MemberIcon>}
        <div>
            {member.name}
        </div>
    </MemberTheme>
}


export default () => {
    const api = useContext(apiContext);
    const app = useContext(appContext);

    const [unError, setUnError] = useState("");
    const [pwError, setPwError] = useState("");
    const [teamError, setTeamError] = useState("");

    const changePassword = ({ old, new1, new2 }) => {
        if (!old)
            return setPwError("Current password required");
        if (!new1 || !new2)
            return setPwError("New password required");
        if (new1 !== new2)
            return setPwError("Passwords must match");

        api.modifyUser({oPass: old, nPass: new1}).then(() => {
            setPwError(null);
        }).catch(e => {
            setPwError(e.toString());
        });
    };

    const changeUsername = ({ name }) => {
        if (!name)
            return setUnError("Username required");

        api.modifyUser({name: name}).then(() => {
            setUnError(null);
        }).catch(e => {
            setUnError(e.toString());
        });
    };

    const alterTeam = ({ name, desc, pass }) => {
        setTeamError("Not implemented!");
    }

    const teamOwner = (api.team ? api.team.owner.id === api.user.id : null);

    return <Page title={"Settings for " + api.user.username}>
        <TabbedView>
            <div label="User">
                {
                    api.user['2fa_status'] !== "on" && <>
                        <FormError>Your account has 2 factor authentication <b>DISABLED</b></FormError>
                        <Button to={"/settings/2fa"}>Enable 2FA Now!</Button>
                        <HR />
                    </>
                }

                <Form handle={changeUsername}>
                    <OptionTitle>Username</OptionTitle>
                    <Input name={"name"} val={api.user.username} limit={36} placeholder={"Username"} />

                    {unError && <FormError>{unError}</FormError>}
                    <Button submit>Save</Button>
                </Form>
                <HR />
                <Form handle={changePassword}>
                    <Input password name={"old"} placeholder={"Current Password"} />
                    <Input password name={"new1"} placeholder={"New Password"} />
                    <Input password name={"new2"} placeholder={"New Password"} />

                    {pwError && <FormError>{pwError}</FormError>}
                    <Button submit>Change Password</Button>
                </Form>
            </div>
            <div label="Team">
                {api.team ? <>
                    <Form handle={alterTeam} locked={!teamOwner}>
                        {teamOwner ?
                            <Input val={api.team.name} name={"name"} limit={36} placeholder={"Team Name"} />
                            : <Row>
                                <Input val={api.team.name} name={"name"} limit={36} placeholder={"Team Name"} />
                                <Button warning>Leave Team</Button>
                            </Row>}
                        <Input val={api.team.description} name={"desc"} rows={5} placeholder={"Team Description"} />
                        <Input val={api.team.password} name={"pass"} password placeholder={"Team Password"} />

                        {teamError && <FormError>{teamError}</FormError>}
                        {teamOwner && <Button submit>Modify Team</Button>}
                    </Form>
                </> : <div label="Team">
                    You are not in a team!
                    <br /><br />
                    To be able to participate, you must join or create a team (even if you never invite anyone).
                    <HR />
                    <ButtonRow>
                        <Button to={"/team/join"}>Join a Team</Button>
                        <Button to={"/team/new"}>Create a Team</Button>
                    </ButtonRow>
                </div>}
            </div>
            {api.team &&
                <div label="Team Members">
                    <br />
                    {api.team.members.map((i, n) => <TeamMember key={n} api={api} app={app} isCaptain={i.id === api.team.owner.id} isOwner={teamOwner} member={i} />)}
                </div>
            }
        </TabbedView>
    </Page>;
};
