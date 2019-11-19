import React, { useState, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { SectionBlurb } from "../../components/Misc";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import { plugins, Button, apiContext } from "ractf";

import "./Campaign.scss";


export default () => {
    const [challenge, setChallenge] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [lState, setLState] = useState({});

    const [activeTab, setActiveTab] = useState(0);
    const [sbHidden, setSbHidden] = useState(false);
    //const app = useContext(appContext);
    const api = useContext(apiContext);

    const showChallenge = (challenge) => {
        return () => {
            //app.setModalOpen(true);
            setChallenge(challenge);
            setIsEditor(false);
        }
    };

    const showEditor = (challenge, saveTo) => {
        return () => {
            console.log('!!', saveTo);

            setChallenge(challenge || {});
            setLState({
                saveTo: saveTo
            })
            setIsEditor(true);
        }
    };

    const hideChal = () => {
        setChallenge(null);
        setIsEditor(false);
    };

    const saveEdit = (original) => {
        return changes => {
            console.log(changes);
            for (let i in changes) {
                original[i] = changes[i];
            }

            if (lState.saveTo) {
                lState.saveTo.push(original);
            }

            setIsEditor(false);
            setChallenge(null);
        }
    };

    if (!api.challenges)
        api.challenges = [];

    let tab = api.challenges[activeTab];
    let chalEl, handler, challengeTab;
    if (tab) {
        handler = plugins.categoryType[tab.type];
        if (!handler) {
            challengeTab = <>
                Category renderer for type "{tab.type}" missing!<br /><br />
                Did you forget to install a plugin?
            </>
        } else {
            challengeTab = <>
                <SectionBlurb>{tab.desc}</SectionBlurb>
                {React.createElement(handler.component, { challenges: tab, showChallenge: showChallenge, showEditor: showEditor, isEdit: edit })}
            </>
        }

        if (challenge || isEditor) {
            if (challenge.type)
                handler = plugins.challengeType[challenge.type];
            else
                handler = plugins.challengeType["__default"];

            if (!handler)
                chalEl = <>
                    Challenge renderer for type "{challenge.type}" missing!<br /><br />
                    Did you forget to install a plugin?
                </>;
            else {
                chalEl = React.createElement(
                    handler.component, {
                    challenge: challenge, hideChal: hideChal,
                    isEditor: isEditor, saveEdit: saveEdit
                })
            }

            chalEl = <Modal onHide={hideChal}>
                {chalEl}
            </Modal>;
        }
    }

    return <Page title={"Challenges"} selfContained>
        {chalEl}
        <div style={{ display: "flex", flexGrow: "1" }}>
            <div className={"sbWrapWrap"}><div className={"sbWrap"}>
                <div className={"campSidebar" + (sbHidden ? " sbHidden" : "")}>
                    <div className={"head"}>Categories</div>
                    {api.challenges.map((tab, n) =>
                        <div key={n} className={activeTab === n ? "active" : ""}
                            onClick={() => { setActiveTab(n) }}
                        >{tab.name}</div>
                    )}
                </div>
                <div className={"sbBurger" + (sbHidden ? " sbHidden" : "")} onClick={() => setSbHidden(!sbHidden)}><MdKeyboardArrowLeft /></div>
            </div></div>
            <div className={"challengeBody"}><div>
                { api.user.is_admin ? edit ? 
                    <Button className={"campEditButton"} click={() => {setEdit(false)}} warning>Stop Editing</Button>
                    : <Button className={"campEditButton"} click={() => {setEdit(true)}} warning>Edit</Button> : null}

                {challengeTab}
            </div></div>
        </div>
    </Page>;
};
