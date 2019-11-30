import React, { useState, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { SectionBlurb, SectionTitle2 } from "../../components/Misc";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import { plugins, Button, apiContext, Input, Form, FormError } from "ractf";

import "./Campaign.scss";


const ANC = ({ hide, anc }) => {
    const api = useContext(apiContext);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");

    const create = ({ cname, cdesc }) => {
        if (!cname.length)
            return setError("No name provided!");

        setLocked(true);
        
        (anc ? api.editGroup(anc.id, cname, cdesc) : api.createGroup(cname, cdesc)).then(async resp => {
            await api.setup();
            hide();
        }).catch(e => {
            setError(api.getError(e));
            setLocked(false);
        });
    }

    return <Modal onHide={hide} title={"Hi"}>
        <Form locked={locked} handle={create}>
            <SectionTitle2>{anc ? "Edit" : "Add new"} category</SectionTitle2>
            <label htmlFor={"cname"}>Catgeory name</label>
            <Input val={anc && anc.name} name={"cname"} placeholder={"Catgeory name"} />
            <label htmlFor={"cdesc"}>Catgeory brief</label>
            <Input val={anc && anc.desc} name={"cdesc"} rows={5} placeholder={"Category brief"} />
            {error && <FormError>{error}</FormError>}
            <Button submit>{anc ? "Edit" : "Add"} Category</Button>
        </Form>
    </Modal>;
}


export default () => {
    const [challenge, setChallenge] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [lState, setLState] = useState({});
    const [anc, setAnc] = useState(false);

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
                {edit && <Button click={()=>setAnc(tab)}>Edit Details</Button>}
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
        {anc && <ANC anc={anc} hide={() => setAnc(false)} />}
        <div style={{ display: "flex", flexGrow: "1" }}>
            <div className={"sbWrapWrap"}><div className={"sbWrap"}>
                <div className={"campSidebar" + (sbHidden ? " sbHidden" : "")}>
                    <div className={"head"}>Categories</div>
                    {api.challenges.map((tab, n) =>
                        <div key={n} className={activeTab === n ? "active" : ""}
                            onClick={() => { setActiveTab(n) }}
                        >{tab.name}</div>
                    )}
                    <div className={"sbSpace"} />
                    <div onClick={e => setAnc(true)} style={{ textAlign: "center" }}>Add New Category</div>
                </div>
                <div className={"sbBurger" + (sbHidden ? " sbHidden" : "")} onClick={() => setSbHidden(!sbHidden)}><MdKeyboardArrowLeft /></div>
            </div></div>
            <div className={"challengeBody"}><div>
                {api.user.is_admin ? edit ?
                    <Button className={"campEditButton"} click={() => { setEdit(false) }} warning>Stop Editing</Button>
                    : <Button className={"campEditButton"} click={() => { setEdit(true) }} warning>Edit</Button> : null}

                {challengeTab}
            </div></div>
        </div>
    </Page>;
};
