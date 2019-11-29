import React, { useContext, useState } from "react";
import { GiCaptainHatProfile } from "react-icons/gi";
import zxcvbn from "zxcvbn";

import { Page, HR, ButtonRow, TabbedView, Button, Form, FormError, Input, apiContext, appContext } from "ractf";

import "./SettingsPage.scss";


const makeOwner = (api, app, member) => {
    return () => {
        app.promptConfirm({ message: "Are you sure you want to make " + member.name + " the new team owner?\n\nYou will cease to own the team!", small: true }).then(() => {
            // Kick 'em
            api.modifyTeam(api.team.id, {captain: member.id}).then(() => {
                app.promptConfirm({message: "You are no longer the team captain!", noCancel: true, small: true});
                api.setup();
            }).catch(e => {
                app.promptConfirm({message: "Error: " + api.getError(e), noCancel: true, small: true});
            });
        }).catch(() => {
        });
    }
};


const TeamMember = ({ api, app, member, isOwner, isCaptain }) => {
    return <div className={"memberTheme"}>
        <div className={"memberIcon" + (isOwner ? " clickable" : "") + (isCaptain ? " active" : "")} onClick={isOwner ? makeOwner(api, app, member) : null}><GiCaptainHatProfile /></div>
        {/*(isOwner && !isCaptain) && <div className={"memberIcon clickable bad"} onClick={kickMember(api, app, member)}><GiThorHammer /></div>*/}
        <div>
            {member.name}
        </div>
    </div>
};


export default () => {
    const api = useContext(apiContext);
    const app = useContext(appContext);

    const [unError, setUnError] = useState("");
    const [pfError, setPfError] = useState("");
    const [pwError, setPwError] = useState("");
    const [teamError, setTeamError] = useState("");

    const changePassword = ({ old, new1, new2 }) => {
        if (!old)
            return setPwError("Current password required");
        if (!new1 || !new2)
            return setPwError("New password required");
        if (new1 !== new2)
            return setPwError("Passwords must match");
        
        const strength = zxcvbn(new1);
        if (strength.score < 3)
            return setPwError((strength.feedback.warning || "Password too weak.") + "\n" + strength.feedback.suggestions);

        api.modifyUser(api.user.id, {oPass: old, nPass: new1}).then(() => {
            app.alert("Password changed. Please log back in.");
            api.logout();
        }).catch(e => {
            setPwError(api.getError(e));
        });
    };

    const changeUsername = ({ name }) => {
        if (!name)
            return setUnError("Username required");
        if (name === api.user.username)
            return setUnError("Username has not changed");

        api.modifyUser(api.user.id, {name: name}).then(() => {
            app.alert("Username changed. Please log back in.");
            api.logout();
        }).catch(e => {
            setUnError(api.getError(e));
        });
    };

    const updateDetails = ({ discord, discordid, twitter, reddit, bio }) => {
        api.modifyUser(api.user.id, {discord: discord, discordid: discordid, twitter: twitter, reddit: reddit, bio: bio}).then(() => {
            app.alert("Personal details updated succesfully.");
            api.setup();
            setPfError(null);
        }).catch(e => {
            setPfError(api.getError(e));
        });
    };

    const alterTeam = ({ name, desc, pass }) => {
        api.modifyTeam(api.team.id, {name: name, description: desc, password: pass}).then(() => {
            app.alert("Team details updated succesfully.");
            api.setup();
            setTeamError(null);
        }).catch(e => {
            setTeamError(api.getError(e));
        });
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
                    <label htmlFor={"name"}>Username</label>
                    <Input name={"name"} val={api.user.username} limit={36} placeholder={"Username"} />

                    {unError && <FormError>{unError}</FormError>}
                    <Button submit>Save</Button>
                </Form>
                <HR />
                <Form handle={changePassword}>
                    <Input password name={"old"} placeholder={"Current Password"} />
                    <Input zxcvbn password name={"new1"} placeholder={"New Password"} />
                    <Input password name={"new2"} placeholder={"New Password"} />

                    {pwError && <FormError>{pwError}</FormError>}
                    <Button submit>Change Password</Button>
                </Form>
            </div>
            <div label="Profile">
                <Form handle={updateDetails}>
                    <label htmlFor={"discord"}>Discord</label>
                    <Input name={"discord"} val={api.user.social.discord} limit={36} placeholder={"Discord"} />
                    <Input name={"discordid"} val={api.user.social.discordid} format={/\d+/} limit={18} placeholder={"Discord User ID"} />
                    <label htmlFor={"twitter"}>Twitter</label>
                    <Input name={"twitter"} val={api.user.social.twitter} limit={36} placeholder={"Twitter"} />
                    <label htmlFor={"reddit"}>Reddit</label>
                    <Input name={"reddit"} val={api.user.social.reddit} limit={36} placeholder={"Reddit"} />

                    <label htmlFor={"bio"}>Bio</label>
                    <Input name={"bio"} rows={5} val={api.user.bio} limit={400} placeholder={"Bio"} />

                    {pfError && <FormError>{pfError}</FormError>}
                    <Button submit>Save</Button>
                </Form>
            </div>
            <div label="Team">
                {api.team ? <>
                    <Form handle={alterTeam} locked={!teamOwner}>
                        <Input val={api.team.name} name={"name"} limit={36} placeholder={"Team Name"} />
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
